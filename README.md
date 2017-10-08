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
Anker 24W USB Power Supply | 1 | $10.99 | https://www.amazon.com/Anker-Charger-PowerPort-PowerIQ-Foldable/dp/B071YMZ4LD
3-Channel Relay Board for RPi| 1 | $23.99 | https://www.amazon.com/Waveshare-Board-Relay-Appliances-Intelligent/dp/B01FZ7XLJ4
12VDC 2A Power Supply | 2 | $3.28 | https://www.aliexpress.com/item/YNL-EU-US-Plug-Power-Adapter-1A-2A-AC-110V-240V-to-DC-12V-for-3528/32815841532.html
Water Pump | 1 | $19.99 | https://www.amazon.com/bayite-BYT-7A006-Circulation-Discharge-2-1GPM/dp/B0196WL55G/
Peristaltic Pump | 1 | $6.01 | https://www.aliexpress.com/item/12V-DIY-Dosing-Pump-Peristaltic-Dosing-Head-For-Aquarium-Lab-A-Laborator-High-Standard-Lab-Analytical/32820693824.html
Fermwrap 40W Fermentation Heater | 1 | $23.95 | https://www.amazon.com/dp/B00TP9MLFE/
Tentacle T3 Board | 1 | $91 | https://www.whiteboxes.ch/shop/tentacle-t3-for-raspberry-pi/
pH Probe | 1 | $7.39 | https://www.aliexpress.com/item/New-Arrival-PH-Electrode-Probe-BNC-Connector-for-Aquarium-PH-Controller-Meter-Sensor-gib-Best-Promotion/32781193789.html
Atlas Scientific pH Board | 1 | $38 | https://www.atlas-scientific.com/product_pages/circuits/ezo_ph.html
Oxidation-Reduction Potential (ORP) Probe | 1 | $41.95 | https://www.amazon.com/gp/product/B007Z4GBSY/
Atlas Scientific ORP Board | 1 | $38 | https://www.atlas-scientific.com/product_pages/circuits/ezo_orp.html
Atlas Scientific Dissolved Oxygen (DO) Probe | 1 | $198 | https://www.atlas-scientific.com/product_pages/probes/do_probe.html
Atlas Scientific DO Board | 1 | $44 | https://www.atlas-scientific.com/product_pages/circuits/ezo_do.html
Air Temperature & Relative Humidity Sensor (AM2320) | 1 | $1.45 |  https://www.aliexpress.com/item/1pcs-AM2320-digital-temperature-and-humidity-sensor-AM2320B-replace-SHT10-SHT11-series/32818920611.html
Temperature Probe (Pt100) | 1 | $0.97 | https://www.aliexpress.com/item/Waterproof-PT100-Platinum-Resister-Temperature-Sensor-Temp-Probe-free-shipping/32385652607.html
Pt100 Interface Board (MAX31865) | 1 | $7.01 | https://www.aliexpress.com/item/CJMCU-31865-MAX31865-RTD-platinum-resistance-temperature-detector-PT100-to-PT1000/32821269399.html



## Images
Fermenter:
![Fermenter](https://user-images.githubusercontent.com/3916616/31311866-302be5d8-ab6a-11e7-9963-6187714b8f64.jpg)

Inside Control box:
![Inside Control box](https://user-images.githubusercontent.com/3916616/31311864-302a24d2-ab6a-11e7-9593-81c027f5dcda.jpg)


