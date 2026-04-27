Library Management System (MERN Stack)
A full-stack Library Management System built using the MERN stack that allows users to browse books, borrow/reserve them, and submit reviews. Admins can manage books, users, and review approvals.

---

Live Demo
- Frontend: https://librarymanagemsystem.netlify.app/login
- Backend API: https://library-management-system-backend-jkpg.onrender.com

---

Demo Credentials

User
- Email: poona@gmail.com
- Password: poona123

Admin
- Email: chitra@gmail.com
- Password: poona123


How to Test
User Flow
1. Login using user credentials
2. Browse books from dashboard
3. Click any book to view details
4. Click "Borrow Book" (if available)
5. If not available → click "Reserve"
6. Add a review (rating + comment)
7. View borrow history

Admin Flow
1. Login using admin credentials
2. Add / Edit / Delete books
3. Navigate to Reviews section
4. Approve / Reject user reviews
5. Manage users

Features
User Features
- Register & Login (JWT Authentication)
- Browse books with search & filters
- View detailed book information
- Borrow / Reserve books
- Submit reviews (approval-based)
- View borrowing history
- Receive notifications

Admin Features
- Admin dashboard
- Add / Edit / Delete books
- Manage users (role updates, delete)
- Approve / Reject reviews
- View activity & analytics

🧱 Tech Stack

Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

Other Tools
- Cloudinary (Image Storage)
- Razorpay (Payments)
- Nodemailer (Email Notifications)
- Render (Backend Hosting)
- Netlify (Frontend Hosting)


Project Structure
/backend
  /controllers
  /models
  /routes
  /middlewares
  /utils

/frontend
  /components
  /pages
  /context
  /services

---

⚠️ Known Issues
- Reviews require admin approval before display
- Reservation triggers only when book is unavailable
- UI is basic and can be further enhanced

🔮 Future Improvements
- Advanced analytics dashboard (charts)
- Real-time notifications (Socket.io)
- Wishlist / Favorites
- Infinite scroll & pagination improvements
- Mobile UI optimization

📝 Important Notes

- ".env" files are not included for security reasons
- Do not commit sensitive credentials
- Images are stored using Cloudinary

---

👨‍💻 Author

Raguram KC

---

📬 API Documentation

https://documenter.getpostman.com/view/11270312/2sBXqDuPWg
