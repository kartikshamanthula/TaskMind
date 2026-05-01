# Regular Task Manager 🚀

A premium, AI-powered task management application designed for focus, productivity, and financial clarity. Built with Next.js, Tailwind CSS, and MongoDB.

## ✨ Key Features

- **Dynamic Kanban Board**: Seamlessly manage tasks with a modern drag-and-drop interface.
- **Daily Tasks View**: A specialized view for your daily routine, featuring level-based XP and progress tracking.
- **AI Bill OCR**: Scan or upload receipts and bills. The AI automatically extracts data to update your finance logs.
- **AI Coach & Reflection**: Get insights into your productivity patterns and generate reflection reports to celebrate your wins.
- **Finance Dashboard**: Integrated financial tracking synchronized with your task completion.
- **Glassmorphic Design**: A premium, dark-mode aesthetic with smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **AI Integration**: [Google Gemini](https://ai.google.dev/) & [Groq](https://groq.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: Lucide React, Shadcn/UI patterns

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account
- API Keys for Gemini and Groq

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd regular-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_atlas_uri
   GROQ_API_KEY=your_groq_key
   GEMINI_API_KEY=your_gemini_key
   JWT_SECRET=your_random_secret
   RESEND_API_KEY=your_resend_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

MIT License - feel free to use and modify for personal use.
