# MediTrack – Smart Medicine Reminder

**MediTrack** is a modern, responsive, and accessible healthcare web application designed to help individuals, particularly elderly users, easily organize, manage, and track their daily medication schedules.

---

## 🔐 Demonstration Authentication System

MediTrack includes a demonstration authentication workflow:

### 1. Login Page (`login.html`)
- **Brand Header**: MediTrack healthcare logo, title, and accessible subtitle.
- **Elderly-Friendly Form**: Large readable labels (`1.05rem`), high-contrast 52px tall inputs, and a 54px primary action button.
- **Show/Hide Password**: Tactile eye button to toggle password visibility.
- **Remember Me**: Persists the user's email address in LocalStorage for subsequent visits.
- **One-Click Demo Fill**: Dedicated button to instantly populate demonstration credentials (`robert.davis@example.com` / `Password123!`).
- **Validation**: Full client-side format checks and alert banners.
- **Navigation**: Clean link to the Registration page.

### 2. Registration Page (`register.html`)
- **User Information**: Full name, email address, optional age, password, and password confirmation.
- **Password Strength Indicator**: Real-time visual feedback meter (Weak / Medium / Strong).
- **Duplicate Prevention**: Prevents duplicate email accounts.
- **Auto-Login**: Automatically establishes session upon successful registration and redirects to the dashboard with a welcome greeting.
- **Navigation**: Clean link to the Login page.

### 3. Session & Route Guards (`auth.js`)
- **Protected Dashboard**: If an unauthenticated user accesses `index.html`, they are automatically redirected to `login.html`.
- **Signed-in Redirect**: If an authenticated user accesses `login.html` or `register.html`, they are redirected directly to `index.html`.
- **Logout Support**: Available in the desktop sidebar footer, the top header, and the Settings page. Safely clears session and redirects to `login.html?logout=true`.
- **Personalized Header & Profile Widget**: Synchronizes the user's name and email with the dashboard greeting banner and sidebar avatar widget.

> ### 🎓 College Demonstration Security Notice
> This project demonstrates client-side authentication using the browser's native **Web Crypto API (`crypto.subtle.digest('SHA-256')`)** and browser **LocalStorage**. Passwords are never stored in plain text.
>
> **Limitations**: LocalStorage is accessible to client scripts and does not provide production-grade security. In real-world clinical and commercial healthcare environments, authentication must be executed on a protected server using salted hashing algorithms (such as Argon2id or bcrypt), multi-factor authentication (MFA/2FA), and secure, HTTP-only, encrypted session cookies.

---

## 🌟 Application Features

### 1. Healthcare Dashboard (`index.html#dashboard`)
- **Personalized Greeting**: Dynamic greeting based on the time of day and the logged-in user's name (*"Good morning, Robert!"*).
- **Live Header**: Live-updating clock and formatted date.
- **Summary Stat Cards**: Total active medicines, today's scheduled doses, doses completed, and missed doses.
- **Daily Adherence Progress**: Real-time progress bar tracking today's completion percentage with encouraging messages.
- **Upcoming Medication Reminders**: Immediate overview of upcoming scheduled doses with quick **Taken** and **Skip** buttons.

### 2. Medicine Management (`index.html#medicines`)
- **Add & Edit Medicines**:
  - Name, dosage (*500 mg*, *1 tablet*, *10 ml*)
  - Medicine type with distinctive icons (Tablet, Capsule, Syrup, Drops, Injection, Inhaler, Ointment, Other)
  - Frequency (Once daily, Twice daily, 3 times daily, 4 times daily, Every other day, As needed)
  - Dynamic time pickers supporting multiple daily medication times
  - Doctor instructions (*With meal*, *Before meal*, *After meal*, *Empty stomach*, *Bedtime*, *As directed*)
  - Prescription duration (Start date & optional End date for ongoing medicines)
  - Color-coded category tags (Blue, Teal, Amber, Purple, Rose, Cyan)
  - Purpose & doctor's notes
- **Search & Filter**: Real-time search by name, dosage, or notes, plus filter by medicine form/type.
- **Safe Deletion**: Deletion confirmation modal preventing accidental removal.

### 3. Smart Medicine Reminders (`index.html#reminders`)
- **Real-Time Scheduler**: Periodic background ticker checking every 10 seconds.
- **Web Audio API Chime**: Pleasant healthcare chime synthesized without external audio files.
- **Interactive Alert Dialog**: Large, accessible modal popup with **✓ Taken**, **Snooze (5m)**, and **Skip** buttons.
- **Browser Notifications**: Supports HTML5 Notification API for desktop alerts.
- **Duplicate Prevention**: Protects against multiple logs for the same scheduled dose.
- **Test Alert Button**: Allows immediate testing of the alarm sound, notification, and alert modal.

### 4. Daily Dose Tracker & History (`index.html#tracker`)
- **Segmented Schedule**: Filter today's medications by period (*All*, *Morning*, *Afternoon*, *Evening*, *Night*).
- **One-Click Dose Actions**: Large touch-friendly buttons to mark doses as **Taken**, **Missed**, or **Skipped** with undo capability.
- **Dose History Logs**: Filterable by timeframe, status, and medicine, with recorded action timestamps.
- **Manual Dose Logger**: Modal to add past or unscheduled doses.

### 5. Reports & Analytics (`index.html#reports`)
- **Visual Adherence Charts**: 7-Day Adherence Trend bar chart and Dose Distribution doughnut chart via **Chart.js** (with offline SVG fallbacks).
- **Compliance Metrics**: Overall adherence percentage, consecutive streak counter (*🔥 6 Days*), total taken, and total missed.
- **Doctor's Summary Report**: Generates a clean, formatted print-ready clinical report.

### 6. Accessibility & Settings (`index.html#settings`)
- **Font Size Switcher**: Standard, Large (+15%), Extra Large (+30%).
- **High Contrast Mode**: Deep blacks and bold borders for visually impaired users.
- **Time Format**: 12-hour (AM/PM) vs. 24-hour medical time.
- **Data Management**: JSON Export and Import capabilities + Reset to sample data.

---

## 📁 Project Structure

```
MediTrack/
│
├── index.html          # Main application dashboard, views & accessible modals
├── login.html          # Accessible healthcare login page with demo auto-fill
├── register.html       # Account registration page with password strength meter
├── auth.js             # Web Crypto SHA-256 hashing, session management & route guards
├── style.css           # Healthcare UI, auth cards, accessibility styles & responsive layout
├── script.js           # Full client logic: Sound, Storage, Reminders, Tracker, Reports, UI
│
├── assets/
│   ├── images/         # Application logos and healthcare illustrations
│   └── icons/          # Vector icons for medicine types, alerts, and navigation
│
└── README.md           # Documentation & educational disclosures
```

---

## 🚀 How to Run the Application

1. Open **[login.html](file:///d:/Meditrack/login.html)** in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Click **"Fill Demo"** and **"Log In to Dashboard"** (or create a new account via **[register.html](file:///d:/Meditrack/register.html)**).
3. Once logged in, you will be taken to your personalized dashboard with pre-loaded demonstration medicines, today's schedule, and past adherence history!
