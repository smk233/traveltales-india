# TravelTales India

TravelTales India is a complete, production-ready travel blogging and vlogging platform. It allows users to register, discover curated Indian destinations, write rich travel blogs, post community reviews, and interact with other travelers.

---

## 🔑 Seeding & Credentials

The application automatically seeds a local database with the following demo credentials on startup if no data is present. You can use these accounts to explore the features of the platform:

| Role | Email | Password | Purpose / Features |
|---|---|---|---|
| **Admin** | `admin@traveltales.in` | `adminpassword123` | Can view administrative dashboards, total metrics (users/posts/comments), manage members, and add new curated destinations. |
| **Explorer 1** | `priya@traveltales.in` | `password123` | Regular user. Can publish travel logs, bookmark stories, and follow/unfollow other explorers. |
| **Explorer 2** | `rohan@traveltales.in` | `password123` | Regular user. Can read blogs, write reviews (comments), and like vlogs. |

---

## 🚀 Getting Started

To install and run the entire application locally, use the workspace script commands defined in the root `package.json`.

### 1. Install Dependencies
You can install dependencies for both the frontend and the backend in a single command run from the root directory:
```bash
npm run install-all
```

### 2. Run Locally in Development Mode
To launch the backend server (port 5000) and Vite frontend server (port 3000) concurrently, run:
```bash
npm run dev
```

* **Frontend Page**: Access the site at [http://localhost:3000/](http://localhost:3000/)
* **Backend API**: Programmatic endpoints are mapped at [http://localhost:5000/](http://localhost:5000/)
* **Local DB & Cache**: If MongoDB and Redis are not running locally, the backend automatically launches a local `MongoMemoryServer` and falls back to an in-memory caching system.

---

## 📂 Project Structure

```text
traveltales-india/
├── backend/                  # Express.js REST API with TypeScript
│   ├── api/                  # Server entry point
│   ├── config/               # DB connections, env utils, and seeding data
│   ├── controllers/          # Business logic handlers
│   ├── middlewares/          # Auth guards, slug generators, and error handlers
│   ├── models/               # Mongoose DB models (User, Post, Comment, etc.)
│   ├── routes/               # Express routing tables
│   ├── services/             # Service layer matching mongoose schemas
│   └── tests/                # Jest & Supertest integration test suites
│
├── frontend/                 # React.js SPA with Vite and TailwindCSS
│   ├── src/
│   │   ├── components/       # Reusable components (Hero, Cards, Navbar, etc.)
│   │   ├── constants/        # Shared list of states & UTs
│   │   ├── helpers/          # Axios instance configuration
│   │   ├── hooks/            # Session management and custom hooks
│   │   ├── pages/            # Page layouts (Dashboard, details, profiles)
│   │   └── types/            # TypeScript core interfaces
│   └── vite.config.ts        # Vite configuration & proxy settings
│
├── README.md                 # Project instructions and credentials (this file)
├── .gitignore                # Version control exclusions
└── package.json              # Workspace script automation wrapper
```

---

## 🧪 Running Tests

To run the backend integration test suite, execute:
```bash
npm run test:backend
```
This tests full REST API lifecycles including auth token generation, role blocks, post curation, and comments threads.
