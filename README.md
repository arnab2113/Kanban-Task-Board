# TaskFlow — Modern Kanban Task Management Board

> A production-grade, highly responsive SaaS task management dashboard inspired by Linear, Trello, and Notion. Built with **React 18**, **Tailwind CSS**, **GSAP**, and **Lucide Icons**.

---

## ✨ Features

### 🔐 1. Authentication & Session Management
- **Mandatory Login Gate:** Users authenticate before accessing the dashboard.
- **Sign In & Registration:** Fast tab switching with animated GSAP transitions.
- **Form Validation:** Real-time email validation, password length checks, and dynamic password strength meter.
- **Session Persistence:** Login session preserved in `localStorage` across page refreshes.
- **Personalized Profile:** Default profile and placeholders configured for **Arnab Maity** (Lead Engineer).

### 📋 2. Real-Time Kanban Board & Fluid Drag-and-Drop
- **Three Columns:** **To Do**, **In Progress**, and **Completed**.
- **HTML5 Drag-and-Drop:** Intuitive card dragging with drop target highlights and indigo glow indicators.
- **Accessible 1-Click Move:** Move tasks directly via the card's action menu or fast cycle button for keyboard and touch users.
- **Confetti Celebrations:** Automatic confetti animation when tasks are moved into **Completed**.

### ⚡ 3. Smooth Transitions Powered by GSAP
- **Staggered Reveals:** Columns and dynamic metric cards animate sequentially using GreenSock's `power3.out` and `power2.out` eases.
- **Smooth Card Mounts:** Tasks scale and slide in cleanly upon creation.
- **Micro-Interactions:** Error shake animation on invalid login attempts, springy dialog entrances (`back.out(1.2)`), and responsive button presses.

### 🎯 4. Complete Task Operations (CRUD)
- **Create Tasks:** Required title validation, description, priority (Low, Medium, High), due date, status, and tags.
- **Edit Tasks:** Pre-populated modal supporting full field updates.
- **Duplicate Tasks:** 1-click clone feature.
- **Delete Confirmation:** Accessible confirmation dialog prevents accidental task deletions.
- **Task Details Drawer:** Inspect full task descriptions, metadata, creation dates, and assignees.

### 🔍 5. Real-Time Search, Filters & Sorters
- **Live Search:** Instant matching across titles, descriptions, and tags with a `/` keyboard shortcut.
- **Priority Filter:** Filter by `All Priorities`, `High`, `Medium`, or `Low`.
- **Status Filter:** Filter by `All Statuses`, `To Do`, `In Progress`, or `Completed`.
- **Sorting Options:** Sort by `Default Order`, `Due Date (Earliest)`, `Priority (High to Low)`, or `Title (A-Z)`.
- **One-Click Reset:** Quickly reset all filters back to default.

### 📊 6. Dynamic Sprint Analytics
- **Summary Cards:** Real-time counts for **Total Tasks**, **To Do**, **In Progress** (with pulsing live indicator), and **Completed**.
- **Overdue Detection:** Automatically flags tasks whose due dates have passed.
- **Workspace Overview:** Dedicated analytics view displaying sprint velocity, priority breakdown percentages, and upcoming deadlines.

### 🌓 7. Dark & Light Mode
- Crisp warm off-white in light mode (`#fbfbfd`) and deep slate in dark mode (`#0b1120`).
- Persistent theme preference saved in `localStorage`.
- Animated theme toggle button.

### 💾 8. LocalStorage Persistence & Backup Tools
- Real-time data persists automatically in browser storage.
- **Export Backup:** Download entire task dataset as a formatted `.json` file.
- **Import Backup:** Restore tasks from a previously saved JSON file.

### 📱 9. Responsive Layout
- **Desktop (1024px+):** Sticky collapsible sidebar, top navigation bar, and side-by-side columns.
- **Tablet (768px - 1023px):** Horizontal scrolling columns with balanced touch targets.
- **Mobile (< 768px):** Slide-out drawer navigation, compact header, and mobile column selector tabs.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Frontend framework (Functional components & hooks) |
| **Vite 5** | Lightning-fast build tool and dev server |
| **Tailwind CSS 3** | Utility-first styling with dark mode support |
| **GSAP (GreenSock)** | High-performance transitions and micro-animations |
| **Lucide React** | Consistent, modern iconography |
| **Canvas Confetti** | Celebration visual effects on task completion |

---

## 📁 Project Structure

```
kanban-task-board/
├── index.html                   # HTML entry point with Inter font
├── package.json                 # Project dependencies and scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration (custom colors, fonts)
├── postcss.config.js            # PostCSS configuration
├── .gitignore                   # Git ignore specifications
├── README.md                    # Project documentation
└── src/
    ├── main.jsx                 # Application entry point
    ├── App.jsx                  # Main root layout & auth switcher
    ├── index.css                # Global base styles & scrollbar design
    ├── context/
    │   ├── AuthContext.jsx      # Authentication state & user session
    │   └── TaskContext.jsx      # Task state, LocalStorage sync, toasts, stats
    ├── data/
    │   └── initialTasks.js      # Clean initial real-time configuration
    ├── utils/
    │   └── helpers.js           # Date formatting, overdue logic, storage utilities
    └── components/
        ├── auth/
        │   └── AuthPage.jsx     # Modern Login & Registration page with GSAP
        ├── common/
        │   ├── ConfirmDialog.jsx# Accessible deletion confirmation modal
        │   ├── ThemeToggle.jsx  # Dark/Light mode toggle switch
        │   └── Toast.jsx        # Floating notifications container
        ├── sidebar/
        │   └── Sidebar.jsx      # Collapsible desktop sidebar & mobile drawer
        ├── header/
        │   └── Header.jsx       # Top navigation bar with search & profile menu
        ├── board/
        │   ├── BoardSummary.jsx # 4 dynamic metric cards with GSAP reveal
        │   ├── SearchAndFilters.jsx # Filter, search, and sorting controls
        │   ├── KanbanBoard.jsx  # 3-column board container & empty states
        │   ├── KanbanColumn.jsx # Droppable column with task cards list
        │   ├── TaskCard.jsx     # Draggable task card with action menu
        │   └── OverviewView.jsx # Sprint velocity & priority breakdown view
        └── modals/
            ├── TaskFormModal.jsx# Create & Edit task dialog with validation
            ├── TaskDetailsModal.jsx # Read/inspect modal with quick move
            └── SettingsModal.jsx# Theme settings & JSON import/export
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd "Kanban Task Board"
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

---

## ⌨️ Useful Shortcuts & Tips

- **Search Focus:** Press `/` anywhere on the page to jump directly to the search input.
- **Escape Key:** Press `Esc` to close any open modal (Task Form, Details, Settings, or Delete Confirmation).
- **Default Account:** You can sign in using `arnab.maity@taskflow.dev` / `password123`, or create a new account in the **Create Account** tab.
- **Quick Status Cycle:** Click **Move →** on any task card to quickly advance its status without dragging.

---

## 📦 Production Build

To build the project for production deployment:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 👤 Author

- **Name:** Arnab Maity
- **Role:** Lead Engineer
- **Project:** TaskFlow Kanban Board
