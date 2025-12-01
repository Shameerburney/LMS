# AI-Powered Learning Management System

A modern, offline-first Learning Management System built with React and IndexedDB for teaching AI, Python, Data Science, Machine Learning, Deep Learning, and Generative AI.

## Features

- 🔐 **Authentication System** - Login/Register with role-based access (Student/Instructor/Admin)
- 📚 **Course Management** - Create, browse, and enroll in courses
- 💾 **Offline-First** - Uses IndexedDB for local data storage
- 🎨 **Modern UI** - Beautiful dark/light mode with smooth animations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎓 **Role-Based Features** - Different dashboards for students, instructors, and admins

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: CSS3 with CSS Variables
- **Database**: IndexedDB (browser-based)
- **Icons**: Lucide React
- **Security**: bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-lms
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Student** | student@demo.com | password |
| **Instructor** | instructor@demo.com | password |
| **Admin** | admin@demo.com | password |

## Project Structure

```
ai-lms/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context (Auth, Theme)
│   ├── pages/            # Page components
│   ├── services/         # Business logic (db, auth, courses)
│   ├── utils/            # Helper functions and constants
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/               # Static assets
└── index.html            # HTML template
```

## Features by Role

### Student
- Browse and search courses
- Enroll in courses
- Track learning progress
- View certificates
- Access course materials

### Instructor
- Create and manage courses
- Add lessons and content
- View student analytics
- Grade assignments
- Post announcements

### Admin
- Manage all users
- Approve/reject courses
- System configuration
- View platform analytics

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## License

MIT

## Author

Built with ❤️ for AI learners everywhere!
