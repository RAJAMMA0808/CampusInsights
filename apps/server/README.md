### EduManage Server

Environment variables:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/edumanage
SESSION_SECRET=change-me
PORT=4000
```

Commands:
- `npm run dev` — start development server with auto-reload
- `npm run build` — compile TypeScript
- `npm run start` — run compiled server

Auth endpoints:
- POST `/api/auth/register` { username, email?, password, role }
- POST `/api/auth/login` (passport local)
- POST `/api/auth/logout`
- GET `/api/auth/me`

