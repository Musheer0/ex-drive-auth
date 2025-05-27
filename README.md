
# 🛂 garib-drive-auth

This is the **Auth microservice** for the `ex-drive` project — a minimal, dependency-light service that handles **Google OAuth** _without using Google's SDKs or libraries_. Everything is done using **pure webhooks + HTTP requests**.

---

## 🔥 What it does

- Implements **Google OAuth2** manually:
  - Accepts an authorization code from frontend
  - Exchanges it for an access token
  - Fetches user profile
  - Stores user in database
- Provides the usual auth features
- Every token is linked to the **IP address** and **location** (for that extra bit of context/security)

---

## ⚙️ Stack

- **Node.js** + **Express.js**
- Database psql
- No third-party Google auth SDKs — raw HTTP all the way

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Musheer0/ex-drive-auth.git
cd ex-drive-auth
````

### 2. Install dependencies

```bash
npm i
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

You’ll need:

* Google Client ID
* Google Client Secret
* JWT secret
* DB connection string
* (any other values listed in `.env.example`)

### 4. Start dev server

```bash
npm run dev
```

---

## 📦 Endpoints

| Route            | Method | Description                  |
| ---------------- | ------ | ---------------------------- |
| `/auth/oauth/google`   | GET       | Handle Google OAuth (manual) |
| `/token/delete`             | POST     |  Login with existing user     |
| `/token/verify`              | POST     | verify, and get user info          |
| `/token/logout`            | DELETE   | Invalidate token             |
| `/token/refresh`            | POST     | Refresh access token         |

---

## 🧠 Philosophy

No bloat. No black-box magic.
Just raw control over your auth flow — especially for Google sign-in.
You want to build your own Google OAuth without depending on any of their SDKs? This repo’s your cheat code.

---

## 🧪 TODOs

* [ ] IP/location change detection
* [ ] Unit tests
* [ ] Docker support (optional)

---

## 💻 Author

**Musheer** — [@Musheer0](https://github.com/Musheer0)

---

## 📜 License

MIT — feel free to fork, use, abuse.

---

> *“OAuth SDKs are for mortals. We go raw.”* 😎

```

---

```
