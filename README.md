TalentFlow - A Mini Hiring Platform
Welcome to TalentFlow, a front-end application designed to simulate a mini-hiring platform for HR teams. This project demonstrates a complete front-end workflow, from UI/UX design to complex state management and interaction with a mock API layer.

Live Demo Link: https://www.google.com/search?q=https://talentflow-hiring-platform-khaki.vercel.app

✨ Features
🏢 Jobs Board
✅ List, Filter & Paginate: View a paginated list of all jobs with server-side filtering by title and status (active/archived).

✅ CRUD Operations: Create, Read, and Update job details in a modal.

✅ Archive/Unarchive: Toggle the status of a job with an optimistic update.

✅ Drag-and-Drop Reordering: Easily reorder jobs within the list.

🧑‍💻 Candidates Management
✅ High-Performance Kanban: A fully interactive Kanban board to visually manage and display over 1000 candidates without performance issues.

✅ Drag-and-Drop Stage Changes: Move candidates between stages (e.g., Applied, Screen, Tech) with drag-and-drop, with changes persisted in the mock API.

📝 Assessments
✅ Dynamic Form Builder: A two-pane interface to create custom assessments for each job.

✅ Multiple Question Types: Add various types of questions: Short Text, Long Text, Single-Choice (Radio), Multiple-Choice (Checkbox), and Numeric.

✅ Live Preview: See a real-time preview of the assessment form as you build it.

✅ Interactive Editing: Click on any question in the builder to edit its label and options inline.

✅ Local Persistence: All created assessments are automatically saved to IndexedDB (via Dexie.js), so your work is never lost on refresh.

✅ Functional Form Runtime: A separate, clean page for candidates to take the created assessment.

🛠️ Tech Stack & Libraries
Framework: React 18

Build Tool: Vite

Styling: Tailwind CSS

Routing: React Router DOM v6

API Mocking: Mock Service Worker (MSW)

Local Persistence: IndexedDB via Dexie.js

Drag & Drop: Dnd-kit

Fake Data Generation: Faker.js

Package Manager: pnpm

🚀 Getting Started
To run this project locally, follow these steps:

Clone the repository:

git clone [https://github.com/me-rahulkr/talentflow-hiring-platform.git](https://github.com/me-rahulkr/talentflow-hiring-platform.git)

Navigate to the project directory:

cd talentflow-hiring-platform

Install dependencies:
(This project uses pnpm for efficient dependency management)

pnpm install

Run the development server:

pnpm run dev

The application will be available at http://localhost:5173.

🧠 Architecture & Technical Decisions
Mock Service Worker (MSW): Chosen to create a realistic, network-level mock API layer. This decouples the frontend from any specific backend and allows for independent development and testing.

Dexie.js for Persistence: IndexedDB was chosen for robust local storage. Dexie.js provides a simple and powerful wrapper around it, ensuring all created assessments persist across browser sessions.

@dnd-kit for Drag-and-Drop: Selected for being a modern, lightweight, and highly accessible library for building complex drag-and-drop interfaces like the Jobs Board reordering and the Kanban board.

Feature-Based Structure: The code is organized into "features" (jobs, candidates) to keep related components and logic together, making the codebase easier to navigate and maintain.