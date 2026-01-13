# Copilot Instructions for Car Rental Project

## Project Overview

**DriveNow** is a full-stack car rental application with a React frontend (`/carrental`) and Express backend (`/backend1`).

### Architecture

- **Frontend**: React 19 with React Router v7 for client-side navigation
- **Backend**: Express.js with MySQL database (XAMPP local stack) - all code in `server.js`
- **Communication**: Frontend fetches from backend API on `http://localhost:5000/api`
- **Deployment**: Frontend deploys to GitHub Pages; backend needs separate hosting

## Frontend (`/carrental`)

### Tech Stack & Key Dependencies

- **React 19**: Functional components with hooks (useState, useEffect)
- **React Router v7**: Nested routing with `<Routes>` and `<NavLink>`
- **Lucide Icons**: For UI icons (import from `lucide-react`)

### Component Patterns

- **Page Components** (`/pages`): Full-page components like `carListing.js`, `home.js`
- **Reusable Components** (`/components`): `CarCard`, `NavBar`, `Footer`, `BookingForm`
- **Component Structure**: Export as default; use `.css` files for styling (e.g., `NavBar.js` → `NavBar.css`)
- **Image Handling**: Car images stored as base64 in database; convert with `data:image/jpeg;base64,${car.image_base64}`

### Data Flow

1. Components fetch from `/api/*` endpoints (e.g., `http://localhost:5000/api/cars`)
2. API responses stored in state via `useState` and `useEffect`
3. Filter/transform data (e.g., `carListing.js` filters by car type)
4. Render with `.map()` for lists; use `key` prop with unique IDs

### Common Patterns

- **Routing**: Use `<Link>` for logo/home, `<NavLink>` for nav items (auto `active` class on current route)
- **Page Routes**: Defined in `App.js`; add new pages in `/pages`, import, and add `<Route>`
- **Error Handling**: Try-catch in `useEffect`; store error in state and conditionally render
- **Loading States**: Set loading flag in state; render conditional JSX

### Build & Run

- **Development**: `npm start` in `/carrental` → runs on `http://localhost:3000`
- **Production**: `npm run build` → creates `/build` folder; deploys via GitHub Pages

## Backend (`/backend1`)

### Structure

All backend code is in a single file: `src/server.js`

### Tech Stack

- **Express.js**: REST API server
- **MySQL2**: Database connection pool
- **CORS**: Enabled for `http://localhost:3000` frontend
- **Nodemon**: Auto-reload in development

### Database Setup

- **XAMPP Required**: Runs MySQL locally on default credentials
  - Host: `localhost`, User: `root`, Password: ``(empty), Database:`car_rental`

### API Endpoints

**Users:**

- `POST /api/users/register` → Register new user
- `POST /api/users/login` → User login (returns user object without password)
- `GET /api/users` → Get all users

**Cars:**

- `GET /api/cars` → Get all cars
- `GET /api/cars/:id` → Get single car by ID
- `POST /api/cars` → Create new car
- `PUT /api/cars/:id` → Update car
- `DELETE /api/cars/:id` → Delete car

**Orders:**

- `GET /api/orders` → Get all orders (with user/car joins)
- `POST /api/orders` → Create order (rent a car)
- `PUT /api/orders/:id/status` → Update order status (active/completed/cancelled)

### Common Patterns

- **Callback Pattern**: Queries use Node callback style `(err, data) => {}`
- **Validation**: Check required fields before DB query; return `400` if missing
- **Duplicate Entry**: Catch `ER_DUP_ENTRY` error for unique constraints

### Build & Run

- **Development**: `npm run dev` in `/backend1` → uses nodemon on port 5000
- **Production**: `npm start`
- **Database Test**: Server logs `✅ MySQL connected` or `❌ Database connection failed`

## Development Workflows

### Starting the Full Stack

1. Start MySQL (XAMPP Control Panel)
2. Terminal 1: `cd backend1 && npm run dev`
3. Terminal 2: `cd carrental && npm start`

### Adding a New Page

1. Create `src/pages/NewPage.js` with default export component
2. Create `src/pages/NewPage.css` for styling
3. Import in `App.js` and add `<Route path="/newpage" element={<NewPage />} />`
4. Add `<NavLink to="/newpage">` to `NavBar.js`

### Adding a New API Endpoint

Add directly to `server.js`:

```javascript
app.get("/api/resource", (req, res) => {
  db.query("SELECT * FROM table", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
```

## Project Conventions

- **CSS Naming**: BEM-style (e.g., `car-card__image`, `navbar__links`)
- **File Naming**: PascalCase for components (`NavBar.js`), lowercase for pages (`carListing.js`)
- **No TypeScript**: Plain JavaScript
- **Hardcoded URLs**: Update before production deployment

### Adding a New Component

1. Create `src/components/ComponentName.js` (functional component, default export)
2. Create `src/components/ComponentName.css` alongside
3. Import and use in pages: `import ComponentName from "../components/ComponentName"`

## Deployment Notes

- **Frontend**: Set `homepage` in `package.json` to GitHub Pages URL; run `npm run deploy`
- **Backend**: Requires Node hosting (Heroku, Railway, etc.); update CORS and API URL before deploying
- **Database**: Must migrate to cloud MySQL (Planetscale, AWS RDS) for production
