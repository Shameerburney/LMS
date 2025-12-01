<div align="center">

# 🎓 AI-Powered Learning Management System

### *Master AI, ML, Data Science & Python - Completely Offline*

[![React](https://img.shields.io/badge/React-18.0-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-orange?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A modern, feature-rich Learning Management System designed for teaching AI, Python, Data Science, Machine Learning, Deep Learning, and Generative AI - works 100% offline!**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**
- **Role-Based Access Control** - Student, Instructor, and Admin roles
- **Secure Password Hashing** - bcryptjs encryption
- **Session Management** - Persistent login with localStorage
- **Protected Routes** - Route guards based on user permissions

### 📚 **Course Management**
- **Rich Course Library** - Browse, search, and filter courses
- **Category Organization** - AI, Python, Data Science, ML, DL, GenAI
- **Difficulty Levels** - Beginner, Intermediate, Advanced
- **Course Enrollment** - One-click enrollment system
- **Progress Tracking** - Track completion and learning streaks

### 🎨 **Modern UI/UX**
- **Dark/Light Mode** - Beautiful theme switching
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Smooth Animations** - Fade-in, slide-in, hover effects
- **Glassmorphism** - Modern glass-effect design elements
- **Custom Color Palette** - Indigo, Pink, Teal gradients

### 💾 **Offline-First Architecture**
- **IndexedDB Storage** - All data stored locally in browser
- **No Internet Required** - Works completely offline
- **Sample Data Included** - 4 pre-loaded AI/ML courses
- **Fast Performance** - No network latency

### 👥 **Role-Specific Dashboards**

#### 🎓 Student Dashboard
- Personalized welcome and stats
- Enrolled courses with progress bars
- Recommended courses
- Certificate tracking
- Learning streak counter

#### 👨‍🏫 Instructor Dashboard
- Create and manage courses
- Add lessons, quizzes, and assignments
- View student analytics
- Grade submissions
- Post announcements

#### ⚙️ Admin Dashboard
- User management
- Course approval system
- Platform analytics
- System configuration
- Announcement broadcasting

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Shameerburney/LMS.git
cd LMS

# Install dependencies
npm install

# Start development server
npm run dev
```

🎉 **That's it!** Open `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
```

Production files will be in the `dist` directory.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🎓 **Student** | `student@demo.com` | `password` |
| 👨‍🏫 **Instructor** | `instructor@demo.com` | `password` |
| ⚙️ **Admin** | `admin@demo.com` | `password` |

---

## 📸 Screenshots

### Student Dashboard
*Beautiful, modern interface with progress tracking and course recommendations*

### Course Library
*Browse and filter courses by category and difficulty*

### Dark Mode
*Sleek dark theme for comfortable night-time learning*

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **Vite** | Lightning-fast build tool |
| **React Router v6** | Client-side routing |
| **IndexedDB** | Browser-based database |
| **CSS3** | Modern styling with variables |
| **Lucide React** | Beautiful icon library |
| **bcryptjs** | Password encryption |

---

## 📁 Project Structure

```
ai-lms/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Header, Sidebar, Layout
│   │   ├── quiz/            # Quiz builder and taker
│   │   ├── video/           # Video player
│   │   └── ...
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ThemeContext.jsx # Theme management
│   ├── pages/               # Page components
│   │   ├── auth/            # Login, Register
│   │   ├── student/         # Student pages
│   │   ├── instructor/      # Instructor pages
│   │   └── admin/           # Admin pages
│   ├── services/            # Business logic
│   │   ├── db.js            # IndexedDB operations
│   │   ├── auth.js          # Authentication
│   │   └── courses.js       # Course management
│   ├── utils/               # Helper functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── index.html               # HTML template
```

---

## 🎯 Key Features by Role

### 🎓 **Student Features**
✅ Browse and search courses  
✅ Enroll in unlimited courses  
✅ Track learning progress  
✅ Take quizzes and assignments  
✅ Earn certificates  
✅ View learning analytics  

### 👨‍🏫 **Instructor Features**
✅ Create and publish courses  
✅ Add lessons with rich content  
✅ Build quizzes and assignments  
✅ Grade student submissions  
✅ View course analytics  
✅ Post announcements  

### ⚙️ **Admin Features**
✅ Manage all users  
✅ Approve/reject courses  
✅ Platform-wide analytics  
✅ System configuration  
✅ Broadcast announcements  

---

## 📚 Pre-loaded Courses

The system comes with 4 sample courses:

1. **Introduction to Artificial Intelligence** (Beginner, 40 hours)
2. **Python for Data Science** (Beginner, 35 hours)
3. **Deep Learning with Neural Networks** (Advanced, 60 hours)
4. **Generative AI and Large Language Models** (Intermediate, 45 hours)

---

## 🎨 Design Highlights

- **Color Palette**: Indigo (#6366f1), Pink (#ec4899), Teal (#14b8a6)
- **Typography**: Poppins (headings), Inter (body)
- **Animations**: Smooth transitions and hover effects
- **Layout**: Card-based, responsive grid system
- **Theme**: Dark/Light mode with CSS variables

---

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment

No environment variables needed! Everything works out of the box.

---

## 🌟 Why This LMS?

✅ **100% Offline** - No internet dependency  
✅ **Privacy First** - All data stays in your browser  
✅ **Zero Setup** - No database or backend required  
✅ **Modern Stack** - Built with latest React and Vite  
✅ **Beautiful UI** - Professional, polished design  
✅ **Fully Featured** - Complete LMS functionality  
✅ **Open Source** - Free to use and modify  

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shameer Burney**

- GitHub: [@Shameerburney](https://github.com/Shameerburney)
- Project: [AI-LMS](https://github.com/Shameerburney/LMS)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ for AI learners everywhere**

[⬆ Back to Top](#-ai-powered-learning-management-system)

</div>
