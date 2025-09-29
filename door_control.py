#!/usr/bin/env python3
# parcel_ready_to_arduino.py
# MQTT: parcel_ready -> send 'o' to Arduino. When Arduino later sends "done",
# publish "success" to all_done.

import argparse
import logging
import os
import threading
import sys

import paho.mqtt.client as mqtt
import serial  # pip install pyserial

TOPIC_PARCEL_READY = "kiosk/pickup/box_delivered"
TOPIC_ALL_DONE     = "kiosk/pickup/all_done"

class ParcelArduinoBridge:
    def __init__(self, client: mqtt.Client, ser: serial.Serial):
        self.client = client
        self.ser = ser
        self.expecting_done = False
        self._stop = threading.Event()

    # ---- MQTT callbacks (v3.1.1 signatures; works with paho v1 or v2) ----
    def on_connect(self, client, userdata, flags, rc):
        logging.info("MQTT connected." if rc == 0 else f"MQTT connect failed rc={rc}")
        client.subscribe([(TOPIC_PARCEL_READY, 1)])
        logging.info(f"Subscribed to '{TOPIC_PARCEL_READY}'")

    def on_message(self, client, userdata, msg):
        payload = msg.payload.decode("utf-8", errors="replace")
        logging.info(f"MQTT RX [{msg.topic}] {payload!r}")

        if msg.topic == TOPIC_PARCEL_READY:
            try:
                # Send single character 'o' (no newline). If your Arduino expects a newline,
                # change to: self.ser.write(b'o\\n')
                self.ser.write(b"o\n")
                self.ser.flush()
                logging.info("serial -> 'o'")
                self.expecting_done = True
            except Exception as e:
                logging.error(f"Serial write failed: {e}")

    def on_disconnect(self, client, userdata, rc):
        logging.info(f"MQTT disconnected rc={rc}")

    # ---- Serial reader thread ----
    def serial_reader(self):
        logging.info("Serial reader started; waiting for 'done' from Arduino.")
        try:
            while not self._stop.is_set():
                chunk = self.ser.read(64)  # returns quickly due to timeout
                if chunk and self.expecting_done and b"done" in chunk.lower():
                    logging.info("Got 'done' — publishing all_done='success'")
                    self.client.publish(TOPIC_ALL_DONE, "success", qos=1)
                    self.expecting_done = False
        except Exception as e:
            logging.error(f"Serial reader error: {e}")


    def start(self):
        t = threading.Thread(target=self.serial_reader, daemon=True)
        t.start()

    def stop(self):
        self._stop.set()

def main():
    ap = argparse.ArgumentParser(description="MQTT<->Arduino: parcel_ready -> 'o'; 'done' -> all_done='success'")
    ap.add_argument("--host", default=os.getenv("MQTT_HOST", "127.0.0.1"))
    ap.add_argument("--port", type=int, default=int(os.getenv("MQTT_PORT", "1883")))
    ap.add_argument("--client-id", default=os.getenv("CLIENT_ID", "parcel-bridge"))
    ap.add_argument("--username", default=os.getenv("MQTT_USER"))
    ap.add_argument("--password", default=os.getenv("MQTT_PASS"))
    ap.add_argument("--serial-port", help="e.g. /dev/ttyUSB0", default="/dev/ttyUSB0")
    ap.add_argument("--baud", type=int, default=9600)
    ap.add_argument("--debug", action="store_true")
    args = ap.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.debug else logging.INFO,
        format="%(asctime)s %(levelname)s: %(message)s",
    )

    # Open serial with a short timeout so the reader loop can check frequently
    ser = serial.Serial(args.serial_port, args.baud, timeout=0.2)

    client = mqtt.Client(client_id=args.client_id, protocol=mqtt.MQTTv311)
    if args.username and args.password:
        client.username_pw_set(args.username, args.password)

    bridge = ParcelArduinoBridge(client, ser)
    client.on_connect = bridge.on_connect
    client.on_message = bridge.on_message
    client.on_disconnect = bridge.on_disconnect

    bridge.start()

    try:
        client.connect(args.host, args.port, keepalive=30)
        logging.info(f"Running. MQTT={args.host}:{args.port}, serial={args.serial_port}@{args.baud}. Ctrl-C to exit.")
        client.loop_forever()
    except KeyboardInterrupt:
        pass
    finally:
        bridge.stop()
        try:
            ser.close()
        except Exception:
            pass

if __name__ == "__main__":
    main()
