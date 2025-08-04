<img width="1912" height="1005" alt="image" src="https://github.com/user-attachments/assets/ac246811-5e9f-44c1-bfe1-91afc8724aa4" />
Trong module giám sát mực nước đầu nguồn, nhóm sử dụng cảm biến đo mức nước bằng sóng siêu âm EL-ULS-02 sử dụng nguyên lý phản xạ sóng âm để đo khoảng cách từ cảm biến đến mặt nước. Trong ứng dụng nông nghiệp, cụ thể ở đây cảm biến này được lắp đặt phía trên hồ chứa nước, thường gắn cố định trên thanh giá hoặc mái che. Khi cảm biến phát sóng siêu âm xuống mặt nước, sóng sẽ phản xạ trở lại và cảm biến tính toán thời gian truyền – nhận để xác định khoảng cách đến mặt nước. Từ đó, hệ thống sẽ suy ra mực nước thực tế trong hồ. Phương pháp này giúp theo dõi lượng nước còn lại, tự động cảnh báo khi mực nước xuống thấp để có kế hoạch đóng mở đập nước và điều tiết nước trong quá trình trồng trọt, góp phần tối ưu hóa việc sử dụng tài nguyên nước trong nông nghiệp.
Project gồm 2 phần.
I. OHSTEM CODE
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d34e0392-9487-4d7e-a781-86c05262e148" />
1. Truy cập web ohstem.
2. Bấm nút "Nhập Project".
3. 
4. Boot lại Yolo UNO và cập nhật firmware của Ohsteam qua trang http://fw.ohstem.vn/.
5. Kết nối Yolo UNO của trạm bằng Wifi hoặc Serial và cập nhật thư viện.
6. Bấm nút Boot để chạy code vào Yolo UNO
II. Web server (Không bắt buộc)
1. Chạy thonny và kết nối với esp32 hoặc Yolo UNO hoặc các thiết bị vi điều khiển hỗ trợ micro Python
2. 
