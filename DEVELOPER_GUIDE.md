# SkillSwap Developer Guide & Technical Documentation

## 1. Executive Summary & Architecture

**SkillSwap** is a modern Single Page Application (SPA) built to facilitate peer-to-peer skill exchange. Unlike traditional tutoring platforms, it emphasizes a **barter economy** (Time-for-Time) rather than a monetary one.

### Technical Stack
*   **Core Framework:** React 18 (Vite Build Tool)
*   **Language:** JavaScript (ES6+)
*   **Styling:** Tailwind CSS (Utility-first architecture) + Custom CSS for complex animations
*   **Routing:** React Router DOM (v6) with Config-based Architecture
*   **State Management:**
    *   **Server State:** TanStack Query (React Query) - Handles caching, fetching, and synchronization.
    *   **Global UI State:** React Context API (`AuthContext`, `ToastContext`).
    *   **Local State:** `useState`, `useReducer` for complex component logic.
*   **Real-Time Communication:**
    *   **Video/Audio:** Jitsi Meet React SDK (@jitsi/react-sdk).
    *   **Messaging:** Optimistic UI updates with mocked backend services (migrating to real API).
*   **Icons:** Lucide React.

---

## 2. Project Structure & Organization

The codebase follows a **Feature-First + Atomic** hybrid structure to ensure scalability.

```text
src/
├── Components/         # Reusable UI building blocks
│   ├── common/         # Atoms/Molecules (Buttons, Spinners, Cards)
│   ├── modals/         # Global modals (VideoCall, CreateGroup, RequestSwap)
│   ├── Messages/       # Complex Message feature components (Sidebar, ChatArea)
│   ├── Navbar.jsx      # Main Navigation
│   └── ...
├── pages/              # Route-level Page Components (Views)
│   ├── Home.jsx        # Dashboard / Hybrid Feed
│   ├── Discovery.jsx   # Search & Match Logic
│   └── ...
├── hooks/              # Custom React Hooks (Business Logic Layer)
│   ├── usePosts.js     # Post CRUD & Caching
│   ├── useSwaps.js     # Connection Logic
│   └── useResponsive.js # Media Query Listeners
├── context/            # Global Providers
│   ├── AuthContext.jsx # User Session Management
│   └── ToastContext.jsx # Notification System
├── services/           # API Interface Layer (Axios/Fetch wrappers)
├── config/
│   ├── routes.js       # Centralized Route Definitions
│   └── queryClient.js  # React Query Configuration
└── App.jsx             # App Entry & Provider Composition
```

---

## 3. Core Systems Explained

### A. Authentication System
*   **Location:** `src/context/AuthContext.jsx`
*   **Mechanism:** Wraps the entire application. It creates a `user` object in state and persists it (currently via `localStorage` for the MVP).
*   **Protection:** Routes are protected via `src/layouts/ProtectedLayout.jsx`. It checks `useAuthContext`. If no user is found, it redirects to Login.

### B. The Routing Strategy
*   **Specialty:** Instead of hardcoding `<Route>` inside `App.jsx`, we use a configuration object in `src/config/routes.js`.
*   **Benefit:** This allows us to map routes to "Lazy Loaded" components easily.
*   **Code Insight:**
    ```javascript
    // config/routes.js
    export const routeConfig = {
      protected: [
        { path: '/messages', component: 'Messages', title: 'Messages' },
        // ...
      ]
    }
    ```
    `App.jsx` simply maps over this array to generate routes dynamically.

### C. Data & State Management Strategy
We strictly separate **UI State** from **Server Data**.
*   **Frontend-Only Data:** Managed by `useState` (e.g., `isSidebarOpen`, `activeTab`).
*   **Backend Data:** Access ONLY via Custom Hooks (`usePosts`, `useUsers`).
    *   *Why?* React Query automatically caches this data. If you switch tabs from "Home" to "Profile" and back, the data is instant (no loading spinner) because it's cached.
    *   **Optimistic Updates:** In `usePosts.js`, when a user "Likes" a post, we update the UI *immediately* before the server responds to make the app feel instant.

---

## 4. Key Feature Implementation Details

