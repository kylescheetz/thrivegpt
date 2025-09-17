# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ba4ea96d-835f-4468-a252-915bc991f1dd

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ba4ea96d-835f-4468-a252-915bc991f1dd) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ba4ea96d-835f-4468-a252-915bc991f1dd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

# 🌱 ThriveGPT

**Where Habits Meet Intelligence**

ThriveGPT is a personal AI‑powered health and wellness companion designed to help you set goals, stay motivated, and reflect on your daily actions.
At its core, ThriveGPT is a habit tracker that blends wellness coaching, biohacking insights, mental health support through journaling, and actionable AI guidance — your personal coach for high‑performance living.

---

## ✨ Key Features

✅ **Daily Wellness Check‑In**
Log your mood, energy, workouts, meals, and overall well‑being through simple text or voice prompts.

✅ **Smart Habit Tracker**
Track habits, streaks, and progress with an interactive dashboard that visualizes your growth.

✅ **AI‑Powered Journaling**
Guided prompts to reflect on your day. ThriveGPT summarizes entries, highlights key patterns, and offers insights.

✅ **Personalized Guidance**
GPT‑powered suggestions to improve routines, focus, and overall wellness.

✅ **Weekly & Monthly Insights**
Automated summaries with trend analysis, highlights, and actionable tips.

✅ **Push Notifications & Reminders**
Stay accountable with habit nudges, encouragement, and timely reflections.

---

## 🏗️ Tech Stack

* **Frontend:** [Lovable.dev](https://lovable.dev) (no‑code/low‑code builder exporting React)
* **Backend & Database:** [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, API)
* **AI Engine:** OpenAI GPT APIs
* **Hosting & Deployment:** Lovable.dev hosting or custom export to Vercel/Netlify

---

## 📱 UI Highlights

* **Lovable.dev** provides a drag‑and‑drop interface to rapidly prototype and iterate.
* Responsive layouts with dashboards, habit logs, and journaling flows.
* Data connected in real‑time to Supabase tables for habits, entries, and summaries.
* Weekly & monthly analytics powered by Supabase queries and GPT summarization.

---

## 🚀 Roadmap

* [x] Build frontend in Lovable.dev and connect to Supabase
* [x] GPT‑powered journaling & habit insights
* [ ] Social sharing & accountability groups
* [ ] Additional modules (nutrition, workouts, sleep tracking)
* [ ] Wearable integration (Apple Health / Fitbit)

---

## 🛠️ Setup & Installation

> **Prerequisites:** A Lovable.dev project and a Supabase project set up with appropriate tables and APIs.

1. **Clone the repository (export from Lovable.dev)**

   ```bash
   git clone https://github.com/yourusername/ThriveGPT.git
   cd ThriveGPT
   ```

2. **Install dependencies (if you plan to run locally)**

   ```bash
   npm install
   ```

3. **Connect to Supabase**

   * Create a Supabase project and note your URL and Anon/Public API key.
   * Set environment variables in a `.env` file:

     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     OPENAI_API_KEY=your_openai_api_key
     ```

4. **Run locally (if exported from Lovable.dev)**

   ```bash
   npm run dev
   ```

5. **Deploy**

   * Use Lovable.dev’s built‑in hosting or export and deploy to Vercel/Netlify.

---

## 📂 Project Structure

*(Lovable.dev exports a React-based project)*

```
ThriveGPT/
│
├── components/        # UI components
├── pages/             # App pages/screens
├── lib/               # Supabase client and helpers
├── hooks/             # Custom hooks (e.g. data fetching)
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome!
If you’d like to propose a feature or fix a bug:

1. Fork the repo
2. Create a new branch
3. Submit a pull request with a clear description

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## ✉️ Contact

**Maintainer:** Kyle Scheetz
📧 Email: kyle.scheetz@gmail.com(mailto:kyle.scheetz@gmail.com)
