# QueueLess

**QueueLess** is a full-stack mobile application that replaces physical, in-person waiting lines with a live digital queue. Built with **React Native (Expo), Express.js, TypeScript, MongoDB, and Socket.IO**, it lets customers join queues remotely, track their live position, and get notified when their turn is near — while businesses manage queues, walk-ins, and analytics from a dedicated dashboard.

---

# Architecture

QueueLess follows a **Client–Server Real-Time Architecture**, separating the mobile client, REST API, real-time event layer, and database for scalability and maintainability.

| Layer | Responsibility |
|---|---|
| Mobile Client | React Native (Expo) app for customers and businesses |
| API Layer | Express.js REST endpoints and business logic |
| Real-Time Layer | Socket.IO rooms for live queue updates and notifications |
| Database | MongoDB Atlas for users, businesses, queues, and entries |
| Authentication | JWT-based auth with role-based access control |

---

# Problem & Solution

People physically stand in line at clinics, salons, restaurants, banks, and repair shops, wasting hours doing nothing but waiting. QueueLess lets a customer join a business's queue remotely, see their live position and estimated wait time, and leave the physical location until it's almost their turn.

---

# Features

## Customer Side

| Capability | Description |
|---|---|
| Browse & Search Businesses | Discover nearby businesses by name or category |
| Join a Queue | Get a live position number instantly |
| Live Position Tracking | Position updates in real time via Socket.IO, no polling |
| Notifications | "Get Ready" and "Your Turn" alerts as position closes in |
| Queue History | View past visits and wait times |
| Reviews | Rate and review a business after being served |

## Business Side

| Capability | Description |
|---|---|
| Business Registration | Create a business profile with category, address, and hours |
| Queue Management | Create, pause, and manage multiple parallel queues |
| Live Dashboard | Real-time list of everyone currently in queue |
| Call Next | Advance the queue and notify the next customer instantly |
| Walk-In Support | Manually add customers without the app |
| No-Show Handling | Skip customers who don't show up |
| Analytics | Average wait time, customers served/day, peak hours |

## Admin Side

| Capability | Description |
|---|---|
| Business Verification | Approve or ban business accounts |
| User Management | Search and moderate users platform-wide |
| Platform Analytics | Track total users, businesses, and queues served |

---

# Workflow

```text
Customer Opens Business
      ↓
Joins Queue → Gets Position Number
      ↓
Live Position Updates (Socket.IO)
      ↓
"Get Ready" Notification
      ↓
Business Calls Next → "Your Turn" Notification
      ↓
Customer Served → Leaves Review
```

---

# Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native 0.81, Expo SDK 54, Expo Router, TypeScript, NativeWind |
| State & Data | TanStack Query, Axios, React Hook Form, Zod |
| Animations & 3D | React Native Reanimated, Gesture Handler, Three.js (Expo Three) |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Real-Time | Socket.IO |
| Authentication | JWT, bcrypt, Expo Secure Store |
| Validation | Zod (shared schemas across client and server) |

---

# Real-Time System

QueueLess uses **Socket.IO rooms** to keep every screen live without polling:

- `queue:<queueId>` — every client currently viewing or waiting in a specific queue
- `user:<userId>` — every logged-in user's personal room, for direct notifications regardless of screen

Any mutation to a queue entry (join, leave, call-next, no-show) triggers a fresh broadcast to the relevant room, so customer and business screens update instantly and in sync.

---

# Creator & Developer

**Muhammad Ashhadullah Zaheer**

LinkedIn: https://www.linkedin.com/in/muhammad-ashhadullah-zaheer-41194a340/
