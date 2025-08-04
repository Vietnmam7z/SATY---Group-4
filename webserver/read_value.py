import urequests

device_id = ""
token = ""
url = ""
headers = {}

def load_credentials(file_path: str):
    try:
        with open(file_path, "r") as f:
            lines = f.readlines()
            if len(lines) >= 2:
                token = lines[0].strip()
                device_id = lines[1].strip()
                return token, device_id
            else:
                print("File thiếu dòng. Cần có JWT và Device ID.")
                return None, None
    except Exception as e:
        print(f"Lỗi đọc file: {str(e)}")
        return None, None

def update():
    global token, device_id, url, headers
    token, device_id = load_credentials("api.txt")
    if token and device_id:
        url = f"https://app.coreiot.io/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries"
        headers = {"Authorization": f"{token}"}
        
def save_credentials(file_path, token, device_id):
    try:
        with open(file_path, "w") as f:
            f.write(token.strip() + "\n")
            f.write(device_id.strip() + "\n")
        print("✅ Đã lưu token và device_id vào", file_path)
        
        # Kiểm tra lại file
        with open(file_path) as f:
            print("📂 Nội dung file mới:")
            print(f.read())

    except Exception as e:
        print(f"⚠️ Lỗi khi ghi file: {str(e)}")


def read_sensor_value(data: dict, key: str):
    try:
        if key in data and len(data[key]) > 0:
            value = float(data[key][0]["value"])
            return value
        else:
            print(f"Không có dữ liệu cho '{key}'.")
            return None
    except Exception as e:
        print(f"Lỗi khi xử lý '{key}': {str(e)}")
        return None