# 📋 Job Portal

A full-stack, role-based web application that connects **Job Seekers** with **Recruiters**. Recruiters can register their company, post job openings, manage applicants, and update application statuses. Job seekers can browse jobs, apply with a cover letter, track their applications, and explore companies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Vite) |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v4 |
| **State Management** | React Context API (`AuthContext`) |
| **HTTP Client** | Axios (with interceptors for JWT) |
| **Form Management** | React Hook Form + Zod validation |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Build Tool** | Vite 5 |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd job-portal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your API URL

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Folder Structure

```
src/
├── App.jsx                     # Root component (Router + AuthProvider + Toaster)
├── index.jsx                   # Entry point (renders App into DOM)
│
├── api/
│   └── index.js                # Axios instance + all API service functions
│
├── assets/
│   ├── images/                 # Static images (avatar, etc.)
│   └── styles/
│       └── index.css           # Global styles & Tailwind config
│
├── components/
│   ├── company/
│   │   └── RegisterCompanyForm.jsx
│   ├── jobs/
│   │   ├── JobCard.jsx             # Job card for seekers
│   │   ├── RecruiterJobCard.jsx    # Job card for recruiters
│   │   ├── ApplyJobModal.jsx       # Apply to job modal
│   │   ├── PostJobModal.jsx        # Create/Edit job modal
│   │   └── JobApplicantsModal.jsx  # View applicants modal
│   ├── layout/
│   │   ├── Layout.jsx              # Navbar + Footer + Outlet
│   │   └── ProtectedRoute.jsx      # Auth & role guard
│   └── modal/
│       └── DeleteConfirmationModal.jsx  # Reusable delete confirmation
│
├── constant/
│   └── apiEndpoints.js         # Centralized API endpoint strings
│
├── context/
│   └── AuthContext.jsx         # Auth state, login, signup, logout
│
├── router/
│   └── Router.jsx              # All route definitions + HomePage
│
├── utils/
│   ├── validation.js           # Zod schemas (login, signup, company, job, application)
│   └── formatters.js           # Salary formatter, time-ago, date formatters
│
└── views/
    ├── authentication/
    │   ├── LoginPage.jsx
    │   └── SignupPage.jsx
    ├── applications/
    │   └── MyApplicationsPage.jsx
    ├── company/
    │   ├── CompanyPage.jsx          # Recruiter's own company CRUD
    │   └── CompaniesListingPage.jsx # Seeker browses all companies
    ├── jobs/
    │   ├── JobListing.jsx           # Seeker browses all jobs
    │   └── RecruiterDashboard.jsx   # Recruiter's job management
    └── user/
        └── ProfilePage.jsx         # View profile + delete account
```

---

## User Roles & Permissions

The app has **two user roles** selected during signup:

| Feature | 🧑‍💼 Job Seeker | 🏢 Recruiter |
|---|---|---|
| Browse Jobs (`/jobs`) | ✅ | ❌ (hidden from nav) |
| Apply to Jobs | ✅ | ❌ (blocked in code) |
| My Applications (`/my-applications`) | ✅ | ❌ |
| Browse Companies (`/companies`) | ✅ | ❌ |
| Register/Manage Company (`/company`) | ❌ | ✅ |
| Recruiter Dashboard (`/dashboard`) | ❌ | ✅ |
| Post/Edit/Delete Jobs | ❌ | ✅ |
| View Applicants & Update Status | ❌ | ✅ |
| View Profile (`/profile`) | ✅ | ✅ |
| Delete Account | ✅ | ✅ |

---

## API Endpoints

| Module | Method | Endpoint | Purpose |
|---|---|---|---|
| **Auth** | POST | `/auth/login` | Login with email & password |
| **Auth** | POST | `/auth/logout` | Logout (invalidate refresh token) |
| **Auth** | POST | `/auth/refresh` | Refresh access token |
| **User** | POST | `/users/` | Create new user (signup) |
| **User** | GET | `/users/me` | Get logged-in user's profile |
| **User** | DELETE | `/users/me` | Delete own account |
| **Company** | GET | `/companies/` | List all companies |
| **Company** | GET | `/companies/me` | Get recruiter's own company |
| **Company** | POST | `/companies/` | Register a new company |
| **Company** | PUT | `/companies/:id` | Update company details |
| **Company** | DELETE | `/companies/:id` | Delete company |
| **Job** | GET | `/jobs/` | List jobs (with filters & pagination) |
| **Job** | POST | `/jobs/` | Create a new job posting |
| **Job** | PUT | `/jobs/:id` | Update a job posting |
| **Job** | DELETE | `/jobs/:id` | Delete a job posting |
| **Job** | GET | `/jobs/:jobId/applications` | Get all applications for a job |
| **Job** | POST | `/jobs/:jobId/applications` | Apply to a job (with cover letter) |
| **Application** | GET | `/applications/me` | Get seeker's own applications |
| **Application** | PUT | `/applications/:id/update-status` | Update application status (recruiter) |
| **Application** | DELETE | `/applications/:id` | Withdraw/delete an application |

