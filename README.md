
# Email · PayPal · Thu nhập (Web/Desktop-ready)

- Backend: Node + Express + SQLite (better-sqlite3)
- Frontend: React (Vite).

## Chạy local
1) Backend
```bash
cd backend
npm install
npm run dev
```
2) Frontend
```bash
cd frontend
npm install
npm run dev
```
Mở http://localhost:5173

## Build production
- Build frontend: `npm run build` (thư mục `dist/`).
- Dùng bất kỳ web server nào (Nginx) và trỏ proxy `/api` về backend.

## Desktop
- Có thể đóng gói bằng Electron/Tauri: load `frontend/dist/index.html` và khởi chạy server backend kèm theo. Tôi có thể thêm gói Electron nếu bạn muốn.
