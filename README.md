# Habitual

A clean MERN habit tracker with a React dashboard and Express API.

## Run locally

1. Make sure MongoDB is running locally, or create `server/.env` from `server/.env.example` and set `MONGO_URI` to your Atlas connection string.
2. Install the root helper dependency: `npm install`
3. Install each app: `npm --prefix server install` and `npm --prefix client install`
4. Start both apps with `npm run dev`

The dashboard runs at `http://localhost:5173`. The API health check is at `http://localhost:5000/api/health`.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/habits`
- `POST /api/habits`
- `POST /api/habits/:id/logs`
- `DELETE /api/habits/:id`

Protected routes use `Authorization: Bearer <token>`. To connect the dashboard to a logged-in session, store the JWT as `habit-token` in local storage. Without a token or database, the client remains previewable with sample habits.

## Free deployment

Deploy in this order so the API knows the final frontend origin before browser requests begin.

### 1. MongoDB Atlas

1. Create a free M0 cluster and a database user.
2. In **Network Access**, add the Render outbound access rule. For the simplest free-tier setup, use `0.0.0.0/0` with a strong database password; restrict it later if your plan supports fixed egress IPs.
3. Copy the driver connection string and replace the password placeholder. Use a database name, for example `habit-tracker`.

### 2. Render API

Create a new **Web Service** from the repository. Render can also use the included [render.yaml](render.yaml).

Use these settings if configuring manually:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Add these Render environment variables:

```text
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://<your-vercel-project>.vercel.app
```

Do not commit `server/.env` or put secrets in the frontend. After the first deploy, confirm:

```text
https://<your-render-service>.onrender.com/api/health
```

It should return `{ "success": true, "message": "API is running" }`.

### 3. Vercel frontend

Import the same repository into Vercel and set the project **Root Directory** to `client`. Vercel detects Vite automatically:

```text
Build Command: npm run build
Output Directory: dist
```

Add this Vercel environment variable for Production, Preview, and Development as needed:

```text
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

Redeploy after saving the variable. The included [client/vercel.json](client/vercel.json) keeps React Router URLs working on refresh.

### 4. Finish CORS

Copy the final Vercel URL into Render's `CLIENT_ORIGIN`, save it, and redeploy the API. For a custom domain, use a comma-separated value:

```text
CLIENT_ORIGIN=https://app.example.com,https://<your-vercel-project>.vercel.app
```

Test the order with: health check, register, login, `/auth/me`, create a habit, and mark it complete. If the browser reports CORS, check that the Vercel URL has no trailing slash and that the Render service was redeployed after changing `CLIENT_ORIGIN`.