### A. The "Smart Match" & Hybrid Feed (`Home.jsx`)
*   **Concept:** The Home feed maintains user engagement by algorithmically mixing two distinct content types:
    1.  **Partner Suggestions (Swap Cards):** Generated dynamically from the User database. These aren't "posts" in the database but are rendered as cards to look like content. They represent potential matches based on what the current user wants to learn.
    2.  **Community Posts (Social Content):** Actual posts from `db.json` (server) created by users.
*   **Feed Logic:** `useMemo` in `Home.jsx` combines `usersData` (filtered to exclude current user) and `postsData`. It normalizes them into a single `feedData` array and shuffles them to create a discovery-rich experience.

### B. Post Types & Polymorphic UI (`PostCard.jsx`)
The `PostCard` component switches its layout entirely based on the `post.type` property:
1.  **Swap (`type="swap"`):**
    *   **Displays:** "Teaches" vs "Wants" tags, Match Score %, Distance.
    *   **Action:** "Swap" button triggers `RequestSwapModal`.
2.  **Achievement (`type="achievement"`):**
    *   **Displays:** Large Badge icon, Milestone title, Swap count.
    *   **Use Case:** Gamification updates (e.g., "Unlocked 50 Swaps").
3.  **Event (`type="event"`):**
    *   **Displays:** Date/Time blocks, "Spots Left", "Register" button.
    *   **Use Case:** Community workshops or group sessions.
4.  **Success Story (`type="success"`):**
    *   **Displays:** "Learned" vs "Outcome" split view.
    *   **Use Case:** Testimonials (e.g., "Learned React -> Got a Job").

### C. The Swap Request Workflow (`RequestSwapModal.jsx`)
This is the core "Conversion" flow of the app. It transitions a user from "Browsing" to "Chatting".
1.  **Trigger:** User clicks "Swap" on a generic Feed Card.
2.  **The Modal (Wizard Step Form):**
    *   **Step 1 (Skills):** Select what you want to Learn (from their profile) and what you will Teach (from your profile). *Auto-matches if possible.*
    *   **Step 2 (Pitch):** Write a personalized message (min 20 chars).
    *   **Step 3 (Logistics):** Select Availability (e.g., "Weekends") and Duration (e.g., "1 hour").
    *   **Step 4:** Review.
3.  **Backend Execution (3-Step Atomic Transaction):**
    *   **Action 1:** `createSwapMutation` -> Creates a `swaps` record (Status: "pending").
    *   **Action 2:** `createConversationMutation` -> Creates a new chat thread between the two users (Context: `swap_request`).
    *   **Action 3:** `sendMessageMutation` -> Sends a formatted system message into that chat containing the proposal details.
4.  **Result:** The user is redirected to the `MessagesPage` to wait for a reply.

### D. Real-Time Video Calling (Integration with Jitsi)
*   **Location:** `src/Components/Messages/MessagesPage.jsx` & `VideoCallModal.jsx`.
*   **Workflow:**
    1.  User clicks Video Icon in `ChatHeader`.
    2.  `MessagesPage` generates a unique string `roomId` (e.g., `SkillSwap-<chatID>-<timestamp>`).
    3.  State `showVideoCall` becomes true.
    4.  `VideoCallModal` mounts via a React Portal or conditional render.
    5.  **Jitsi SDK:** Loads the Jitsi IFrame inside the modal, passing the `roomId` and `userInfo`.
    6.  **No Backend Video Server Needed:** Jitsi handles the P2P connection via their public servers (mesh networking).

### C. The Navbar as a Command Center
*   **Specialty:** The Navbar (`src/Components/Navbar.jsx`) is "Smart".
*   **Context Awareness:** On mobile, the Floating Action Button (FAB) changes behavior:
    *   On `/groups`: Button opens `CreateGroupModal`.
    *   On `/community`: Button opens "New Post".
*   **Global Modals:** The Navbar hosts global modals like `CreateGroupModal` so they can be triggered from anywhere in the app without unmounting the current page.

---

## 5. Developer Flows ("How to...")