---

## Authentication Flow

### Signup Flow
1. User visits `/signup`
2. Fills in: **First Name**, **Last Name**, **Email**, **Password**
3. Selects role: **Job Seeker** or **Recruiter** (visual radio cards)
4. All fields validated via Zod (`signupSchema`) — min 2 chars for names, valid email, min 6 char password
5. On submit → `POST /users/` with `{ email, first_name, last_name, password, role }`
6. Success → toast notification → redirect to `/login`
7. Failure → error toast with server message

### Login Flow
1. User visits `/login`
2. Fills in: **Email** and **Password**
3. Validated via Zod (`loginSchema`)
4. On submit → `POST /auth/login`
5. Success → stores `access_token` and `refresh_token` in `localStorage` → sets user in context → redirects to previous page or `/`
6. Failure → error toast

### Session Persistence
1. On app load, `AuthContext` checks for token in `localStorage`
2. If token exists → calls `GET /users/me` to fetch profile
3. If token expired → Axios interceptor auto-refreshes via `POST /auth/refresh`
4. If refresh also fails → clears tokens → redirects to `/login`

### Logout Flow
1. User clicks logout icon → **Logout Confirmation Modal** appears (animated)
2. On confirm → `POST /auth/logout` with refresh token → clears `localStorage` → redirects to `/login`

---

## Pages & Functionality (Step by Step)

### 🏠 Home Page (`/`)

- **Route:** Public, no auth required
- Hero section: "Find Your Next Career Opportunity"
- **Job Seeker** → sees "Browse Jobs" + "Post a Job" buttons
- **Recruiter** → sees "Go to Dashboard" button only (no "Browse Jobs")
- **Guest** → sees both buttons

---

### 🔐 Login Page (`/login`)

- Email input (validated: must be valid email)
- Password input (validated: min 6 characters)
- Submit button with loading spinner
- "Don't have an account? Sign up for free" link → `/signup`
- On success: redirects to the page user was trying to access (saved in `location.state`)

---

### 📝 Signup Page (`/signup`)

- First Name + Last Name (side-by-side grid)
- Email Address
- Password
- **Role Selection** — Two visual cards:
  - 🧑 Job Seeker (default selected)
  - 💼 Recruiter
- Each card highlights with primary color + ring effect when selected
- Submit → creates account → redirects to `/login` with success toast
- "Already have an account? Sign in" link → `/login`

---

### 👤 Profile Page (`/profile`)

- **Protected:** Any authenticated user
- **Left Column — Profile Card:**
  - Gradient header banner
  - User initial avatar (first letter of first name)
  - Full name, email, role badge (green for seeker, blue for recruiter)
- **Right Column — Details:**
  - Personal Information: First name, last name, email
  - Account Details: User ID, role, member since, last updated
- **Danger Zone:**
  - "Close Account Permanently" red button
  - Opens `DeleteConfirmationModal`
  - Confirms → `DELETE /users/me` → logs out → redirects to login

---

### 💼 Job Listing Page (`/jobs`)

- **Protected:** Primarily for Job Seekers (hidden from Recruiter nav)

#### Features:
1. **Header:** "Browse Careers" badge + total count + "Find Your Next Career Leap" title
2. **Search Bar:** Full-width, debounced (500ms), searches by title/company/keywords
3. **Filter Drawer** (slides in from right):
   - Employment Type: full_time, part_time, remote, intern (toggle buttons)
   - Location: text input
   - Salary Range: min & max number inputs
   - "Show Matching Jobs" applies filters; "Reset All Filters" clears everything
   - Active filter count badge on button
4. **Job Cards Grid** (3 columns):
   - Company icon + name
   - Salary range (formatted: e.g., "₹5L — 12L")
   - Job type badge + Location
   - Job title + description (2-line clamp)
   - Tags (first 2 + "+N" indicator)
   - Time ago (e.g., "2d ago", "Today")
5. **Apply Flow:**
   - Click any job → `ApplyJobModal` opens
   - If not logged in → redirects to `/login`
   - If recruiter → blocked with alert
   - Cover letter textarea (validated: 20–5000 chars)
   - Submit → `POST /jobs/:jobId/applications` → success animation → auto-closes
6. **Pagination:** 9 jobs/page, page buttons + prev/next arrows
7. **Company Filter:** Supports `?company_id=xxx` URL param from Companies listing
8. **Empty/Loading States:** Skeleton cards + "No Matches Found" with reset option

---

### 📄 My Applications Page (`/my-applications`)

