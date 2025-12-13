# SkillSwap Application Documentation & User Guide

## 1. Introduction & Purpose

**SkillSwap** is a peer-to-peer learning platform designed to democratize education. It operates on a "barter system for knowledge," allowing users to exchange skills directly without monetary cost.

**The Core Purpose:**
To connect someone who wants to learn a skill (e.g., "I want to learn Guitar") with someone who can teach it (e.g., "I can teach Guitar"), while ensuring the teacher gets equal value in return (e.g., "I want to learn Spanish").

**Target Audience:**
*   **Professionals:** exchanging industry knowledge.
*   **Students:** looking for tutoring.
*   **Hobbyists:** sharing passions (cooking, music, art).

---

## 2. Key Features Overview

*   **Smart Matching:** Creating matches based on "What you Teach" vs. "What you Want to Learn".
*   **Real-time Communication:** Integrated Chat, Audio, and Video calling (powered by Jitsi) for conducting lessons effectively.
*   **Community Feed:** A social space to share milestones, ask questions, and network.
*   **Groups:** Dedicated sub-communities for specific interests (e.g., "Tech Talk", "Language Lounge").
*   **Scheduling System:** Built-in tools to propose times, accept sessions, and manage your calendar.
*   **Gamification & Wallet:** A credit-based system to track contributions and engagement.

---

## 3. Page-by-Page User Guide

### A. Authentication (Login / Register)
*   **Purpose:** Securely access your account and personalized data.
*   **How it Works:** 
    *   New users sign up to create a profile.
    *   Existing users sign in to access their dashboard.
*   **Required Inputs:**
    *   **Register:** Name, Email Address, Password.
    *   **Login:** Email, Password.

### B. Home Feed (`/`)
*   **Purpose:** The central dashboard and activity hub.
*   **How it Works:** 
    *   **Hybrid Feed:** Displays a mix of community posts and suggested swap partners.
    *   **Quick Actions:** Shows upcoming sessions and pending requests in the sidebar.
    *   **Discovery:** Users can "Like", "Save", or "Request Swap" directly from user cards.
*   **User Actions:**
    *   Scroll to discover partners.
    *   Click "Swap" on a card to initiate a connection.
    *   Click "Heart" to like a post or profile.

### C. Discovery Page (`/discover`)
*   **Purpose:** The primary search engine for finding specific skills.
*   **How it Works:** 
    *   Users search for a specific skill (e.g., "Python").
    *   Results display users who *Teach* that skill.
    *   "Match Cards" highlight compatibility (e.g., "You both want to learn X").
*   **Required Inputs:**
    *   **Search Query:** Text input for skills.
    *   **Filters:** (Optional) Location, availability, or rating.

### D. Groups (`/groups`)
*   **Purpose:** Niche communities for collective learning.
*   **How it Works:**
    *   Browse "Your Groups" and "Suggested Groups".
    *   Click `+` (or "Create Group") to start a new community.
*   **Create Group - Required Inputs:**
    *   **Group Name:** Unique title.
    *   **Category:** (e.g., Tech, Art).
    *   **Description:** Purpose of the group.
    *   **Privacy Settings:** Public or Private.

### E. Messages & Video Calls (`/messages`)
*   **Purpose:** The classroom and communication center.
*   **Features:**
    *   **Text Chat:** Instant messaging for coordination.
    *   **Video/Audio Call:** Integrated Jitsi Meet for conducting the actual lesson.
    *   **File Sharing:** Send resources, PDFs, or code snippets.
    *   **Scheduling:** "Schedule" button to book a formal time slot.
*   **How to Use Video:**
    *   Open a chat -> Click the **Video Icon** in the header -> A video modal opens instantly.

### F. Community Page (`/community`)
*   **Purpose:** A social feed for broader discussions not tied to a specific swap.
*   **How it Works:**
    *   Users post updates, success stories, or general questions.
    *   Others comment and offer support.
*   **Create Post - Required Inputs:**
    *   **Content:** Text body of the post.
    *   **Tags/Topic:** (Optional) Relevance tags.

### G. Schedule Page (`/schedule`)
*   **Purpose:** Time management.
*   **How it Works:**
    *   Displays a calendar view of all confirmed sessions.
    *   Distinguishes between "Upcoming" and "Past" sessions.
*   **User Actions:**
    *   View details of a lesson.
    *   Join link (if video session) appears here when the time is right.

### H. Profile Page (`/profile`)
*   **Purpose:** Your personal brand and "resume" on the platform.
*   **Crucial Importance:** Matches are generated based on data here.
*   **Required Inputs / Sections:**
    *   **Avatar:** Photo for trust.
    *   **Bio:** Short professional summary.
    *   **"I Teach":** List of skills you are an expert in (with proficiency level).
    *   **"I Want to Learn":** List of skills you are seeking.
    *   **Availability:** Set your general free hours.

### I. Wallet (`/wallet`)
*   **Purpose:** Tracks platform credits (tokens).
*   **How it Works:**
    *   **Earn:** Get tokens by teaching sessions or receiving high ratings.
    *   **Spend:** Use tokens to request sessions from "Top Rated" mentors or unlock premium features.
*   **Details Displayed:** Current Balance, Transaction History.

### J. My Swaps (`/my-swaps`)
*   **Purpose:** Management of active connections.
*   **How it Works:**
    *   Lists all connections categorized by status: `Pending`, `Active`, `Completed`.
*   **User Actions:**
    *   **Accept** or **Reject** incoming requests.
    *   Mark a session as **Completed** after it finishes to update stats.

---

## 4. Typical User Workflow

1.  **Onboarding:**
    *   User registers and **immediately updates their Profile**.
    *   Adds "React.js" to *Teach* and "French" to *Learn*.
2.  **Matching:**
    *   Goes to **Discovery** or **Home**.
    *   Finds a user "Sarah" who Teaches French and wants to learn React.
3.  **Connection:**
    *   Clicks **Request Swap**.
    *   Sends a friendly intro message.
4.  **Coordination:**
    *   Sarah accepts.
    *   They chat in **Messages** and agree to meet Tuesday at 6 PM.
    *   One user clicks **Schedule** to formalize it.
5.  **The Session:**
    *   At 6 PM, they open Messages.
    *   They click the **Video Call** icon.
    *   They spend 30 mins on French, 30 mins on React.
6.  **Aftercare:**
    *   They mark the swap as "Session Complete".
    *   Both leave a 5-star rating.
    *   Credits are awarded to both wallets.
