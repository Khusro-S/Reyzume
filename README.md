# Reyzume 📄

**A modern, intuitive, and powerful resume builder built for the web.**

Reyzume simplifies the resume creation process with a sleek drag-and-drop interface, real-time previews, and seamless PDF export. Built with the latest web technologies, it offers a smooth user experience comparable to native desktop applications.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Core Idea & Motivation](#-core-idea--motivation)
- [Architecture](#️-architecture)
- [High-Level Data Flow](#-high-level-data-flow)
- [User Flow](#-user-flow)
- [Implementation Details](#️-implementation-details)
- [Folder Structure](#-folder-structure)
- [Tech Stack](#️-tech-stack)
- [Setup & Installation](#-setup--installation)
- [Navigating the Codebase](#-navigating-the-codebase)
- [Limitations & Future Improvements](#-limitations)

---

**🚀 [Try Reyzume Live](https://reyzume.netlify.app)**

---

## 📌 Project Overview

Reyzume is a full-stack web application that allows users to create, manage, and export professional resumes. It solves the common frustration of fighting with formatting in traditional word processors by providing structured, draggable sections and a "what you see is what you get" (WYSIWYG) editor.

**Technical Highlights:**

*   **Local-First Architecture**: Real-time syncing with optimistic UI updates for a native-app feel.
*   **Complex State Management**: Handles nested data structures with a custom Undo/Redo stack using Zundo.
*   **Secure by Design**: Implements Row-Level Security (RLS) via Convex and robust authentication with Clerk.
*   **Modern UX**: Features skeleton loaders, micro-animations, and accessibility-aware drag-and-drop interactions.

**Key Features:**

- 🖱️ **Drag-and-Drop**: Reorder sections and items effortlessly.
- 📝 **Rich Text Editing**: Intuitive editing for descriptions and summaries.
- 🎨 **Customization**: Adjust fonts, margins, and spacing in real-time.
- ☁️ **Cloud Sync**: Changes are saved automatically to the cloud.
- 🖨️ **PDF Export**: High-quality export optimized for A4 paper.

---

## 🧠 Core Idea & Motivation

The goal of Reyzume is to democratize access to professional-looking resumes. Many job seekers struggle with design and layout, often leading to rejection before their content is even read. Reyzume abstracts away the design complexity, allowing users to focus purely on their content while the application handles the layout, typography, and structure.

---

## 🏗️ Architecture

Reyzume follows a modern **Serverless** and **Client-First** architecture:

1.  **Frontend**: Built with **Next.js 16 (App Router)** for routing and server-side rendering where appropriate.
2.  **Backend & Database**: Powered by **Convex**, a real-time backend-as-a-service. It handles data persistence, real-time subscriptions, and serverless functions.
3.  **Authentication**: Managed by **Clerk**, providing secure and seamless user identity management.
4.  **State Management**: A hybrid approach using **Zustand** for complex client-side editor state (undo/redo, drag operations) and **Convex** for server state synchronization.

---

### 📡 High-Level Data Flow

![mermaid diagram](https://mermaid.ink/img/pako:eNptkF1vgjAYhf9K815tCRpAASHLklE0M-4K4g2wiwpVDNKSUjad-t9X_Ir7eK963uecHugeMp5T8GC54Z9ZQYREb2HKkJqmXawEqQs0GScTwZmkLH8_o27m02TeUIGmCgiSyTVndzSOkrhtJGE5iiQX9A6FOAmpCiDMq5ozymRzoaogZb_K_XHik6z82Y39BHP2QbfoHzZL8IaKEr20srjbB37yEBBJFqShj38L51PU6z2r7z7LOEJPSh-iHcvQK-dlc1CtN9ZZQ3zNYr9bHLpChAualco7u6DZyRuoKGiwEuscPClaqkFFRUU6CfvOmoIsaEVT8NQxJ6JMIWVHlakJizmvrjHB21UB3pJsGqXaOieSBmuiHqu6bYX6Lyowb5kEz3CGp0vA28MWPLOvOyNDd4e6aeqGaeiWBjvlMpy-ZVr2wLXdgW24tnPU4OvUq_dHjqV3YzijoW6Zx28dKab2?type=png)

```ascii
UI Components ←→ Editor Engine ←→ Auto-saving ←→ Realtime Resume Updates
```

### 🔁 User FLow

1. Onboarding: User lands on the homepage and signs up/in via Clerk.
2. Dashboard: User sees a list of their resumes (Reyzumes) and can create a new one or edit an existing one.
3. Editor:
    - User adds sections (Experience, Education, Skills).
    - User drags sections to reorder them.
    - User edits text using the rich text editor.
    - Changes are auto-saved to the database.
4. Export: User clicks "Download," configures print settings, and saves the resume as a PDF.

---

### 🛠️ Implementation Details

1. The Editor Engine: The core of Reyzume is the editor, located in [ReyzumeBuilder](https://github.com/Khusro-S/Reyzume/blob/main/app/(reyzumeBuilder)/_components/ReyzumeBuilder.tsx). It uses `Tiptap` for rich text editing, allowing users to format text (bold, italic, lists, etc.) without breaking the layout.

2. Drag and Drop: We utilize `@dnd-kit` for its accessibility and performance. It handles:
    - Vertical Sorting: Reordering entire sections (e.g., moving Education above Experience).
    - Item Sorting: Reordering items within a section (e.g., swapping two job entries).

3. **Persistent State with `Zustand`**: Resume data (sections, items, content) is managed in a **Zustand store** that serves as the single source of truth. The store serializes the state to JSON and syncs it to **Convex** via a debounced auto-save mechanism (1-second delay after the last edit). This ensures data persistence without flooding the backend with requests.

4. **Editor State Management**: We use **React Context** to manage transient **UI state** (which editor has focus, popover visibility of the buttons on the toolbar, floating menu positions, etc.). The actual content changes (bold text, links, formatting) are handled by the **Zustand store** and persisted to the database. This separation keeps UI logic scoped locally while data flows through the global state.

5. **Undo/Redo with Zundo**: We use **Zundo**, a time-travel middleware for Zustand, to implement undo/redo functionality. It tracks **structural changes** such as:
   - Adding or removing sections and items
   - Reordering sections and items via drag-and-drop
   - Toggling section visibility (show/hide)

   Text edits are **not tracked** by Zundo to avoid cluttering the history stack, instead, users rely on the browser's native Cmd/Ctrl + Z for inline content changes.

6. **Real-Time Sync**: A custom hook `useReyzumeSync` bridges the gap between the local `Zustand store` and the `Convex` backend. It debounces user inputs (1-second delay) to prevent database flooding while ensuring data is never lost. When a resume is loaded, it parses the JSON from Convex and populates the Zustand store.

7. **Authentication & Authorization**: We use **`Clerk`** for secure user authentication with social login support (Google, GitHub). **`Convex`** enforces row-level security (RLS) by checking the authenticated user's identity before returning data, ensuring users can only access their own resumes.

8. PDF Generation: We use `react-to-print` to leverage the browser's native rendering engine. This ensures that the PDF output matches the screen pixel-perfectly, including fonts and spacing.

---

### 📂 Folder Structure

``` bash
app/
├── (landingPage)/           # Public Landing Page Folder
│   ├── page.tsx             # Home page
│   └── _components/         # Landing page components (Hero, Features, etc.)
├── (reyzumeBuilder)/        # Protected resume editor area (editor + dashboard)
│   ├── layout.tsx           # Layout for editor routes
│   ├── _components/         # Editor UI components(Toolbar, Canvas, Sections)
│   └── (routes)/
│       ├── reyzumes/        # Dashboard (list of resumes)
│       └── reyzumes/[id]/   # Resume editor page
├── (signin)/ & (signup)/    # Auth routes (Clerk)
├── globals.css              # Global styles + print CSS
└── layout.tsx               # Root layout (providers, fonts)

convex/                      # Backend logic
├── schema.ts                # Database schema
├── reyzumes.ts              # CRUD operations (queries, mutations)
└── auth.config.ts           # Clerk integration

components/
├── ui/                      # Shadcn UI primitives
└── providers/               # Context providers (Editor, Convex, Clerk)

hooks/
├── reyzumeStore/            # Zustand store + Zundo middleware
├── useReyzumeSync.ts        # Sync hook (Zustand ↔ Convex)
└── useZoomStore.ts          # Zoom level management

lib/
├── fonts.ts                 # Font/typography utilities
└── utils.ts                 # Shared helpers
````

---

### ⚙️ Tech Stack

| Category | Technology |
| :---:     | :---:       |
| Frontend |Next.js 16 (App Router) |
|Language|TypeScript|
|Backend|Convex|
|Auth|Clerk|
|Styling|Tailwind CSS v4, Shadcn UI|
|State|Zustand, Zundo (Undo/Redo), React Context|
|Editor|Tiptap|
|Drag & Drop|@dnd-kit|
|Icons|Lucide React|
|Package Manager| pnpm|

---

### 🧭 Navigating the Codebase

- `app/(reyzumeBuilder)/_components/ReyzumeBuilder.tsx` — Main canvas where the resume is rendered
- `hooks/reyzumzeStore/store.ts` — Zustand store managing resume state
- `convex/reyzumes.ts` — CRUD operations for resumes
- `_components/` — Editor UI (toolbars, panels, canvas, etc.)
- `hooks/useReyzumeSync.ts` — Real-time sync logic
- `components/ui`

---

## 🚧 Limitations

### **1. Bullet Point Editor Issue**

When pressing **Enter** inside a bullet list, an extra empty line is sometimes inserted and can't be deleted.  
This is related to Tiptap’s list-handling configuration.  
Since it doesn’t break core functionality, it was deprioritized due to the ELO2 submission deadline.

---

### **2. PDF Export Method (Print Dialog)**

The current PDF export uses **react-to-print**, relying on the browser’s native “Print to PDF” dialog.  
This approach was chosen because:

- Libraries like `html2pdf.js` + `html2canvas-pro` generated **rasterized PDFs** (non-selectable text, non-clickable links).  
- `react-pdf` requires rewriting the entire resume in its custom component system, resulting in two parallel layouts to maintain.

Users can adjust print settings (margins, scale, backgrounds, headers/footers off) to achieve better results.

---

### **3. Undo/Redo Scope**

Undo/redo buttons currently apply only to **structural changes**, including:

- Reordering sections  
- Reordering items  
- Editing section and item-level properties (adding, removing or hiding/un-hiding)

Inline text edits rely on the browser’s native **Cmd/Ctrl + Z** behavior.  
Integrating Tiptap’s internal transaction history with Zustand/Zundo’s global undo stack is complex and was not feasible within the project timeline.

---

### **4. Pagination Accuracy**

The editor renders the resume inside a **single continuous container**, which leads to:

- Less-than-perfect page height detection  
- Inaccurate top/bottom padding on pages other than the first and last, which is reflected  during PDF export, especially in Chrome.

A more accurate, fully paginated layout system will be explored in future iterations.

---

### **5. Drag-and-Drop with Tall Sections**

When a section contains significantly more content than others (resulting in taller height), dragging and reordering can exhibit unexpected behavior, including:

- Jarring animations during drag operations
- Inconsistent drop zone detection
- Visual glitches while hovering between sections

This is related to how `@dnd-kit` calculates collision detection with dynamically-sized elements. The functionality remains intact, sections can still be reordered as intended, but the user experience may feel less polished in these cases.

A deeper investigation into custom collision detection strategies and drag constraints is planned for future iterations but was deprioritized due to the ELO2 submission deadline.

---

### 🔮 Future Improvements

- ✨ AI-assisted editing
- 🎨 Multiple resume templates/themes
- 🔗 Public shareable resume links
- 📨 Cover letter generator
- 🖨️ True server-rendered PDF generation

---

### 🚀 Local Setup

#### Prerequisites

- Node.js 18+
- pnpm
- Convex + Clerk accounts (free tiers available)

1. Clone the repository

    ``` bash
    git clone https://github.com/Khusro-S/Reyzume.git
    cd reyzume
    ```

2. Install dependencies

    ``` bash
    pnpm install
    ```

3. Environment setup

    Create a `.env.local` file:

    ``` ini
    CONVEX_DEPLOYMENT=...
    NEXT_PUBLIC_CONVEX_URL=...
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...
    ```

4. Run the app

    Start Next.js:

    ```bash
    pnpm dev
    ````

    Start Convex backend (in another terminal):

    ```bash
    pnpm convex dev
    ```

---

## 🤝 Contributing & Feedback

This is an open-source project built for the MIT Emerging Talent ELO2 Capstone Project. Feedback, suggestions, and contributions are welcome!

- **Found a bug?** Please [open an issue](https://github.com/Khusro-S/Reyzume/issues) on GitHub.
- **Have a feature idea?** Feel free to submit a pull request or start a discussion.
- **Connect:** Reach out via [LinkedIn](https://www.linkedin.com/in/khusro-sakhi) or email at `khusro.sakhi20@gmail.com`.

*Star ⭐ this repo if you find it useful!*

---

## 🙏 Attribution

While not legally required, if you use or adapt this project, I'd appreciate:

- A mention in your project's README or credits
- A link back to this repository
- Letting me know, I'd love to see what you build!

This helps support open-source development. Thank you! 🙏
