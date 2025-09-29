import os, json, asyncio
from fastapi import FastAPI, HTTPException
import paho.mqtt.client as mqtt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

MQTT_HOST = os.getenv("MQTT_HOST", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "kiosk/pickup/box_delivered")
mqtt_client = None
mqtt_connected = False

# Configure CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=False,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

def on_connect(c, u, f, rc, p=None):
    global mqtt_connected
    mqtt_connected = (rc == 0)
    print("[MQTT] connect rc=", rc)

def on_disconnect(c, u, rc, p=None):
    global mqtt_connected
    mqtt_connected = False
    print("[MQTT] disconnect rc=", rc)

@app.on_event("startup")
def startup_mqtt():
    global mqtt_client
    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_disconnect = on_disconnect
    mqtt_client.reconnect_delay_set(2, 30)
    mqtt_client.loop_start()
    mqtt_client.connect_async(MQTT_HOST, MQTT_PORT, keepalive=60)

@app.on_event("shutdown")
def shutdown_mqtt():
    if mqtt_client:
        mqtt_client.loop_stop()
        mqtt_client.disconnect()

async def mqtt_publish(topic: str, payload, qos=1, retain=False, timeout=3.0):
    if not mqtt_client or not mqtt_connected:
        raise HTTPException(status_code=503, detail="MQTT not connected")
    data = payload if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False)
    info = mqtt_client.publish(topic, data, qos=qos, retain=retain)
    if qos == 0: return
    loop = asyncio.get_running_loop()
    await asyncio.wait_for(loop.run_in_executor(None, info.wait_for_publish), timeout=timeout)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/scan")
async def read_scan():
    # 1) публикуем событие в MQTT
    await mqtt_publish(MQTT_TOPIC, {"box_id":"box001"}, qos=1)

    # 2) только после успешной публикации — отдаём HTTP-ответ
    return {
        "status": "success",
        "message": "Scan processed successfully"
    }
