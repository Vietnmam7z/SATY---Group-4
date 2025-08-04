from micropyserver import MicroPyServer
from machine import Pin
import _thread
import ujson
import urequests  # HTTP requests
from wifi_connect import start_wifi, get_rssi, rssi_to_bars
import read_value
import re
import gc

# Wi-Fi credentials
SSID = "ACLAB"
PASSWORD = "ACLAB2023"

temp = 0.0
# Initialize web server
server = MicroPyServer(port=80)

# Connect to Wi-Fi
start_wifi(SSID,PASSWORD)

read_value.update()

def get_status(request):
    gc.collect() 
    response = urequests.get(read_value.url, headers=read_value.headers)
    data = response.json()
    temp = read_value.read_sensor_value(data, "temperature")
    liquid_level = read_value.read_sensor_value(data, "liquid_level")
    voltage = read_value.read_sensor_value(data, "voltage")
    mounting_height = read_value.read_sensor_value(data, "mounting_height")
    operating_time = read_value.read_sensor_value(data, "operating_time")
    object_level = read_value.read_sensor_value(data, "level")
    print(temp)
    data = ujson.dumps({
        "temperature": temp,
        "liquid_level": liquid_level,
        "voltage": voltage,
        "mounting_height": mounting_height,
        "level": object_level,
        "operating_time": operating_time,
    })
    server.send("HTTP/1.0 200 OK\r\nContent-Type: application/json\r\n\r\n" + data)

# Serve homepage with latest telemetry
def home(request):
    try:
        with open("home.html") as f:
            html = f.read()
        server.send("HTTP/1.0 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n" + html)
    except:
        server.send("HTTP/1.0 500 Internal Server Error\r\nContent-Type: text/plain\r\n\r\nKhông thể tải giao diện.")
            
def serve_css_home(request):
    with open("home.css") as f:
        css = f.read()
    server.send("HTTP/1.0 200 OK\r\nContent-Type: text/css\r\n\r\n" + css)

def serve_js_home(request):
    try:
        with open("home.js") as f:
            js = f.read()
        server.send("HTTP/1.0 200 OK\r\nContent-Type: application/javascript\r\n\r\n" + js)
    except:
        server.send("HTTP/1.0 404 Not Found\r\nContent-Type: text/plain\r\n\r\nKhông tìm thấy file JS.")
        
    
def send_file(server, filename, content_type):
    try:
        server.send("HTTP/1.0 200 OK\r\n")
        server.send("Content-Type: {}\r\n\r\n".format(content_type))
        with open(filename, "rb") as f:
            while True:
                chunk = f.read(1024)  # đọc 1KB mỗi lần
                if not chunk:
                    break
                server._connect.sendall(chunk)
    except Exception as e:
        server.send("HTTP/1.0 404 Not Found\r\n")
        server.send("Content-Type: text/plain\r\n\r\n")
        server.send("File not found: {}".format(filename))

def handle_image(request):
    send_file(server, "image.png", "image/png")

def update_api_credentials(request):
    try:
        print("📦 Full raw request:\n", request)

        # Tách phần body từ sau header HTTP
        parts = request.split("\r\n\r\n", 1)
        body = parts[1] if len(parts) > 1 else ""
        print("🧾 Payload nhận được:", body)

        data = ujson.loads(body)

        token = data.get("token", "").strip()
        device_id = data.get("device_id", "").strip()

        print("📥 Nhận yêu cầu cập nhật token:", token)
        print("📥 Nhận device ID:", device_id)

        if not token or not device_id:
            server.send("HTTP/1.0 400 Bad Request\r\nContent-Type: application/json\r\n\r\n" +
                        ujson.dumps({ "error": "Thiếu token hoặc device_id." }))
            return

        # Lưu vào file
        read_value.save_credentials("api.txt", token, device_id)

        server.send("HTTP/1.0 200 OK\r\nContent-Type: application/json\r\n\r\n" +
                    ujson.dumps({ "status": "success", "message": "Đã cập nhật api.txt thành công." }))
        read_value.update();
    except Exception as e:
        error_msg = "Lỗi khi xử lý JSON hoặc ghi file: {}".format(str(e))
        print("⚠️", error_msg)
        server.send("HTTP/1.0 500 Internal Server Error\r\nContent-Type: application/json\r\n\r\n" +
                    ujson.dumps({ "error": error_msg }))



server.add_route("/update-api", update_api_credentials, method="POST")
server.add_route("/status", get_status)
server.add_route("/", home)
server.add_route("/home.css", serve_css_home)
server.add_route("/home.js", serve_js_home)
server.add_route("/image.png", handle_image)
server.start()

