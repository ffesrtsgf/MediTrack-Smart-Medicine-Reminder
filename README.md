<<<<<<< HEAD
# MediTrack – Smart Medicine Reminder

**MediTrack** is a modern, responsive, and accessible healthcare web application designed to help individuals, particularly elderly users, easily organize, manage, and track their daily medication schedules.

---

## 🌟 Key Features

### 1. Healthcare Dashboard
- **Personalized Welcome Banner**: Greets the user based on the time of day and displays today's date.
- **Summary Stat Cards**:
  - Total active medicines count
  - Today's scheduled doses
  - Completed doses count
  - Missed doses count
- **Daily Adherence Progress**: Real-time visual progress bar tracking today's completion percentage with encouraging status messages.
- **Upcoming Medication Reminders**: Immediate overview of upcoming scheduled doses with quick **Taken** and **Skip** actions.

### 2. Comprehensive Medicine Management
- **Add & Edit Medicines**:
  - Medicine name and dosage (e.g., *500 mg*, *1 tablet*, *10 ml*)
  - Medicine type with distinctive icons (Tablet, Capsule, Syrup, Drops, Injection, Inhaler, Ointment, Other)
  - Frequency (Once daily, Twice daily, 3 times daily, 4 times daily, Every other day, As needed)
  - Dynamic time pickers supporting multiple daily scheduled times
  - Special doctor instructions (*With meal*, *Before meal*, *After meal*, *Empty stomach*, *Bedtime*, *As directed*)
  - Prescription duration (Start date & optional End date for ongoing medicines)
  - Color-coded category tags (Blue, Teal, Amber, Purple, Rose, Cyan)
  - Purpose & doctor's notes
- **Search & Filter**: Real-time search by name, dosage, or notes, plus filter by medicine form/type.
- **Safe Deletion**: Deletion confirmation modal preventing accidental removal.

### 3. Smart Medicine Reminders
- **Real-Time Scheduler**: Checks schedule every 10 seconds.
- **Audio Chimes**: Pleasant two-tone healthcare chime generated dynamically via Web Audio API (no external audio files required).
- **Interactive Alert Dialog**: Large, accessible modal popup with **✓ Taken**, **Snooze (5m)**, and **Skip** buttons.
- **Browser Notifications**: Supports HTML5 Notification API for desktop alerts even when browsing other tabs.
- **Duplicate Prevention**: Protects against multiple logs for the same scheduled dose.
- **Test Alert Button**: Allows immediate testing of the alarm sound, notification, and alert modal.

### 4. Daily Dose Tracker & History
- **Segmented Schedule**: Filter today's medications by time of day:
  - *All Scheduled Doses*
  - *Morning (6 AM - 12 PM)*
  - *Afternoon (12 PM - 5 PM)*
  - *Evening (5 PM - 9 PM)*
  - *Night (9 PM - 6 AM)*
- **One-Click Dose Actions**: Large touch-friendly buttons to mark doses as **Taken**, **Missed**, or **Skipped** with undo capability.
- **Dose History Logs**:
  - Filterable by timeframe (*Today*, *Past 7 Days*, *Past 30 Days*, *All*), status, and specific medicine.
  - Displays exact recorded action timestamps.
  - Manual dose logger for adding past or unscheduled doses.

### 5. Reports & Analytics
- **Visual Adherence Charts**:
  - 7-Day Adherence Trend bar chart using **Chart.js** (with offline SVG fallback).
  - Dose Distribution doughnut chart (*Taken* vs *Missed* vs *Skipped* vs *Pending*).
- **Compliance Metrics**:
  - Overall adherence percentage
  - Consecutive adherence streak counter (e.g. *🔥 6 Days*)
  - Total taken and missed counts
- **Per-Medicine Compliance Table**: Individual adherence percentages for each prescription.
- **Doctor's Summary Report**: Generates a clean, formatted print-ready medical report for doctor visits.

### 6. Accessibility & Elderly-Friendly Design
- **Color Palette**: Clean white and light-blue healthcare dashboard with high WCAG contrast ratios.
- **Font Size Switcher**:
  - Standard
  - Large (+15%)
  - Extra Large (+30%)
- **High Contrast Mode**: Toggle for deep blacks, sharp borders, and heightened contrast.
- **Large Touch Targets**: All interactive buttons are at least 44px–52px tall.
- **Responsive Layout**: Desktop sidebar navigation with sticky live header + sticky mobile bottom navigation.
- **Time Format**: Toggle between 12-hour (AM/PM) and 24-hour time.
- **Data Portability**: Full JSON Export and Import capabilities + Reset to realistic sample data.

---

## 📁 Project Structure

```
MediTrack/
│
├── index.html          # Semantic HTML5 single-page application structure & accessible modals
├── style.css           # Clean healthcare UI, accessibility styles, and responsive CSS
├── script.js           # Full client logic: Sound, Storage, Reminders, Tracker, Reports, UI
│
├── assets/
│   ├── images/         # Application logos and healthcare illustrations
│   └── icons/          # Vector icons for medicine types, alerts, and navigation
│
└── README.md           # Documentation & usage instructions
```

---

## 🚀 How to Run the Application

Because **MediTrack** is built with pure HTML5, CSS3, and JavaScript:
1. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. Or serve it via any static local HTTP server (e.g. `python -m http.server 8000`).
3. The application will initialize with realistic demonstration medications and past adherence history ready to explore immediately!
=======
# MediTrack-Smart-Medicine-Reminder
Web app made for Hack2Skill Promptwars
>>>>>>> 507d869a3fe13f3e37a027a2c181ce3ef82fad79