- **Protected:** Job Seekers only

#### Features:
1. **Header:** "My Applications" + total count
2. **Application Cards** (full-width list):
   - Color-coded status accent bar (left edge): 🟢 Accepted, 🔴 Rejected, 🟡 Pending, 🔵 Reviewed
   - Job title, company name with icon
   - Location, application date, job type
   - Cover letter preview (italic, 2-line clamp)
   - Status badge (color-coded pill with icon)
   - "Withdraw Application" button
3. **Withdraw Flow:** Confirmation modal → `DELETE /applications/:id` → success toast → removes from list
4. **Empty State:** "No applications yet" → link to browse jobs

---

### 🏢 Companies Listing Page (`/companies`)

- **Protected:** Job Seekers only

#### Features:
1. **Header:** "Discover Top Companies" with corporate directory badge
2. **Search:** Client-side filtering by name or location
3. **Company Cards** (3-column grid):
   - Gradient company icon
   - Website link (opens in new tab)
   - Company name + description (3-line clamp)
   - Location + website URL display
   - **"View Profile" button** → navigates to `/jobs?company_id=xxx` (shows all jobs from that company)
4. **Animations:** Staggered fade-in, lift on hover
5. **Empty State:** "No companies found" → clear search

---

### 🏗️ Company Management Page (`/company`)

- **Protected:** Recruiters only

#### 4 States:

**State 1 — No Company (Landing):**
- Hero: "Ready to hire the Best Talent?"
- Animated stats card, modern office image, social proof
- "Get Started Now" button → registration form

**State 2 — Registration Form:**
- `RegisterCompanyForm` with left panel (benefits) + right panel (form)
- Fields: Company Name, Website (URL), Location, Description
- Validated via Zod: min 2 chars name/location, valid URL, min 20 chars description
- Submit → `POST /companies/`

**State 3 — Success Celebration:**
- Animated check + "Welcome Aboard, {CompanyName}!"
- "Go to Dashboard" button

**State 4 — Company Dashboard:**
- Company logo initial, name, location, website
- Stats cards (established year, system health)
- "Update Profile" + "Go to Dashboard" buttons
- Organization biography, website card, location card
- **Edit Mode:** Pre-filled form → `PUT /companies/:id`
- **Delete:** Red danger zone → `DeleteConfirmationModal` → `DELETE /companies/:id`

---

### 📊 Recruiter Dashboard (`/dashboard`)

- **Protected:** Recruiters only
- **Prerequisite:** Must have a registered company (shows error + link to `/company` if none)

#### Features:

1. **Header Stats (4-column grid):**
   - Welcome with company name + "Premium Access" badge
   - Active/Inactive job count card
   - Total applicants count card

2. **Action Bar:**
   - Active/Inactive toggle tabs
   - Debounced search
   - Filters drawer (Employment Type, Location, Salary Range)
   - "Post New Opportunity" button

3. **Job Cards Grid** (3 columns) — `RecruiterJobCard`:
   - Job type + Active/Inactive status badges
   - **Edit button** → opens `PostJobModal` in edit mode
   - **Delete button** → `DeleteConfirmationModal` → `DELETE /jobs/:id`
   - Title, location, salary range
   - Tags (first 5, expandable "+N more")
   - Applicant count
   - Arrow button → opens `JobApplicantsModal`

4. **Post Job Modal:**
   - Fields: Role Title, Job Type (dropdown), Location, Min/Max Salary, Description, Tags (dynamic add/remove), Active Toggle
   - Validated via Zod: title ≥ 3 chars, description ≥ 20 chars, salary_max ≥ salary_min
   - Create → `POST /jobs/` | Edit → `PUT /jobs/:id`

5. **View Applicants Modal:**
   - Job title, type, posted date
   - Search applicants by name/email
   - Total applicant count
   - Each applicant card: name, email, date, cover letter
   - **Status Dropdown:** Recruiter changes status → `PUT /applications/:id/update-status`
     - Options: Pending (amber), Reviewed (blue), Accepted (green), Rejected (red)
   - Loading spinner during status update

---

## Route Protection & Access Matrix

| Route | Guest | Job Seeker | Recruiter |
|---|---|---|---|
| `/` | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ |
| `/signup` | ✅ | ✅ | ✅ |
| `/jobs` | ❌ → login | ✅ | ✅ (hidden in nav) |
| `/my-applications` | ❌ → login | ✅ | ❌ → home |
| `/companies` | ❌ → login | ✅ | ❌ → home |
| `/dashboard` | ❌ → login | ❌ → home | ✅ |
| `/company` | ❌ → login | ❌ → home | ✅ |
| `/profile` | ❌ → login | ✅ | ✅ |
| `/*` (catch-all) | → `/` | → `/` | → `/` |

---

## Navbar Behavior

