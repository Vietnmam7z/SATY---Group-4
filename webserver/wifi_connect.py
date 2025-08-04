# wifi_connect.py
import esp
import network
import time
import ubinascii

def start_wifi(wlan_id, wlan_pass):
    mac = ubinascii.hexlify(network.WLAN().config('mac'),':').decode()
    print("MAC: " + mac)

    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    while wlan.status() is network.STAT_CONNECTING:
        time.sleep(1)

    while not wlan.isconnected():
        wlan.connect(wlan_id, wlan_pass)

    print("Connected... IP: " + wlan.ifconfig()[0])
    return wlan.ifconfig()[0]  # return IP nếu bạn muốn dùng

def get_rssi():
    """Trả về RSSI hiện tại của kết nối Wi-Fi"""
    sta = network.WLAN(network.STA_IF)
    if sta.isconnected():
        return sta.status('rssi')  # Ví dụ: -45 dBm
    return -100  # Mặc định khi chưa kết nối

def rssi_to_bars(rssi):
    """Chuyển RSSI thành số vạch sóng (0–4)"""
    if rssi >= -50:
        return 4
    elif rssi >= -60:
        return 3
    elif rssi >= -70:
        return 2
    elif rssi >= -80:
        return 1
    else:
        return 0