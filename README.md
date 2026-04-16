# Job Tracker App

A simple and efficient job tracking web application built to help manage job applications throughout the job search process.

## 🚀 Features

* Full CRUD functionality (Create, Read, Update, Delete)
* Track job applications by status (e.g., Applied, Interview, Offer, Rejected)
* Add details like company name, job title, and application date
* Clean and minimal UI for easy use
* Local database storage using SQLite

## 🛠️ Tech Stack

* **Frontend & Backend:** Next.js
* **Language:** TypeScript
* **Database:** SQLite
* **ORM:** Prisma

## 📸 Screenshots



## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/job-tracker.git
   ```

2. Navigate into the project directory:

   ```bash
   cd job-tracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open in browser:

   ```
   http://localhost:3000
   ```

## 🧠 How It Works

This app allows users to manage job applications through a simple interface. Jobs are stored in a SQLite database and accessed via Prisma. The frontend is built using Next.js with TypeScript, enabling a full-stack experience within a single framework.

Users can:

* Add new job applications
* Edit existing entries
* Delete jobs
* View all applications organized by status

## 📁 Project Structure

```
/app        → Next.js app directory (routes & pages)
/prisma     → Prisma schema and migrations
/public     → Static assets
```

## 🔮 Future Improvements

* Add authentication (user accounts)
* Deploy to production (Vercel + hosted DB)
* Add notifications/reminders for follow-ups

## 📌 Why I Built This

I built this project to improve my full-stack development skills and create a practical tool for managing job applications during my own job search.
