# Install on Raspberry Pi

Make sure you have Node.js and git installed on your pi.

```bash
sudo apt-get update
sudo apt-get install wiringpi
git clone https://github.com/CommonGarden/Fermenter
cd Fermenter/driver
npm install
sudo node fermenter.js
```

# Hardware setup / Bill of materials.

Item             | Quantity | Cost | Link
-----------------|----------|------|------------------------------
Raspberry Pi Model 3B   | 1  | $35  | https://www.adafruit.com/product/3055?src=raspberrypi
Relay Board | 1 | $23.99 | https://www.amazon.com/Waveshare-Board-Relay-Appliances-Intelligent/dp/B01FZ7XLJ4
Tentacle T3 Board | 1 | $91 | https://www.whiteboxes.ch/shop/tentacle-t3-for-raspberry-pi/
pH Probe | 1 | $7.39 | https://www.aliexpress.com/item/New-Arrival-PH-Electrode-Probe-BNC-Connector-for-Aquarium-PH-Controller-Meter-Sensor-gib-Best-Promotion/32781193789.html
Atlas Scientific pH Board | 1 | $38 | https://www.atlas-scientific.com/product_pages/circuits/ezo_ph.html
Oxidation-Reduction Potential (ORP) Probe | 1 | $41.95 | https://www.amazon.com/gp/product/B007Z4GBSY/
Atlas Scientific ORP Board | 1 | $38 | https://www.atlas-scientific.com/product_pages/circuits/ezo_orp.html
Atlas Scientific Dissolved Oxygen (DO) Probe | 1 | $198 | https://www.atlas-scientific.com/product_pages/probes/do_probe.html
Atlas Scientific DO Board | 1 | $44 | https://www.atlas-scientific.com/product_pages/circuits/ezo_do.html


## Images
Fermenter:
![Fermenter](https://user-images.githubusercontent.com/3916616/31311866-302be5d8-ab6a-11e7-9963-6187714b8f64.jpg)

Inside Control box:
![Inside Control box](https://user-images.githubusercontent.com/3916616/31311864-302a24d2-ab6a-11e7-9593-81c027f5dcda.jpg)


