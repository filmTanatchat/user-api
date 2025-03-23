<!-- @format -->

# User Management API (Express + MySQL)

RESTful API สำหรับจัดการข้อมูลผู้ใช้ ด้วย Node.js (Express) และ MySQL รองรับการทำงานพื้นฐานของระบบผู้ใช้ เช่น เพิ่ม, อ่าน, แก้ไข, ลบ, ค้นหา, กรอง, จัดเรียง, แบ่งหน้า และเพิ่มข้อมูลหลายรายการในครั้งเดียว พร้อมระบบตรวจสอบความถูกต้องของข้อมูลและการจัดการข้อผิดพลาดอย่างเป็นระบบ

---

## ฟีเจอร์ที่มีในระบบ

- ✔ POST /users - เพิ่มผู้ใช้ใหม่
- ✔ GET /users - ดึงรายการผู้ใช้ทั้งหมด
  - รองรับการกรองด้วย `age`, `name`, `email`
  - รองรับการแบ่งหน้า `page`, `limit`
  - รองรับการจัดเรียง `sort` + `order`
- ✔ GET /users/:id - ดึงข้อมูลผู้ใช้รายบุคคล
- ✔ PUT /users/:id - อัปเดตข้อมูลผู้ใช้
- ✔ DELETE /users/:id - ลบผู้ใช้
- ✔ POST /users/bulk-users - เพิ่มผู้ใช้หลายคนในครั้งเดียว
- Validation ตรวจสอบค่าที่รับเข้ามาในทุกคำขอ
- Error Handling รองรับข้อผิดพลาดทั้งฝั่งผู้ใช้และระบบ

---

## โครงสร้างฐานข้อมูล (MySQL)

### Database: `user_management`

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT
);
```
