# Advanced Features - Installation & Setup Guide

## 🚀 Quick Start

### Step 1: Install Dependencies

**Open Command Prompt (CMD) as Administrator** and run:

```cmd
cd C:\Users\SB\OneDrive\Desktop\ai-lms
npm config set cache "C:\Users\SB\AppData\Local\npm-cache" --global
npm install
```

### Step 2: Start the App

```cmd
npm run dev
```

---

## ✅ Features Built So Far

### 1. Video Player System ✅
**File:** `src/components/video/VideoPlayer.jsx`

**Features:**
- ✅ YouTube embed support
- ✅ Vimeo embed support
- ✅ Direct video URL support
- ✅ Custom HTML5 player with:
  - Play/pause controls
  - Progress bar (clickable)
  - Volume control
  - Speed control (0.5x - 2x)
  - Skip forward/backward (10s)
  - Fullscreen mode
  - Time display
- ✅ Progress tracking
- ✅ Auto-complete at 90% watched
- ✅ Resume from last position

**Usage:**
```jsx
<VideoPlayer 
  videoUrl="dQw4w9WgXcQ" 
  videoType="youtube"
  onProgress={(current, total) => console.log(current, total)}
  onComplete={() => console.log('Video completed!')}
/>
```

---

### 2. Notes Editor ✅
**File:** `src/components/notes/NotesEditor.jsx`

**Features:**
- ✅ Rich text editing (bold, italic, lists, code blocks)
- ✅ Auto-save every 3 seconds
- ✅ Link notes to video timestamps
- ✅ Export to PDF
- ✅ Last saved indicator
- ✅ Clean, modern UI

**Usage:**
```jsx
<NotesEditor 
  userId={user.id}
  courseId={courseId}
  lessonId={lessonId}
  videoTimestamp={120} // optional
/>
```

---

### 3. Code Playground ✅
**File:** `src/components/code/CodePlayground.jsx`

**Features:**
- ✅ Monaco Editor (VS Code editor)
- ✅ Python execution in browser (Pyodide)
- ✅ Pre-loaded NumPy and Pandas
- ✅ Pre-built examples:
  - Hello World
  - NumPy arrays
  - Pandas DataFrames
  - Simple ML (linear regression)
- ✅ Copy code button
- ✅ Save code as .py file
- ✅ Syntax highlighting
- ✅ Error handling

**Usage:**
```jsx
<CodePlayground 
  language="python"
  initialCode="print('Hello!')"
  lessonId={lessonId}
/>
```

---

## 📦 New Dependencies Added

```json
{
  "@monaco-editor/react": "^4.6.0",  // Code editor
  "qrcode": "^1.5.3",                 // QR codes for certificates
  "jspdf": "^2.5.1",                  // PDF generation
  "html2canvas": "^1.4.1",            // Screenshot for certificates
  "react-quill": "^2.0.0",            // Rich text editor
  "quill": "^1.3.7"                   // Quill core
}
```

---

## 🔄 Next Components to Build

### 4. Quiz System (In Progress)
- Quiz builder for instructors
- Quiz taking interface
- Auto-grading
- Results display

### 5. Assignment System (In Progress)
- Assignment creation
- File upload
- Submission tracking
- Grading interface

### 6. Certificate Generator (In Progress)
- Canvas-based design
- QR code verification
- Auto-issue on completion

### 7. Discussion Forums (In Progress)
- Thread creation
- Replies and voting
- Best answer marking

### 8. Gamification (In Progress)
- XP system
- Badges
- Leaderboards
- Streak tracking

---

## 🎯 How to Use New Features

### Video Player
1. Go to any lesson page
2. Add a video URL or YouTube/Vimeo ID
3. Player will automatically load with full controls

### Notes Editor
1. Open any lesson
2. Notes editor appears below the video
3. Type notes - they auto-save every 3 seconds
4. Click "Export PDF" to download

### Code Playground
1. Available in Python/ML courses
2. Load examples from dropdown
3. Write or modify code
4. Click "Run Code" to execute
5. See output instantly

---

## 🐛 Troubleshooting

### npm install fails
```cmd
npm cache clean --force
npm config set cache "C:\Users\SB\AppData\Local\npm-cache" --global
npm install
```

### Pyodide not loading
- Check internet connection (loads from CDN)
- Wait 10-15 seconds for initial load
- Refresh the page

### Monaco Editor not showing
```cmd
npm install @monaco-editor/react --force
```

---

## 📝 Integration Example

Here's how to use all three components together in a lesson page:

```jsx
import VideoPlayer from '../components/video/VideoPlayer';
import NotesEditor from '../components/notes/NotesEditor';
import CodePlayground from '../components/code/CodePlayground';

function LessonPage() {
  const [videoTime, setVideoTime] = useState(0);

  return (
    <div>
      {/* Video Section */}
      <VideoPlayer 
        videoUrl="your-video-id"
        videoType="youtube"
        onProgress={(current) => setVideoTime(current)}
      />

      {/* Code Playground */}
      <CodePlayground 
        language="python"
        initialCode={lesson.codeExample}
      />

      {/* Notes Editor */}
      <NotesEditor 
        userId={user.id}
        courseId={courseId}
        lessonId={lessonId}
        videoTimestamp={videoTime}
      />
    </div>
  );
}
```

---

## 🎨 Styling

All components use your existing design system:
- CSS variables for colors
- Consistent spacing
- Dark/Light mode support
- Responsive design
- Smooth animations

---

## ⚡ Performance Tips

1. **Video Player**: Use YouTube/Vimeo for large videos
2. **Notes**: Auto-save prevents data loss
3. **Code Playground**: Pyodide loads once per session
4. **Monaco Editor**: Lazy loads on demand

---

## 🔐 Security

- All data stored in IndexedDB (client-side)
- No external API calls (except Pyodide CDN)
- Code execution sandboxed in WebAssembly
- No server-side code execution

---

## 📊 Storage Limits

- IndexedDB: ~50MB per domain
- Notes: Text only (very small)
- Code snippets: Minimal storage
- Videos: Use external hosting

---

## 🎉 What's Working

✅ Video playback with full controls
✅ Rich text note-taking
✅ Python code execution in browser
✅ PDF export
✅ Auto-save functionality
✅ Responsive design
✅ Dark mode support

---

## 🚧 Coming Soon

The remaining features (quizzes, assignments, certificates, forums, gamification) are being built next. Each will integrate seamlessly with the existing system.

---

**Need help?** Check the implementation plan in `implementation_plan.md` for detailed technical specs!
