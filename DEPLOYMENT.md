# 🚀 Cravings - Production Deployment Guide

This guide provides instructions to deploy the **Cravings** full-stack web application to production.

---

## 🏗️ Architecture Overview

- **Frontend**: React (Vite, TailwindCSS) → Deployed on **Vercel** or **Netlify**
- **Backend**: Node.js (Express, Mongoose, JWT) → Deployed on **Render**, **Railway**, or **AWS**
- **Database**: **MongoDB Atlas** (Managed Cloud Database)
- **Media Storage**: **Cloudinary** (Images & restaurant assets)

---

## 1. MongoDB Atlas Setup (Cloud Database)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere for cloud deployment).
3. Under **Database Access**, create a database user with password.
4. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```env
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/Cravings?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment (Render / Railway)

### Option A: Deploy on [Render](https://render.com) (Recommended & Free)

1. Push your repository to GitHub / GitLab.
2. Log into Render and click **New +** → **Web Service**.
3. Select your repository.
4. Configure the service:
   - **Name**: `cravings-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add the following:
   | Key | Example Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `4500` (or leave default for Render) |
   | `MONGO_DB_URI` | `mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/Cravings?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `your_long_secure_jwt_secret_key` |
   | `CLIENT_URL` | `https://your-cravings-frontend.vercel.app,http://localhost:5173` |
   | `CLOUDINARY_CLOUD_NAME` | `your_cloudinary_cloud_name` |
   | `CLOUDINARY_API_KEY` | `your_cloudinary_api_key` |
   | `CLOUDINARY_API_SECRET` | `your_cloudinary_api_secret` |
   | `GMAIL_USERNAME` | `your_email@gmail.com` |
   | `GMAIL_PASSCODE` | `your_google_app_password` |
   | `RAZORPAY_KEY_ID` | `rzp_test_TNexn2UwjkFL71` |
6. Click **Deploy Web Service**.
7. Copy your backend service URL (e.g. `https://cravings-backend.onrender.com`).

> [!TIP]
> **Auto-Seeding**: The backend automatically seeds all 8 partner restaurants, full categorized menus (80+ items), and manager accounts on the first launch if the database is fresh!

---

## 3. Frontend Deployment (Vercel / Netlify)

### Option A: Deploy on [Vercel](https://vercel.com) (Recommended)

1. Log into Vercel and click **Add New** → **Project**.
2. Select your `Cravings` GitHub repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://your-cravings-backend.onrender.com` (Your Render backend URL) |
   | `VITE_RAZORPAY_KEY_ID` | `rzp_test_TNexn2UwjkFL71` |
5. Click **Deploy**.
6. Once deployed, copy your frontend Vercel URL (e.g. `https://cravings-app.vercel.app`) and update `CLIENT_URL` in your backend environment variables!

---

## 4. Default Seed Accounts & Credentials

After deployment (or running `npm run seed`), the following demo accounts are available:

### Site Admin
- **Email**: `admin1@gmail.com`
- **Password**: `Admin@123`

### Restaurant Managers
- **Bella Napoli Pizzeria**: `manager1@gmail.com` / `Manager@123`
- **The Burger Barn**: `manager2@gmail.com` / `Manager@123`
- **Royal Biryani Darbar**: `manager3@gmail.com` / `Manager@123`
- **Wok & Roll Asian**: `manager4@gmail.com` / `Manager@123`
- **Green Bowl Organics**: `manager5@gmail.com` / `Manager@123`
- **Bean & Bloom Cafe**: `manager6@gmail.com` / `Manager@123`
- **Madras Tiffin Room**: `manager7@gmail.com` / `Manager@123`
- **Sip & Slurp Boba**: `manager8@gmail.com` / `Manager@123`

### Regular Customers
- **Aarav Sharma**: `customer1@gmail.com` / `Password@123`
- **Priya Nair**: `customer2@gmail.com` / `Password@123`

### Delivery Riders
- **Vikram Singh**: `rider1@gmail.com` / `Password@123`
- **Amit Patel**: `rider2@gmail.com` / `Password@123`

---

## 5. Health & Monitoring

- **Health Endpoint**: `https://your-backend.onrender.com/health` (Returns status `200 OK`, server uptime, and timestamp).
- **API Status**: `https://your-backend.onrender.com/` (Returns API identity and status).
