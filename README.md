# 📚 BrainLock - LMS Platform

A **full-stack Learning Management System (LMS)** built with **Next.js 14, Tailwind CSS, MongoDB, and JWT Authentication**.  
The platform provides separate dashboards for **Students, Teachers, and Admins**, featuring course management, challenges, leaderboards, chatbot support, and user progress tracking.

---

## 🚀 Features

### 🔑 Authentication & Security
* User registration, login, email verification, password reset  
* JWT-based authentication with refresh & access tokens  
* Middleware protection for secured routes  

### 👨‍🎓 Student Dashboard
* Enroll in courses & track progress  
* Attempt challenges & quizzes  
* View scores and achievements  
* Class rank leaderboard  
* **AI-powered chatbot inside courses** for instant help (no distractions, stay focused while learning)  

### 👩‍🏫 Teacher Dashboard
* Create & manage courses, subtopics, and theory content  
* Add MCQs and challenges  
* Monitor student performance  

### 🛠️ Admin Dashboard
* Manage users, courses, and system settings  

### 📊 Additional Features
* Activity logging  
* Email notifications (verification, password reset)  
* Dark/Light mode support  
* Rich text editor for course content  
* Integrated chatbot to assist students during learning sessions  

---

## 🏗️ Tech Stack

**Frontend:**
* Next.js 14 (App Router)  
* Tailwind CSS + Shadcn UI Components  
* Context API (Theme Provider)  

**Backend (API Routes):**
* Next.js API Routes  
* MongoDB + Mongoose  
* JWT Authentication  
* Nodemailer for email services  
* Chatbot integration (AI-powered support for students)  

**Other:**
* ESLint & Prettier for code linting  
* PostCSS & Tailwind for styling  
* Vercel for deployment  

---

## 📂 Project Structure

```
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router
│   │   ├── Dashboard/     # Dashboards for Admin, Student, Teacher
│   │   ├── api/           # API routes (auth, user, teacher, leaderboard, etc.)
│   │   ├── LandingPage/   # Public landing page
│   │   ├── LoginPage/     # Login
│   │   ├── SignupPage/    # Signup
│   │   ├── ForgetPassPage # Forgot password
│   │   └── VerifyEmailPage
│   ├── components/        # UI components & editor
│   ├── context/           # Theme provider/context
│   ├── lib/               # Services (db, email, utils)
│   ├── middlewares/       # Auth middleware
│   ├── models/            # MongoDB models
│   └── utils/             # Helper functions
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AbhishekChoudhary-svu/BrainLock.git
cd BrainLock
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4️⃣ Run the development server

```bash
npm run dev
```

Your app will be running on **[http://localhost:3000](http://localhost:3000)** 🚀

---

## 📬 API Routes Overview

* **Auth** → `/api/auth/login`, `/api/auth/register`, `/api/auth/verifyEmail`, `/api/auth/resetPassword`
* **Users** → `/api/user/[userid]`, `/api/user/progress/[courseid]`
* **Teachers** → `/api/teacher/courses`, `/api/teacher/challenges`, `/api/teacher/mcqs`
* **Leaderboard** → `/api/leaderboard/classRank`
* **System** → `/api/system`
* **Chatbot** → `/api/chat`

---

## 📌 Roadmap

* [ ] Add discussion forum
* [ ] Add certificate generation
* [ ] Real-time chat for classes
* [ ] Analytics dashboard for teachers
* [ ] Smarter AI-powered chatbot (context-aware learning assistant)

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and create a pull request.

---

## Connect With Me:  
- **Abhishek Choudhary**  
- **[https://www.linkedin.com/in/your-linkedin-username](https://www.linkedin.com/in/abhishekchoudhary-svu134/)**

---

## 📄 License

This project is licensed under the **MIT License**.

---

