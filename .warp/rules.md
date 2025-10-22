# EarnApp Manager - Project Rules

## Project Overview
EarnApp Manager is a full-stack web application for managing emails, PayPal accounts, and income tracking with many-to-many relationships between emails and PayPal accounts.

**Tech Stack:**
- **Backend**: Node.js + Express + better-sqlite3 (SQLite database)
- **Frontend**: React 18 + Vite
- **Language**: Vietnamese UI/comments

## Architecture

### Backend (`/backend`)
- **Port**: 4000 (default, configurable via `PORT` env var)
- **Database**: SQLite with better-sqlite3 (synchronous API)
- **Location**: `backend/data/app.db`
- **API Pattern**: RESTful JSON API with `/api/*` prefix

#### Database Schema
- `emails`: id, address (unique), node, ip, note, created_at
- `paypals`: id, address (unique), note, created_at
- `email_paypal`: junction table with email_id, paypal_id (many-to-many)
- `incomes`: id, paypal_id, amount, date, note, created_at

#### Code Patterns
- Use ES modules (`type: "module"`)
- Synchronous database queries with better-sqlite3
- Error handling with try-catch, return `{error: message}` on failure
- Use `dayjs` for date manipulation
- Enable `PRAGMA foreign_keys = ON` for referential integrity

### Frontend (`/frontend`)
- **Port**: 5173 (Vite default)
- **Build output**: `dist/`
- **Proxy**: API calls to `http://localhost:4000/api/*`

#### Component Structure
- `App.jsx`: Main component with tab navigation (email, income, reports)
- `EmailTab.jsx`: Email and PayPal management
- `IncomeTab.jsx`: Income entry and tracking
- `ReportsTab.jsx`: Statistics and reports
- `Api.js`: Centralized API utility (get, post, put, del methods)

#### Code Patterns
- Use React Hooks (useState, useEffect)
- Functional components only
- Inline styles with camelCase properties
- Vietnamese text for UI labels
- Simple CSS classes: `container`, `tabs`, `tab`, `active`, `muted`

## Development Guidelines

### Code Style
1. **Language**: Use Vietnamese for:
   - UI text and labels
   - Comments explaining business logic
   - Variable names can be English or Vietnamese

2. **JavaScript/JSX**:
   - Use ES6+ features (arrow functions, destructuring, async/await)
   - Prefer `const` over `let`, avoid `var`
   - Use template literals for string interpolation
   - Keep components small and focused

3. **Backend**:
   - Validate input data before database operations
   - Return consistent JSON responses: `{success, data}` or `{error}`
   - Use parameterized queries to prevent SQL injection
   - Handle foreign key constraints gracefully

4. **Frontend**:
   - Fetch data on component mount with useEffect
   - Show loading states when appropriate
   - Handle errors gracefully with user-friendly messages
   - Refresh data after mutations (create, update, delete)

### Database Operations
- **Always** use prepared statements: `db.prepare(sql).run(params)`
- **Never** concatenate user input directly into SQL
- Use transactions for multi-step operations
- Check `changes` property after mutations to verify success

### API Design
- **GET** `/api/resource` - List all
- **GET** `/api/resource/:id` - Get one
- **POST** `/api/resource` - Create
- **PUT** `/api/resource/:id` - Update
- **DELETE** `/api/resource/:id` - Delete

### Error Handling
- Backend: Catch errors, log to console, return `{error: "message"}`
- Frontend: Display errors to user, don't crash the app
- Use try-catch for async operations

## Running the Application

### Development
```bash
# Backend (terminal 1)
cd backend
npm install
npm run dev

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
```
Visit: http://localhost:5173

### Production Build
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

Serve `dist/` with any static server and proxy `/api` to backend on port 4000.

## File Organization
```
EarnApp-Manager/
├── backend/
│   ├── server.js           # Main Express server
│   ├── package.json
│   └── data/               # SQLite database location
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main app with tab navigation
│   │   ├── main.jsx        # React entry point
│   │   └── components/
│   │       ├── Api.js      # API utility functions
│   │       ├── EmailTab.jsx
│   │       ├── IncomeTab.jsx
│   │       └── ReportsTab.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Testing
- No formal test framework configured yet
- Manual testing via UI
- Test CRUD operations for each entity
- Verify many-to-many relationships work correctly

## Future Considerations
- Electron/Tauri for desktop app packaging
- Authentication/authorization
- Input validation on frontend
- Better error messages
- Loading spinners
- Pagination for large datasets
- Export data functionality

## Common Tasks

### Add a new API endpoint
1. Add route handler in `backend/server.js`
2. Add corresponding method in `frontend/src/components/Api.js` if needed
3. Call from appropriate component

### Add a new database table
1. Add CREATE TABLE statement in schema initialization
2. Create CRUD endpoints in backend
3. Update frontend components to use new endpoints

### Add a new tab
1. Create new component in `frontend/src/components/`
2. Import in `App.jsx`
3. Add button in tabs section
4. Add conditional render based on tab state

## Dependencies

### Backend
- `express`: Web framework
- `better-sqlite3`: SQLite database (native, synchronous)
- `cors`: CORS middleware
- `dayjs`: Date manipulation

### Frontend
- `react` + `react-dom`: UI library
- `vite`: Build tool and dev server
- `@vitejs/plugin-react`: Vite React plugin

## Notes
- Database is created automatically on first run
- CORS is enabled for all origins (development only)
- No authentication implemented
- Vietnamese is the primary UI language
- Simple, monolithic structure - suitable for small to medium apps
