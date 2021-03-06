const Grow = require('Grow.js');
const raspio = require('raspi-io');
const five = require('johnny-five');
const later = require('later');
const _ = require('underscore');
const spawn = require('child_process').spawn;

// Use local time, not UTC.
later.date.localTime();

// Declare variables
let pH_reading,
  eC_reading,
  DO_reading,
  orp_reading,
  emit_data,
  water_temp,
  heater,
  doser,
  circ_pump,
  multi,
  level,
  level_ref,
  bioreactor,
  lux;

// Create a new board object
const board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
	// Define variables
	circ_pump = new five.Pin('GPIO26');
	doser = new five.Pin('GPIO21');
	heater = new five.Pin('GPIO20');

  bioreactor = new Grow({
    uuid: 'fermeow',
    token: 'fermeow',
    component: 'BioReactor',
    properties: {
      light_state: null,
      heater: 'off',//1
      circ_pump: 'off',//2
      doser: 'off',//3
      water_level: null,
      duration: 2000,
      interval: 60000,
      threshold: 50,
      growfile: {
        name: 'Yeast',
        version: '0.1.0', // Not grower tested, any recommendations?
        phases: {
          ferment: {
            length: '2 days',
            targets: {
              // Expect pH to be ~4 when done
              ph: {
                min: 3.5,
                max: 9.0,
              },

              // Goes down over time
              dissolved_oxygen: {
                min: 1.0,
              },

              temperature: {
                max: 38
              },

              water_temperature: {
                min: 24,
                ideal: 32,
                max: 36,
                pid: {
                  k_p: 200,
                  k_i: 0,
                  k_d: 100,
                  dt: 1
                }
              }
            },

            // Cycles are function that have a 'schedule' property
            cycles: {
              feed: {
                schedule: 'after 6:00am',
              }
            }
          }
        }
      }
    },

    start: function () {
      console.log('Grow-Hub initialized.');

      // This must be called prior to any I2C reads or writes.
      // See Johnny-Five docs: http://johnny-five.io
      board.i2cConfig();


      // board.i2cRead(0x64, 32, (bytes)=> {
      //   let eC = this.parseAtlasEC(bytes);
      //   if (eC) eC_reading = eC;
      // });

      board.i2cRead(0x63, 7, (bytes)=> {
        let pH = this.parseAtlasPH(bytes);
        if (pH) pH_reading = pH;
      });

      board.i2cRead(0x62, 7, (bytes)=> {
        let orp = Number(this.parseAtlasPH(bytes));
        if (orp) orp_reading = orp;
      });

      board.i2cRead(0x61, 14, (bytes)=> {
        let DO = this.parseAtlasDissolvedOxygen(bytes);
        if (DO) DO_reading = DO;
      });

      this.circ_pump_off();
      this.doser_off();
      this.heater_off();

      // try {
      //   multi = new five.Multi({
      //     controller: 'BME280'
      //   });

      //   // Uncomment to enable light sensor.
      //   lux = new five.Light({
      //     controller: 'TSL2561'
      //   });
      // } catch (error) {
      //   console.log(error);
      // }

      var interval = this.get('interval');

      emit_data = setInterval(()=> {
        let py = spawn('python', ['max31865.py']);

        py.stdout.on('data', (data)=> {
          console.log("Water temperature: " + data.toString());
          this.emit('water_temperature', Number(data.toString()));
        });

        let am2320 = spawn('python', ['am2320.py']);

        am2320.stdout.on('data', (data)=> {
          let readings = data.toString().split(' ');
          let temperature = Number(readings[0]);
          let humidity = Number(readings[1].replace(/(\r\n|\n|\r)/gm,""));
          console.log('Temperature: ' + temperature);
          console.log('Humidity: ' + humidity)
          this.emit('temperature', temperature);
          this.emit('humidity', humidity);
        });

        this.circ_pump_on();
        setTimeout(()=> {
          this.circ_pump_off();
          this.ph_data();
          this.orp_data();
          this.do_data();
        }, 4000)
      // Interval should be at the lowest a minute.
      // circ_pump needs time to rest.
      }, interval >= 60000 ? interval: 60000);

      let growfile = this.get('growfile');
      this.startGrow(growfile);

      let threshold = this.get('threshold');

      // Turn the heater on or off. Gee, wouldn't it be nice to do this stuff with a gui?
      this.on('correction', (key, correction)=> {
        let heater_state = this.get('heater');
        if (correction > threshold) {
          if (heater_state === 'off') {
            this.heater_on();
          }
        } else {
          if (heater_state !== 'off') {
            this.heater_off();
          }
        }
      });

      this.emit('message', 'Running')
    },

    stop: function () {
      this.emit('message', 'Stopped');
      clearInterval(emit_data);
      this.removeAllListeners();
      this.removeTargets();
    },

    restart: function () {
      this.emit('message', 'Restarting');
      this.stop();
      this.start();
    },
    
    feed: function () {
    	console.log('Feeding time!');
    },

    day: function () {
      console.log('It is day!');
    },

    night: function () {
      console.log('It is night!');
    },

    doser_on: function () {
      doser.low();
      this.set('doser', 'on');
    },

    doser_off: function () {
      doser.high();
      this.set('doser', 'off');
    },

    circ_pump_on: function () {
      circ_pump.low();
      // console.log("circ_pump on")
      this.set('circ_pump', 'on');
    },

    circ_pump_off: function () {
      circ_pump.high();
      // console.log("circ_pump off")
      this.set('circ_pump', 'off');
    },

    heater_on: function () {
      heater.low();
      this.set('heater', 'on');
    },

    heater_off: function () {
      heater.high();
      this.set('heater', 'off');
    },

    ec_data: function () {
      // Request a reading, 
      board.i2cWrite(0x64, [0x52, 0x00]);

      this.emit('ec', eC_reading);

      console.log('Conductivity: ' + eC_reading);
    },

    orp_data: function () {
      board.i2cWrite(0x62, [0x52, 0x00]);

      this.emit('orp', orp_reading);

      console.log('ORP: ' + orp_reading);
    },

    ph_data: function () {
      // Request a reading
      board.i2cWrite(0x63, [0x52, 0x00]);

      this.emit('ph', pH_reading);

      console.log('ph: ' + pH_reading);
    },

    do_data: function () {
      // Request a reading
      board.i2cWrite(0x61, [0x52, 0x00]);

      this.emit('dissolved_oxygen', DO_reading);

      console.log('Dissolved oxygen: ' + DO_reading);
    },

    water_temp_data: function () {
      if (!_.isUndefined(water_temp)) {
        this.emit('water_temperature', water_temp);

        console.log('Temperature: ' + water_temp);
      }
    },

    light_data: function () {
      if (!_.isUndefined(lux)) {
        let light_data = lux.level;

        this.emit('lux', light_data);

        console.log('Lux: ' + light_data)
      }
    },

    air_pressure_data: function () {
      if (!_.isUndefined(multi)) {
        var pressure = multi.barometer.pressure;

        this.emit('pressure', pressure);

        console.log('Pressure: ' + pressure);
      }
    },

    temp_data: function () {
      if (!_.isUndefined(multi)) {
        var temperature = multi.barometer.pressure;

        this.emit('temperature', temperature);

        console.log('Temperature: ' + temperature);
      }
    },

    hum_data: function () {
      if (!_.isUndefined(multi)) {
        var currentHumidity = multi.hygrometer.relativeHumidity;

        this.emit('humidity', currentHumidity);

        console.log('Humidity: ' + currentHumidity);
      }
    }
  });

  bioreactor.connect({
    host: 'grow.commongarden.org',
    port: 443,
    ssl: true
  });
});

board.on('exit', ()=> {
  console.log('Turning things off.');
  bioreactor.call('circ_pump_off');
  bioreactor.call('heater_off');
  bioreactor.call('doser_off');
});
