# MediTrack – Smart Medicine Reminder (Healthcare SaaS Redesign)

**MediTrack** is a modern, responsive, and accessible healthcare SaaS web application designed to help individuals, particularly elderly users, easily organize, manage, and track their daily medication schedules with confidence and clarity.

---

## 🎨 Premium Healthcare SaaS Visual Identity

MediTrack features a clean, high-trust healthcare SaaS design system:

| Role | Color Hex | Preview / Purpose |
| :--- | :--- | :--- |
| **Primary Brand** | `#2563EB` | Royal Blue for primary CTA buttons, active navigation, and key branding |
| **Dark Navy** | `#142B4A` | High-contrast headers, sidebar backgrounds, and hero banners |
| **Light Blue** | `#EFF6FF` | Accent backgrounds, badge tags, and pill containers |
| **Canvas Background** | `#F7FAFF` | Soft, glare-free background for comfortable reading |
| **Completed / Taken** | `#10B981` | Emerald Green for completed doses, high adherence ratings |
| **Upcoming / Alert** | `#F59E0B` | Warm Amber for upcoming reminders and pending doses |
| **Missed / Urgent** | `#EF4444` | Crimson Red for missed doses, critical warnings, and deletions |

---

## 🖼️ Custom Vector Assets & Graphics

All illustrations and icons are custom-crafted vector SVGs stored directly in the repository with **zero external image dependencies**:

- **[assets/images/logo.svg](file:///d:/Meditrack/assets/images/logo.svg)**: Medical cross + pill emblem with glowing blue gradient and active green pulse dot.
- **[assets/images/healthcare-hero.svg](file:///d:/Meditrack/assets/images/healthcare-hero.svg)**: 520x360 SaaS illustration featuring caregiver, patient, interactive digital schedule tablet, and adherence progress tracker.
- **[assets/images/medicine-illustration.svg](file:///d:/Meditrack/assets/images/medicine-illustration.svg)**: 460x380 blister packs, prescription bottle, digital alarm timer, and daily checklist.
- **[assets/images/empty-state.svg](file:///d:/Meditrack/assets/images/empty-state.svg)**: Friendly medicine organizer and pill bottle for clear empty states.
- **[assets/images/medication-reminder.svg](file:///d:/Meditrack/assets/images/medication-reminder.svg)**: Glowing alarm bell, digital clock badge, and pill capsule for the reminders view.
- **[assets/icons/](file:///d:/Meditrack/assets/icons/)**: 13 standalone SVG icons for medicine types (tablets, capsules, syrups, drops) and navigation views.

---

## 🔐 Demonstration Authentication System

MediTrack provides a demonstration authentication workflow with client-side multi-user isolation:

### 1. Login Page (`login.html`)
- **Two-Column SaaS Layout**: Left showcase pane featuring `assets/images/medicine-illustration.svg` and key benefits; right pane containing the accessible form.
- **Elderly-Friendly Form**: Large readable labels, high-contrast 52px tall inputs, and 52px primary action buttons.
- **Show/Hide Password**: Tactile eye button to toggle password visibility.
- **Remember Me**: Persists the user's email address in LocalStorage for subsequent visits.
- **One-Click Demo Fill & Quick Login**: Dedicated buttons to instantly populate credentials (`robert.davis@example.com` / `Password123!`) or log in with one click.
- **Validation**: Full client-side format checks and alert banners.

### 2. Registration Page (`register.html`)
- **Two-Column SaaS Layout**: Left showcase pane featuring `assets/images/healthcare-hero.svg`; right pane containing the account creation form.
- **User Information**: Full name, email address, optional age, password, and password confirmation.
- **Password Strength Indicator**: Real-time visual feedback meter (Weak / Medium / Strong).
- **Duplicate Prevention**: Prevents duplicate email accounts.
- **Auto-Login**: Automatically establishes session upon successful registration and redirects to the dashboard.

### 3. Session & Route Guards (`auth.js`)
- **Protected Dashboard**: If an unauthenticated user accesses `index.html`, they are automatically redirected to `login.html`.
- **Signed-in Redirect**: If an authenticated user accesses `login.html` or `register.html`, they are redirected directly to `index.html`.
- **Multi-Tenant User Isolation**: LocalStorage keys are isolated per user (`meditrack_<userId>_medicines`, `meditrack_<userId>_dose_history`, `meditrack_<userId>_settings`).
- **Logout Support**: Available in the desktop sidebar footer, the top header, and the Settings page. Safely clears session and redirects to `login.html?logout=true`.

> ### 🎓 College Demonstration Security Notice
> This project demonstrates client-side authentication using the browser's native **Web Crypto API (`crypto.subtle.digest('SHA-256')`)** and browser **LocalStorage**. Passwords are never stored in plain text.
>
> **Limitations**: LocalStorage is accessible to client scripts and does not provide production-grade security. In real-world clinical and commercial healthcare environments, authentication must be executed on a protected server using salted hashing algorithms (such as Argon2id or bcrypt), multi-factor authentication (MFA/2FA), and secure, HTTP-only, encrypted session cookies.

---

## 🌟 Application Features

### 1. Healthcare Dashboard (`index.html#dashboard`)
- **Personalized Greeting**: Dynamic greeting based on the time of day and the logged-in user's name (*"Good morning, Robert!"*) with `healthcare-hero.svg` banner.
- **Live Header**: Live-updating clock with pulse dot and formatted date.
- **Summary Stat Cards**: Total active medicines, today's scheduled doses, doses completed, and missed doses.
- **Daily Adherence Progress**: Real-time progress bar and circular ring tracking today's completion percentage.
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
- **Next Scheduled Dose Spotlight**: Prominent header card highlighting the next pending medication with countdown badge, `medication-reminder.svg` artwork, and quick **Taken** / **Skip** actions.
- **Real-Time Scheduler**: Periodic background ticker checking every 10 seconds.
- **Web Audio API Chime**: Pleasant healthcare chime synthesized without external audio files.
- **Interactive Alert Dialog**: Large, accessible modal popup with **✓ Taken**, **Snooze (5m)**, and **Skip** buttons.
- **Browser Notifications**: Supports HTML5 Notification API for desktop alerts.
- **Test Alert Button**: Allows immediate testing of the alarm sound, notification, and alert modal.

### 4. Daily Dose Tracker & History (`index.html#tracker`)
- **Segmented Schedule**: Filter today's medications by period (*All*, *Morning*, *Afternoon*, *Evening*, *Night*).
- **One-Click Dose Actions**: Large touch-friendly buttons to mark doses as **Taken**, **Missed**, or **Skipped** with undo capability.
- **Dose History Logs**: Filterable by timeframe, status, and medicine, with recorded action timestamps.
- **Manual Dose Logger**: Modal to add past or unscheduled doses.

### 5. Reports & Analytics (`index.html#reports`)
- **Visual Adherence Charts**: 7-Day Adherence Trend bar chart and Dose Distribution doughnut chart via **Chart.js** (with zero-dose graceful fallback).
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
├── index.html              # Main SaaS application dashboard, views & accessible modals
├── login.html              # Two-column healthcare SaaS login page with demo auto-fill
├── register.html           # Two-column account registration page with strength meter
├── auth.js                 # Web Crypto SHA-256 hashing, session management & route guards
├── style.css               # SaaS color system, card elevation, accessibility & responsive grid
├── script.js               # Unified client logic: Audio, Storage, Reminders, Tracker, Reports, UI
├── verify_redesign.py      # Automated verification script checking assets, IDs, palette, and JS
│
├── assets/
│   ├── images/
│   │   ├── logo.svg                 # Brand medical cross & pill emblem
│   │   ├── healthcare-hero.svg      # Healthcare hero illustration
│   │   ├── medicine-illustration.svg# Medicine scheduling illustration
│   │   ├── empty-state.svg          # Friendly empty state graphic
│   │   └── medication-reminder.svg  # Smart medication reminder graphic
│   └── icons/                       # 13 standalone SVG medical & navigation icons
│
└── README.md               # Documentation & project guide
```

---

## 🚀 How to Run the Application

1. Open **[login.html](file:///d:/Meditrack/login.html)** in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).
2. Click **"Quick Login →"** to immediately sign in as the pre-configured demonstration patient (*Robert Davis*), or create a new account via **[register.html](file:///d:/Meditrack/register.html)**.
3. Once logged in, navigate the dashboard:
   - **[Dashboard](file:///d:/Meditrack/index.html#dashboard)**: Check your daily adherence ring and upcoming doses.
   - **[Medicines](file:///d:/Meditrack/index.html#medicines)**: Add, edit, or filter medications.
   - **[Dose Tracker](file:///d:/Meditrack/index.html#tracker)**: Log taken, missed, or skipped doses.
   - **[Reminders](file:///d:/Meditrack/index.html#reminders)**: View the Next Dose spotlight and test live chimes.
   - **[Reports](file:///d:/Meditrack/index.html#reports)**: Review adherence trends or print a doctor's report.
