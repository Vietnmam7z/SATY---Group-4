# 🌊 Hệ thống Giám sát Mực nước Đầu nguồn

## 📌 Mô tả dự án

<img width="1912" height="1005" alt="image" src="https://github.com/user-attachments/assets/ac246811-5e9f-44c1-bfe1-91afc8724aa4" />

Trong module giám sát mực nước đầu nguồn, nhóm sử dụng cảm biến đo mức nước bằng sóng siêu âm **EL-ULS-02** sử dụng nguyên lý phản xạ sóng âm để đo khoảng cách từ cảm biến đến mặt nước.

Trong ứng dụng nông nghiệp, cảm biến này được lắp đặt phía trên hồ chứa nước, thường gắn cố định trên thanh giá hoặc mái che. Khi cảm biến phát sóng siêu âm xuống mặt nước, sóng sẽ phản xạ trở lại và cảm biến tính toán thời gian truyền – nhận để xác định khoảng cách đến mặt nước. Từ đó, hệ thống suy ra mực nước thực tế trong hồ.

Phương pháp này giúp:
- Theo dõi lượng nước còn lại
- Tự động cảnh báo khi mực nước xuống thấp
- Có kế hoạch đóng mở đập nước và điều tiết nước trong quá trình trồng trọt
- Tối ưu hóa việc sử dụng tài nguyên nước trong nông nghiệp

---

## 🧩 Cấu trúc dự án

### I. OHSTEM CODE

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d34e0392-9487-4d7e-a781-86c05262e148" />

1. Truy cập web [OhStem](https://app.ohstem.vn/)
2. Lấy file `week7 - Tram.json.json` từ thư mục Ohstem
3. Bấm nút **"Nhập Project"**
4. Boot lại Yolo UNO và cập nhật firmware tại [fw.ohstem.vn](http://fw.ohstem.vn/)
5. Kết nối Yolo UNO bằng Wifi hoặc Serial và cập nhật thư viện
6. Bấm nút **Boot** để chạy code vào Yolo UNO

---

### II. 🌐 Web Server *(Không bắt buộc)*

1. Chạy **Thonny IDE** và kết nối với ESP32 hoặc Yolo UNO hoặc các thiết bị vi điều khiển hỗ trợ MicroPython
2. Cập nhật tên Wifi và mật khẩu trong file `tram_4_server.py` ở dòng 12 và 13

<img width="270" height="40" alt="image" src="https://github.com/user-attachments/assets/da4e7502-743a-4266-8601-5f13d193e718" />

3. Upload các file trong thư mục `webserver` lên thiết bị
4. Chạy chương trình (Nếu báo lỗi thì thử chạy lại)
5. Nếu chạy thành công, sẽ có thông báo in ra IP. Dùng IP đó để truy cập web từ thiết bị cùng mạng

---

> 📎 *Mọi đóng góp hoặc cải tiến cho dự án đều được hoan nghênh!*

