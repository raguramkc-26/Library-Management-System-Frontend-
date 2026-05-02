Library Management System (MERN Stack)
A full-stack Library Management System built with the MERN stack that enables users to browse, borrow, reserve, and review books, while providing admins with complete control over books, users, and moderation workflows.

---

Live Demo
- Frontend: https://librarymanagemsystem.netlify.app/login
- Backend API: https://library-management-system-backend-jkpg.onrender.com

---

Demo Credentials
User
- Email: "poona@gmail.com"
- Password: "poona123"

Admin
- Email: "chitra@gmail.com"
- Password: "poona123"

---

Key Highlights (What makes this project strong)
- JWT-based authentication with protected routes
- RESTful API design with role-based access control
- Borrow / Return system with reservation queue handling
- Review system with admin approval workflow
- Cloudinary integration for image uploads
- Admin dashboard with system insights
- Payment integration (Razorpay ready)
- Email notifications (Resend / Nodemailer)

---

Core Features
User
- Register & login securely (JWT)
- Browse and search books
- Borrow available books
- Reserve unavailable books (queue system)
- Submit reviews (admin approval required)
- View borrowing history
- Receive system notifications

---

Admin
- Add, edit, delete books
- Manage users (role update & deletion)
- Approve / reject reviews
- View system analytics
- Monitor borrowing activity

---

Tech Stack
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

Integrations
- Cloudinary – image storage
- Razorpay – payments
- Resend / Nodemailer – email service
- Render – backend hosting
- Netlify – frontend hosting

---

Architecture Overview
- Modular backend structure (Controller → Route → Middleware → Model)
- Centralized API services in frontend
- Role-based route protection (User/Admin)
- Clean separation of concerns across layers

---

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

System Flow (Simplified)
1. User logs in → receives JWT
2. JWT is attached to all API requests
3. Borrow / Reserve actions update DB state
4. Admin moderates reviews before publishing
5. Notifications & emails triggered for key actions

---

Known Limitations
- Review system requires manual admin approval
- Reservation queue lacks expiry handling
- No retry mechanism for failed emails
- Limited pagination and filtering

---

Future Improvements
- Real-time notifications (Socket.io)
- Advanced analytics dashboard
- Fine payment integration (Razorpay)
- Reservation expiry system
- Mobile-first UI optimization
- Redis-based queue for scalability

---

Environment Variables
Create a ".env" file in "/backend":
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
RESEND_API_KEY=
CLOUDINARY_URL=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

---

API Documentation
https://documenter.getpostman.com/view/11270312/2sBXqDuPWg

---

Author
Raguram KC

---

Final Note
This project demonstrates full-stack development skills including API design, authentication, role-based access control, and integration with third-party services. It reflects a transition from beginner-level CRUD applications to structured, scalable system design.
