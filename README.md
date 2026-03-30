# AI in Agriculture: From Field to Future

A comprehensive 5-hour interactive course exploring how Artificial Intelligence is transforming agriculture. Benchmarked against programs from Wageningen University, Cornell University, UC Davis, and industry leaders.

![Course Dashboard](public/images/hero-landing.png)

## Course Overview

- **5 hours** of total content
- **6 modules** with 36 lessons
- **Interactive quizzes**, mini-games, and real-world case studies
- **AI chatbot (Noor)** for contextual learning support
- **Final exam** with certification

### Modules

1. **The Agricultural Revolution Meets AI** — Understanding the convergence of farming and AI
2. **Sensing the Earth: Data Collection & IoT** — Sensors, drones, satellites, and Microsoft FarmBeats
3. **AI-Powered Crop Management** — From planting to harvest with IBM Watson
4. **Climate Resilience & Sustainability** — AI as a shield against climate change
5. **The Intelligent Supply Chain** — From farm gate to dinner plate
6. **The Human-AI Future of Agriculture** — Ethics, augmentation, and action plans

## Tech Stack

- **Frontend**: React 19 + Vite 8 + React Router 7
- **Backend**: Express 5 + better-sqlite3
- **Database**: SQLite (self-seeding — all course content lives in `server/database.js`)
- **Styling**: Custom CSS with dark theme

## Getting Started

### Prerequisites

- Node.js 18+ (tested with Node 20)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/jpnapoli/AI-in-Agriculture-Course.git
cd AI-in-Agriculture-Course

# Install dependencies
npm install

# Start the production server (serves API + built frontend)
npm start
# → Server runs on http://localhost:3001

# OR for development (hot reload)
npm run dev
# → Vite dev server on http://localhost:5173 (proxies API to :3001)
# → You also need to run: node server/index.js
```

### Running in Development

Open two terminals:

```bash
# Terminal 1: Start the API server
node server/index.js

# Terminal 2: Start Vite dev server with hot reload
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── server/
│   ├── index.js          # Express API server
│   ├── database.js       # SQLite schema + full course seed data
│   └── agri_ai_course.db # SQLite database (auto-created)
├── src/
│   ├── App.jsx           # React app with routing
│   ├── main.jsx          # React entry point
│   ├── pages/
│   │   ├── Dashboard.jsx       # Course dashboard/home
│   │   ├── CourseOverviewPage.jsx # Full course overview
│   │   ├── ModulePage.jsx      # Module detail view
│   │   ├── LessonPage.jsx      # Individual lesson view
│   │   └── ExamPage.jsx        # Final exam
│   ├── components/
│   │   ├── ContentRenderer.jsx # Renders lesson content blocks
│   │   ├── QuizComponent.jsx   # Interactive quiz component
│   │   ├── MiniGame.jsx        # Mini-game component
│   │   └── NoorChat.jsx        # AI chatbot assistant
│   └── styles/
│       └── global.css          # Global styles (dark theme)
├── public/images/              # Course images and icons
├── dist/                       # Production build output
├── package.json
├── vite.config.js
└── index.html
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/course` | Get course overview with all modules |
| GET | `/api/modules/:id` | Get module details with lessons |
| GET | `/api/lessons/:id` | Get full lesson content |
| GET | `/api/personas` | Get learning personas |
| GET | `/api/exam` | Get final exam questions |
| POST | `/api/users` | Create/get user |
| GET | `/api/users/:id/progress` | Get user progress |
| POST | `/api/users/:id/progress` | Update lesson progress |
| POST | `/api/users/:id/exam` | Submit exam answers |
| POST | `/api/noor/chat` | Chat with Noor AI assistant |

## License

MIT
