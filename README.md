# XO game !!

วิธีการ setup
```bash
git clone https://github.com/NattawitMana/xo_games.git
cd xo_games
cd backend
npm install
cd ..
cd frontend
npm install
```

วิธีการรัน backend
```bash
node server.js
```

วิธีการรัน frontend
```bash
npm run dev
```

# เกี่ยวกับโปรเจค
การออกแบบระบบ
- frontend : React (Vite)
- backend  : Node.js + Express
- database : MongoDB เพราะเหมาะกับการเก็บ logs, ออกแบบให้เก็บ ขนาดกระดาน, ผู้ชนะ (X, O, D(เสมอ)), เวลาที่บันทึก และ moves เป็น array ที่มี index  อยู่ด้วยเพราะต้องการให้เวลา replay จะเรียงตามที่ได้กดไว้จริงๆ

อัลกอริทึมที่ใช้
- ใช้ Minimax Algorithm ในการออกแบบเนื่องจาก อัลกอริทึมนี้เหมาะกับการเล่นเกมแนว turn base เพราะว่าจะเน้นไปที่ ฝั่งตรงข้ามให้ได้ผลลัพธ์ที่แย่ที่สุดในขณะที่ฝั่งตัวเองทำให้ได้ผลลัพธ์ที่ดีที่สุด
- ใช้ alpha, beta pruning เพื่อ optimize ช่วยในการตัดการหาที่ไม่จำเป็นออก
- ใช้การกำหนด maximum depth ในการหา เพราะถ้าไม่กำหนดความลึก จะทำให้ระบบคิดคำนวณมากไปจนทำให้ค้างได้ โดยในโค้ดกำหนดไว้ที่ 5 แต่ในตาราง 3x3 กำหนดไว้ที่ 9 เพื่อให้ฉลาดที่สุด

เพิ่มเติม
ถ้าเปิดตารางที่ใหญ่ เช่น 10x10 เป็นต้นไปแล้วกดเปิดใช้งาน bot เว็บอาจจะค้างได้