| User State | Nav Links | Right Section |
|---|---|---|
| **Guest** | (none) | Login + Sign Up button |
| **Job Seeker** | Browse Jobs, My Applications, Company | Avatar + Name + Logout icon |
| **Recruiter** | Dashboard, Company | Avatar + Name + Logout icon |
| **Auth Pages** | (hidden) | Login/Signup buttons |

---

## Form Validation Schemas (Zod)

| Schema | Fields | Rules |
|---|---|---|
| `loginSchema` | email, password | Valid email; password ≥ 6 chars |
| `signupSchema` | first_name, last_name, email, password, role | Names ≥ 2 chars; valid email; password ≥ 6; role = job_seeker or recruiter |
| `companySchema` | name, website, location, description | Name ≥ 2; valid URL; location ≥ 2; description ≥ 20 chars |
| `jobSchema` | title, description, job_type, location, salary_min, salary_max, tags, is_active | Title ≥ 3; description ≥ 20; salaries non-negative; max ≥ min |
| `applicationSchema` | cover_letter | 20–5000 characters |

---

## Reusable Components

| Component | Used In | Purpose |
|---|---|---|
| `Layout` | All pages | Navbar + main content outlet + footer |
| `ProtectedRoute` | Router | Auth guard with role checking |
| `DeleteConfirmationModal` | Profile, Dashboard, Company | Animated confirmation dialog (customizable text) |
| `JobCard` | JobListing | Seeker-facing job card |
| `RecruiterJobCard` | RecruiterDashboard | Recruiter-facing job card with edit/delete/applicants |
| `ApplyJobModal` | JobListing | Cover letter form + apply submission |
| `PostJobModal` | RecruiterDashboard | Create/edit job form |
| `JobApplicantsModal` | RecruiterDashboard | View & manage applicants per job |
| `RegisterCompanyForm` | CompanyPage | Split-layout company registration form |

---

## Utility Functions

### `formatters.js`

| Function | Purpose | Example |
|---|---|---|
| `formatSalary(val)` | Formats numbers to human-readable | `500000` → `5L`, `10000000` → `1Cr` |
| `getTimeAgo(timestamp)` | Relative time display | `"2d ago"`, `"Just now"`, `"Yesterday"` |
| `formatDate(timestamp)` | Full date with time | `"April 14, 2026, 05:30 PM"` |
| `formatDateSimple(timestamp)` | Short date | `"Apr 14, 2026"` |

---

## API Service Layer

### Axios Instance Features:
1. **Base URL:** Configurable via `VITE_API_URL` env variable (default: `http://localhost:8000/api/v1`)
2. **Request Interceptor:** Auto-attaches `Bearer <token>` from localStorage
3. **Response Interceptor:**
   - On 401 → attempts token refresh via `POST /auth/refresh`
   - If refresh succeeds → retries original request with new token
   - If refresh fails → clears tokens → redirects to `/login`
4. **16 Named Exports:** Covering all CRUD operations for users, companies, jobs, and applications

---

## Complete User Journeys

### 🧑‍💼 Job Seeker Journey

1. Visit Homepage → Sign Up as Job Seeker → Login
2. Browse Jobs at `/jobs` → Search & filter by type, location, salary
3. Click on a job card → Apply with cover letter
4. Application submitted → Track status at `/my-applications`
5. See status updates: Pending → Reviewed → Accepted/Rejected
6. Optionally withdraw any application
7. Browse companies at `/companies` → Click "View Profile" to see company's jobs
8. View/manage profile at `/profile` → Optionally delete account

### 🏢 Recruiter Journey

1. Visit Homepage → Sign Up as Recruiter → Login
2. Go to `/company` → Register company (name, website, location, description)
3. Success celebration → Navigate to Dashboard
4. At `/dashboard` → Post new job (title, type, location, salary, description, tags)
5. View active/inactive jobs → Edit or delete existing jobs
6. Click on a job → View all applicants in modal
7. Read cover letters → Change application status (Pending → Reviewed → Accepted/Rejected)
8. Manage company at `/company` → Edit details or delete company
9. View profile at `/profile` → Optionally delete account

---

## Key Design Patterns

1. **Role-Based Access Control (RBAC):** Routes and UI elements conditionally rendered based on `user.role`
2. **Optimistic UI Updates:** After job creation/deletion, local state is updated immediately without re-fetching
3. **Debounced Search:** 500ms debounce on search inputs to avoid excessive API calls
4. **Applied vs Pending Filters:** Filter drawer uses pending state; only applies to API on explicit "Apply" click
5. **Token Refresh:** Automatic silent refresh with retry queue for expired tokens
6. **Zod + React Hook Form:** Declarative schema-based validation for all forms
7. **Animated Modals:** All modals use Framer Motion with backdrop blur, scale animations, and exit transitions