### Adding a New Page
1.  Create the Component in `src/pages/NewPage.jsx`.
2.  Open `src/config/routes.js`.
3.  Add the lazy import to `pages` object.
4.  Add the route definition to `routeConfig.protected` (or public).
    *   *Result:* The page is automatically accessible, lazy-loaded, and protected.

### Adding a New API Call
1.  Open `src/services/api.js`.
2.  Add the method to the appropriate service object (e.g., `groupsService.create(data)`).
3.  Create a hook in `src/hooks/useGroups.js` (e.g., `useCreateGroup`).
    *   Use `useMutation` for writes or `useQuery` for reads.
    *   Call `queryClient.invalidateQueries` on success to refresh data automatically.

---

## 6. Unique Selling Points (Technical Perspective)
1.  **Zero-Cost Architecture:** The app is designed to run with minimal backend cost by leveraging Jitsi for video and peer-to-peer logic.
2.  **Modular "Block" Design:** UI components (`SwapCard`, `PostCard`) are strictly decoupled. They take props and render. They do not fetch their own data. This makes testing and redesign redesigning easy.
3.  **Resilient routing:** URL synchronization in `Navbar` ensures even if a user manually types a URL or uses Back button, the active state remains correct.

---

## 7. Data Models & UI Schemas

To ensure consistency across the application, we strictly adhere to the following data schemas for our core entities.

### A. User Profile Object
Used in `AuthContext` and Profile pages.
```json
{
  "id": "u1",
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex@example.com",
  "avatar": "https://...",
  "bio": "Full Stack Developer obsessed with clean code.",
  "role": "Senior Developer", // Displayed on cards
  "rating": 4.9,
  "skillsToTeach": [
    { "id": "s1", "name": "React", "level": "Expert" }
  ],
  "skillsToLearn": [
    { "id": "s2", "name": "Spanish", "level": "Beginner" }
  ]
}
```

### B. Post Object (Polymorphic)
The `PostCard` component renders different layouts based on the `type` field.

**Common Fields:**
```json
{
  "id": "p1",
  "authorId": "u1",
  "author": "Alex Johnson",
  "content": "Just had an amazing session...",
  "timestamp": "2023-10-15T10:00:00Z",
  "type": "swap" | "achievement" | "event" | "success" | "general",
  "likes": 42,
  "comments": []
}
```

**Type-Specific Fields:**

1.  **Swap Post (`type: "swap"`):**
    *   `teaches`: Array of strings (e.g., `["React", "Node"]`)
    *   `wants`: Array of strings (e.g., `["Guitar"]`)
    *   `matchScore`: Number (0-100) - Calculated compatibility
    *   `distance`: String ("Remote" or "5km away")

2.  **Achievement Post (`type: "achievement"`):**
    *   `badge`: String (Name of the badge)
    *   `achievementCount`: Number (Total swaps completed)

3.  **Event Post (`type: "event"`):**
    *   `eventDetails`: Object `{ date: "...", time: "...", spotsLeft: 5 }`

### C. Group Object
Used in `CreateGroupModal` and Groups Page.
```json
{
  "id": "g1",
  "name": "React Developers Hub",
  "description": "A community for React enthusiasts...",
  "category": "development", // design, business, etc.
  "icon": "code", // Internal icon ID mapping to Lucide icon
  "size": "medium", // small (5-15), medium (16-30), large (30+)
  "frequency": "weekly", // daily, weekly, monthly
  "meetingType": "virtual", // virtual, inperson, hybrid
  "members": ["u1", "u2"],
  "skills": ["React", "JavaScript"] // Tags
}
```

### D. Message/Conversation Object
Used in `MessagesPage`.
```json
{
  "id": "c1",
  "participants": ["u1", "u2"], // IDs of users
  "lastMessage": "Sounds good!",
  "unreadCount": 2,
  "swapDetails": {
    "status": "active", // pending, active, completed
    "skillToTeach": "React",
    "skillToLearn": "Spanish",
    "nextSession": "Tue, 6 PM"
  },
  "messages": [
    {
      "id": "m1",
      "senderId": "u1",
      "content": "Hello!",
      "type": "text", // text, image, audio
      "attachmentUrl": "..." // Optional
    }
  ]
}
```
