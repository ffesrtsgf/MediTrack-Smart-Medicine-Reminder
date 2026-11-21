/**
 * MediTrack – Smart Medicine Reminder
 * Unified Client Application Script
 */

/* ==========================================================================
   MODULE: js/sound.js
   ========================================================================== */

/**
 * MediTrack - Web Audio API Sound Generator
 * Generates clear, pleasant healthcare chimes and notification sounds without external audio files.
 */

const SoundManager = (() => {
  let audioCtx = null;
  let isUnlocked = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Ensure audio context is ready on first user interaction
  function unlockAudio() {
    if (isUnlocked) return;
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          isUnlocked = true;
        });
      } else {
        isUnlocked = true;
      }
    }
  }

  // Check if sound is enabled in user settings
  function isSoundEnabled() {
    try {
      const settings = JSON.parse(localStorage.getItem('meditrack_settings') || '{}');
      return settings.soundEnabled !== false;
    } catch {
      return true;
    }
  }

  // Play a soft, pleasant two-tone medical chime for reminders
  function playReminderChime() {
    if (!isSoundEnabled()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Note 1: E5 (659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Note 2: B5 (987.77Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.15);
      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.9);

      // Note 3: E6 (1318.51Hz) - high bright pleasant chime
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1318.51, now + 0.32);
      gain3.gain.setValueAtTime(0, now + 0.32);
      gain3.gain.linearRampToValueAtTime(0.25, now + 0.37);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.32);
      osc3.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play a rewarding positive chime when dose is taken
  function playSuccessChime() {
    if (!isSoundEnabled()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Arpeggio: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + index * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play soft subtle button feedback
  function playClick() {
    if (!isSoundEnabled()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Ignore click sound error
    }
  }

  // Play alert chime for missed dose warning
  function playWarningChime() {
    if (!isSoundEnabled()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [440, 370].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.15;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Attach event listeners for audio unlock on first user gesture
  ['click', 'touchstart', 'keydown'].forEach(eventName => {
    window.addEventListener(eventName, unlockAudio, { once: true, passive: true });
  });

  return {
    playReminderChime,
    playSuccessChime,
    playWarningChime,
    playClick,
    unlockAudio,
    isSoundEnabled
  };
})();

window.SoundManager = SoundManager;


/* ==========================================================================
   MODULE: js/storage.js
   ========================================================================== */

/**
 * MediTrack - LocalStorage and Data Management Module
 * Handles persistence, sample data generation, CRUD operations for medicines and doses.
 */

const StorageManager = (() => {
  const KEYS = {
    MEDICINES: 'meditrack_medicines',
    DOSES: 'meditrack_doses',
    SETTINGS: 'meditrack_settings',
    LAST_INITIALIZED: 'meditrack_initialized'
  };

  // Helper to get formatted date string "YYYY-MM-DD" for any Date object
  function formatDateString(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get today's date string
  function getTodayString() {
    return formatDateString(new Date());
  }

  // Generate realistic sample medicines
  function getDefaultMedicines() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const ninetyDaysAhead = new Date();
    ninetyDaysAhead.setDate(today.getDate() + 90);

    const startStr = formatDateString(thirtyDaysAgo);
    const endStr = formatDateString(ninetyDaysAhead);

    return [
      {
        id: 'med_1',
        name: 'Metformin',
        dosage: '500 mg',
        type: 'tablet',
        frequency: 'twice_daily',
        times: ['08:00', '20:00'],
        startDate: startStr,
        endDate: endStr,
        instructions: 'after_meal',
        specialNotes: 'Take with breakfast and dinner for blood sugar regulation.',
        color: 'blue',
        active: true,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'med_2',
        name: 'Lisinopril',
        dosage: '10 mg',
        type: 'tablet',
        frequency: 'once_daily',
        times: ['08:00'],
        startDate: startStr,
        endDate: '',
        instructions: 'before_meal',
        specialNotes: 'Blood pressure medicine. Drink a full glass of water.',
        color: 'teal',
        active: true,
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
      },
      {
        id: 'med_3',
        name: 'Vitamin D3 & Calcium',
        dosage: '1000 IU',
        type: 'capsule',
        frequency: 'once_daily',
        times: ['13:00'],
        startDate: startStr,
        endDate: '',
        instructions: 'with_meal',
        specialNotes: 'Take after lunch for optimal bone health and calcium absorption.',
        color: 'amber',
        active: true,
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
      },
      {
        id: 'med_4',
        name: 'Eye Lubricant Drops',
        dosage: '2 drops',
        type: 'drops',
        frequency: 'twice_daily',
        times: ['09:00', '18:00'],
        startDate: startStr,
        endDate: '',
        instructions: 'as_directed',
        specialNotes: 'Moisturizing drops for dry eyes. Blink gently after applying.',
        color: 'cyan',
        active: true,
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
      },
      {
        id: 'med_5',
        name: 'Atorvastatin (Lipitor)',
        dosage: '20 mg',
        type: 'tablet',
        frequency: 'once_daily',
        times: ['21:00'],
        startDate: startStr,
        endDate: '',
        instructions: 'bedtime',
        specialNotes: 'Cholesterol control. Best taken at bedtime.',
        color: 'purple',
        active: true,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
      }
    ];
  }

  // Generate realistic past 7 days dose history + today's initial doses
  function getDefaultDoseHistory(medicines) {
    const doses = [];
    const today = new Date();
    const currentHour = today.getHours();

    // Generate past 6 days history
    for (let i = 6; i >= 1; i--) {
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - i);
      const dateStr = formatDateString(pastDate);

      medicines.forEach(med => {
        med.times.forEach(time => {
          // Most doses taken, occasional missed for realistic analytics
          let status = 'taken';
          if (i === 3 && med.id === 'med_4' && time === '18:00') {
            status = 'missed';
          } else if (i === 5 && med.id === 'med_1' && time === '20:00') {
            status = 'skipped';
          }

          const [h, m] = time.split(':');
          const actionDate = new Date(pastDate);
          actionDate.setHours(parseInt(h, 10), parseInt(m, 10) + Math.floor(Math.random() * 15), 0, 0);

          doses.push({
            id: `dose_${med.id}_${dateStr}_${time.replace(':', '')}`,
            medicineId: med.id,
            medicineName: med.name,
            dosage: med.dosage,
            type: med.type,
            color: med.color,
            scheduledDate: dateStr,
            scheduledTime: time,
            status: status,
            actionTime: status === 'taken' ? actionDate.toISOString() : null,
            notes: status === 'skipped' ? 'Doctor advised temporary pause' : ''
          });
        });
      });
    }

    // Generate today's doses
    const todayStr = formatDateString(today);
    medicines.forEach(med => {
      med.times.forEach(time => {
        const [h, m] = time.split(':').map(Number);
        const scheduledMinutes = h * 60 + m;
        const currentMinutes = currentHour * 60 + today.getMinutes();

        let status = 'pending';
        let actionTime = null;

        // Morning doses already taken if current time is past morning
        if (scheduledMinutes + 30 <= currentMinutes) {
          status = 'taken';
          const actDate = new Date(today);
          actDate.setHours(h, m + 8, 0, 0);
          actionTime = actDate.toISOString();
        } else if (scheduledMinutes < currentMinutes - 60) {
          status = 'missed';
        }

        doses.push({
          id: `dose_${med.id}_${todayStr}_${time.replace(':', '')}`,
          medicineId: med.id,
          medicineName: med.name,
          dosage: med.dosage,
          type: med.type,
          color: med.color,
          scheduledDate: todayStr,
          scheduledTime: time,
          status: status,
          actionTime: actionTime,
          notes: ''
        });
      });
    });

    return doses;
  }

  // Default User Settings
  function getDefaultSettings() {
    return {
      userName: 'Robert Davis',
      userAge: 68,
      doctorName: 'Dr. Sarah Jenkins',
      doctorPhone: '+1 (555) 234-5678',
      emergencyContact: 'Emily Davis (Daughter) - (555) 876-5432',
      timeFormat: '12h',
      soundEnabled: true,
      soundVolume: 0.8,
      notificationsEnabled: true,
      reminderLeadMinutes: 0,
      fontSize: 'normal',
      highContrast: false
    };
  }

  // Initialize storage if first time or missing
  function initializeStorage(forceReset = false) {
    if (forceReset || !localStorage.getItem(KEYS.LAST_INITIALIZED) || !localStorage.getItem(KEYS.MEDICINES)) {
      const defaultMeds = getDefaultMedicines();
      const defaultDoses = getDefaultDoseHistory(defaultMeds);
      const defaultSettings = getDefaultSettings();

      localStorage.setItem(KEYS.MEDICINES, JSON.stringify(defaultMeds));
      localStorage.setItem(KEYS.DOSES, JSON.stringify(defaultDoses));
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
      localStorage.setItem(KEYS.LAST_INITIALIZED, new Date().toISOString());

      return { medicines: defaultMeds, doses: defaultDoses, settings: defaultSettings };
    }

    // Ensure today's doses exist for all active medicines
    ensureTodayDoses();

    return {
      medicines: getMedicines(),
      doses: getDoses(),
      settings: getSettings()
    };
  }

  // Ensure today's schedule records exist for active medicines
  function ensureTodayDoses() {
    const medicines = getMedicines().filter(m => m.active);
    const doses = getDoses();
    const todayStr = getTodayString();
    let updated = false;

    medicines.forEach(med => {
      // Check start/end dates
      if (med.startDate && med.startDate > todayStr) return;
      if (med.endDate && med.endDate < todayStr) return;

      med.times.forEach(time => {
        const doseId = `dose_${med.id}_${todayStr}_${time.replace(':', '')}`;
        const exists = doses.some(d => d.id === doseId || (d.medicineId === med.id && d.scheduledDate === todayStr && d.scheduledTime === time));
        
        if (!exists) {
          doses.push({
            id: doseId,
            medicineId: med.id,
            medicineName: med.name,
            dosage: med.dosage,
            type: med.type,
            color: med.color || 'blue',
            scheduledDate: todayStr,
            scheduledTime: time,
            status: 'pending',
            actionTime: null,
            notes: ''
          });
          updated = true;
        }
      });
    });

    if (updated) {
      saveDoses(doses);
    }
  }

  // Medicine CRUD
  function getMedicines() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.MEDICINES) || '[]');
    } catch {
      return [];
    }
  }

  function saveMedicines(medicines) {
    localStorage.setItem(KEYS.MEDICINES, JSON.stringify(medicines));
    ensureTodayDoses();
    dispatchStorageEvent('medicines_updated');
  }

  function addMedicine(medData) {
    const medicines = getMedicines();
    const newMed = {
      id: 'med_' + Date.now(),
      name: medData.name.trim(),
      dosage: medData.dosage.trim(),
      type: medData.type || 'tablet',
      frequency: medData.frequency || 'once_daily',
      times: Array.isArray(medData.times) && medData.times.length > 0 ? medData.times.sort() : ['08:00'],
      startDate: medData.startDate || getTodayString(),
      endDate: medData.endDate || '',
      instructions: medData.instructions || 'with_meal',
      specialNotes: medData.specialNotes ? medData.specialNotes.trim() : '',
      color: medData.color || 'blue',
      active: true,
      createdAt: new Date().toISOString()
    };

    medicines.push(newMed);
    saveMedicines(medicines);
    return newMed;
  }

  function updateMedicine(id, updatedFields) {
    const medicines = getMedicines();
    const index = medicines.findIndex(m => m.id === id);
    if (index === -1) return null;

    medicines[index] = {
      ...medicines[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    saveMedicines(medicines);

    // Also update today's pending doses if medicine details changed
    const doses = getDoses();
    let dosesChanged = false;
    const todayStr = getTodayString();

    doses.forEach(dose => {
      if (dose.medicineId === id && dose.scheduledDate === todayStr && dose.status === 'pending') {
        dose.medicineName = medicines[index].name;
        dose.dosage = medicines[index].dosage;
        dose.type = medicines[index].type;
        dose.color = medicines[index].color;
        dosesChanged = true;
      }
    });

    if (dosesChanged) {
      saveDoses(doses);
    }

    return medicines[index];
  }

  function deleteMedicine(id) {
    const medicines = getMedicines().filter(m => m.id !== id);
    saveMedicines(medicines);

    // Also remove today's pending doses for this medicine
    const todayStr = getTodayString();
    const doses = getDoses().filter(d => !(d.medicineId === id && d.scheduledDate === todayStr && d.status === 'pending'));
    saveDoses(doses);

    return true;
  }

  // Dose CRUD & History
  function getDoses() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.DOSES) || '[]');
    } catch {
      return [];
    }
  }

  function saveDoses(doses) {
    localStorage.setItem(KEYS.DOSES, JSON.stringify(doses));
    dispatchStorageEvent('doses_updated');
  }

  function getTodayDoses() {
    ensureTodayDoses();
    const todayStr = getTodayString();
    return getDoses().filter(d => d.scheduledDate === todayStr);
  }

  function recordDoseStatus(doseId, newStatus, optionalNotes = '') {
    const doses = getDoses();
    const doseIndex = doses.findIndex(d => d.id === doseId);

    if (doseIndex !== -1) {
      doses[doseIndex].status = newStatus;
      doses[doseIndex].actionTime = newStatus === 'pending' ? null : new Date().toISOString();
      if (optionalNotes) {
        doses[doseIndex].notes = optionalNotes;
      }
      saveDoses(doses);
      return doses[doseIndex];
    } else {
      // If dose wasn't found by ID, prevent duplicate by checking medicineId + scheduledDate + time
      return null;
    }
  }

  // Log dose by medicineId and time (used by Smart Reminder popup)
  function recordDoseByMedAndTime(medicineId, scheduledTime, status, notes = '') {
    const todayStr = getTodayString();
    const doses = getDoses();
    const existing = doses.find(d => d.medicineId === medicineId && d.scheduledDate === todayStr && d.scheduledTime === scheduledTime);

    if (existing) {
      existing.status = status;
      existing.actionTime = status === 'pending' ? null : new Date().toISOString();
      if (notes) existing.notes = notes;
      saveDoses(doses);
      return existing;
    } else {
      const med = getMedicines().find(m => m.id === medicineId);
      const newDose = {
        id: `dose_${medicineId}_${todayStr}_${scheduledTime.replace(':', '')}`,
        medicineId: medicineId,
        medicineName: med ? med.name : 'Medicine',
        dosage: med ? med.dosage : '',
        type: med ? med.type : 'tablet',
        color: med ? med.color : 'blue',
        scheduledDate: todayStr,
        scheduledTime: scheduledTime,
        status: status,
        actionTime: new Date().toISOString(),
        notes: notes
      };
      doses.push(newDose);
      saveDoses(doses);
      return newDose;
    }
  }

  // Settings
  function getSettings() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
      return { ...getDefaultSettings(), ...parsed };
    } catch {
      return getDefaultSettings();
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    dispatchStorageEvent('settings_updated');
  }

  // Export all application data as JSON
  function exportData() {
    const data = {
      app: 'MediTrack',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      medicines: getMedicines(),
      doses: getDoses(),
      settings: getSettings()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import JSON data with validation
  function importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.medicines)) {
        throw new Error('Invalid format: Missing medicines data.');
      }
      localStorage.setItem(KEYS.MEDICINES, JSON.stringify(parsed.medicines));
      if (Array.isArray(parsed.doses)) {
        localStorage.setItem(KEYS.DOSES, JSON.stringify(parsed.doses));
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(parsed.settings));
      }
      ensureTodayDoses();
      dispatchStorageEvent('all_updated');
      return { success: true, count: parsed.medicines.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Clear all data
  function clearAllData() {
    localStorage.removeItem(KEYS.MEDICINES);
    localStorage.removeItem(KEYS.DOSES);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.LAST_INITIALIZED);
    dispatchStorageEvent('all_updated');
  }

  // Custom Event Dispatcher
  function dispatchStorageEvent(type) {
    window.dispatchEvent(new CustomEvent('meditrack_data_changed', { detail: { type } }));
  }

  return {
    initializeStorage,
    getMedicines,
    saveMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getDoses,
    saveDoses,
    getTodayDoses,
    recordDoseStatus,
    recordDoseByMedAndTime,
    getSettings,
    saveSettings,
    exportData,
    importData,
    clearAllData,
    formatDateString,
    getTodayString
  };
})();

window.StorageManager = StorageManager;


/* ==========================================================================
   MODULE: js/reminders.js
   ========================================================================== */

/**
 * MediTrack - Smart Medicine Reminders Engine
 * Monitors scheduled doses, triggers audio/visual/system alerts, manages snoozing, and prevents duplicates.
 */

const ReminderEngine = (() => {
  let tickerInterval = null;
  const triggeredToday = new Set(); // Stores strings: `${date}_${medicineId}_${time}`
  const snoozedReminders = new Map(); // key: doseKey, value: triggerTimestamp

  function init() {
    // Request notification permission if enabled in settings
    requestNotificationPermission();

    // Start background check every 10 seconds
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(checkReminders, 10000);

    // Initial check immediately
    checkReminders();

    // Re-check when data changes
    window.addEventListener('meditrack_data_changed', () => {
      checkReminders();
    });
  }

  // Request browser notification permission
  function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    const settings = StorageManager.getSettings();
    if (settings.notificationsEnabled && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // Periodic reminder checker
  function checkReminders() {
    const now = new Date();
    const todayStr = StorageManager.getTodayString();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;
    const nowEpoch = now.getTime();

    // Check snoozed reminders
    snoozedReminders.forEach((triggerTime, key) => {
      if (nowEpoch >= triggerTime) {
        snoozedReminders.delete(key);
        const [medId, schedTime] = key.split('_');
        const med = StorageManager.getMedicines().find(m => m.id === medId);
        if (med) {
          triggerAlert(med, schedTime, true);
        }
      }
    });

    // Check today's scheduled doses
    const todayDoses = StorageManager.getTodayDoses();

    todayDoses.forEach(dose => {
      // Only alert for pending doses
      if (dose.status !== 'pending') return;

      const triggerKey = `${todayStr}_${dose.medicineId}_${dose.scheduledTime}`;

      // If already triggered and handled today, skip
      if (triggeredToday.has(triggerKey)) return;

      // Check if scheduled time matches current time
      if (dose.scheduledTime === currentTimeStr) {
        triggeredToday.add(triggerKey);
        const med = StorageManager.getMedicines().find(m => m.id === dose.medicineId);
        if (med) {
          triggerAlert(med, dose.scheduledTime, false);
        }
      }
    });
  }

  // Trigger audio, modal, and system notification
  function triggerAlert(medicine, scheduledTime, isSnoozed = false) {
    // Play sound chime
    if (window.SoundManager) {
      window.SoundManager.playReminderChime();
    }

    // Trigger system notification if permitted
    sendSystemNotification(medicine, scheduledTime);

    // Show on-screen accessible alert modal
    showReminderModal(medicine, scheduledTime, isSnoozed);
  }

  // Browser notification
  function sendSystemNotification(medicine, scheduledTime) {
    const settings = StorageManager.getSettings();
    if (!settings.notificationsEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    try {
      const formattedTime = formatTimeDisplay(scheduledTime);
      const title = `💊 Time for your medication: ${medicine.name}`;
      const options = {
        body: `Dosage: ${medicine.dosage} (${formatInstruction(medicine.instructions)})\nScheduled for ${formattedTime}`,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7"><path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-15z"/></svg>',
        requireInteraction: true,
        tag: `meditrack-${medicine.id}-${scheduledTime}`
      };
      new Notification(title, options);
    } catch (e) {
      console.warn('System notification failed:', e);
    }
  }

  // Display accessible modal popup
  function showReminderModal(medicine, scheduledTime, isSnoozed = false) {
    const modalContainer = document.getElementById('reminderAlertModal');
    if (!modalContainer) return;

    const formattedTime = formatTimeDisplay(scheduledTime);

    // Populate modal contents
    document.getElementById('reminderMedName').textContent = medicine.name;
    document.getElementById('reminderMedDosage').textContent = `${medicine.dosage} • ${formatType(medicine.type)}`;
    document.getElementById('reminderMedTime').textContent = formattedTime;
    document.getElementById('reminderMedInstructions').textContent = formatInstruction(medicine.instructions);
    
    const notesElem = document.getElementById('reminderMedNotes');
    if (medicine.specialNotes) {
      notesElem.textContent = `Note: ${medicine.specialNotes}`;
      notesElem.style.display = 'block';
    } else {
      notesElem.style.display = 'none';
    }

    const badgeElem = document.getElementById('reminderStatusBadge');
    if (badgeElem) {
      badgeElem.textContent = isSnoozed ? 'Snoozed Reminder' : 'Scheduled Now';
      badgeElem.className = isSnoozed ? 'badge badge-warning' : 'badge badge-primary';
    }

    // Set active medicine info on buttons
    const btnTaken = document.getElementById('btnReminderTake');
    const btnSkip = document.getElementById('btnReminderSkip');
    const btnSnooze = document.getElementById('btnReminderSnooze');

    btnTaken.onclick = () => {
      StorageManager.recordDoseByMedAndTime(medicine.id, scheduledTime, 'taken');
      if (window.SoundManager) window.SoundManager.playSuccessChime();
      if (window.UI) window.UI.showToast(`Marked ${medicine.name} as Taken! Excellent job!`, 'success');
      closeReminderModal();
    };

    btnSkip.onclick = () => {
      StorageManager.recordDoseByMedAndTime(medicine.id, scheduledTime, 'skipped', 'Skipped by user');
      if (window.UI) window.UI.showToast(`Dose for ${medicine.name} was marked as Skipped.`, 'info');
      closeReminderModal();
    };

    btnSnooze.onclick = () => {
      snoozeReminder(medicine.id, scheduledTime, 5); // 5 minutes snooze
      if (window.UI) window.UI.showToast(`Reminder for ${medicine.name} snoozed for 5 minutes.`, 'info');
      closeReminderModal();
    };

    modalContainer.classList.add('active');
    modalContainer.setAttribute('aria-hidden', 'false');
    btnTaken.focus();
  }

  function closeReminderModal() {
    const modalContainer = document.getElementById('reminderAlertModal');
    if (modalContainer) {
      modalContainer.classList.remove('active');
      modalContainer.setAttribute('aria-hidden', 'true');
    }
  }

  // Snooze a reminder for X minutes
  function snoozeReminder(medicineId, scheduledTime, minutes = 5) {
    const key = `${medicineId}_${scheduledTime}`;
    const triggerTime = Date.now() + minutes * 60 * 1000;
    snoozedReminders.set(key, triggerTime);
  }

  // Get upcoming reminders list (sorted by nearest upcoming time today)
  function getUpcomingReminders() {
    const todayStr = StorageManager.getTodayString();
    const doses = StorageManager.getTodayDoses();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Map doses with time difference
    const upcoming = doses.map(dose => {
      const [h, m] = dose.scheduledTime.split(':').map(Number);
      const doseMinutes = h * 60 + m;
      const diffMinutes = doseMinutes - currentMinutes;

      return {
        ...dose,
        doseMinutes,
        diffMinutes,
        isPast: diffMinutes < -15 && dose.status === 'pending'
      };
    });

    // Sort: pending upcoming first, then pending past due, then others
    upcoming.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return a.doseMinutes - b.doseMinutes;
    });

    return upcoming;
  }

  // Manual test trigger function
  function testReminderAlert() {
    const medicines = StorageManager.getMedicines();
    const testMed = medicines.length > 0 ? medicines[0] : {
      id: 'test_1',
      name: 'Sample Medicine',
      dosage: '500 mg',
      type: 'tablet',
      instructions: 'after_meal',
      specialNotes: 'This is a test notification demo.'
    };
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    triggerAlert(testMed, timeStr, false);
  }

  // Format time helpers
  function formatTimeDisplay(timeStr) {
    if (!timeStr) return '';
    const settings = StorageManager.getSettings();
    if (settings.timeFormat === '24h') return timeStr;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  function formatType(type) {
    const types = {
      tablet: 'Tablet',
      capsule: 'Capsule',
      syrup: 'Syrup / Liquid',
      drops: 'Eye/Ear Drops',
      injection: 'Injection',
      inhaler: 'Inhaler',
      ointment: 'Cream / Ointment',
      other: 'Medicine'
    };
    return types[type] || 'Medicine';
  }

  function formatInstruction(code) {
    const instructions = {
      before_meal: 'Take before meal',
      with_meal: 'Take with food/meal',
      after_meal: 'Take after meal',
      empty_stomach: 'Take on empty stomach',
      bedtime: 'Take before sleep / bedtime',
      as_directed: 'Take as directed by doctor'
    };
    return instructions[code] || 'Take as prescribed';
  }

  return {
    init,
    checkReminders,
    triggerAlert,
    testReminderAlert,
    closeReminderModal,
    getUpcomingReminders,
    formatTimeDisplay,
    formatType,
    formatInstruction
  };
})();

window.ReminderEngine = ReminderEngine;


/* ==========================================================================
   MODULE: js/tracker.js
   ========================================================================== */

/**
 * MediTrack - Dose Tracker & History Module
 * Manages daily schedule tracking, status transitions (Taken, Missed, Skipped, Pending),
 * and comprehensive historical logs with filtering and manual logging.
 */

const DoseTracker = (() => {

  // Time periods configuration
  const PERIODS = {
    all: { label: 'All Doses', minHour: 0, maxHour: 24 },
    morning: { label: 'Morning (6 AM - 12 PM)', minHour: 6, maxHour: 12 },
    afternoon: { label: 'Afternoon (12 PM - 5 PM)', minHour: 12, maxHour: 17 },
    evening: { label: 'Evening (5 PM - 9 PM)', minHour: 17, maxHour: 21 },
    night: { label: 'Night (9 PM - 6 AM)', minHour: 21, maxHour: 6 }
  };

  // Determine time period for a given HH:MM string
  function getTimePeriod(timeStr) {
    const [h] = timeStr.split(':').map(Number);
    if (h >= 6 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  }

  // Get today's doses filtered by period
  function getTodaySchedule(period = 'all') {
    const doses = StorageManager.getTodayDoses();

    // Sort doses by scheduled time
    doses.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    if (period === 'all') return doses;

    return doses.filter(dose => getTimePeriod(dose.scheduledTime) === period);
  }

  // Update dose status
  function markDoseStatus(doseId, status, notes = '') {
    const result = StorageManager.recordDoseStatus(doseId, status, notes);
    if (result) {
      if (status === 'taken' && window.SoundManager) {
        window.SoundManager.playSuccessChime();
      } else if (status === 'missed' && window.SoundManager) {
        window.SoundManager.playWarningChime();
      }
    }
    return result;
  }

  // Add manual log entry for past/custom dose
  function addManualDoseLog({ medicineId, date, time, status, notes }) {
    const med = StorageManager.getMedicines().find(m => m.id === medicineId);
    if (!med) throw new Error('Medicine not found.');

    const doses = StorageManager.getDoses();
    const id = `manual_${medicineId}_${date}_${time.replace(':', '')}_${Date.now()}`;

    const newLog = {
      id,
      medicineId: med.id,
      medicineName: med.name,
      dosage: med.dosage,
      type: med.type,
      color: med.color || 'blue',
      scheduledDate: date,
      scheduledTime: time,
      status: status || 'taken',
      actionTime: new Date(`${date}T${time}:00`).toISOString(),
      notes: notes || 'Manually logged'
    };

    doses.push(newLog);
    StorageManager.saveDoses(doses);
    return newLog;
  }

  // Delete a history entry
  function deleteDoseLog(doseId) {
    const doses = StorageManager.getDoses().filter(d => d.id !== doseId);
    StorageManager.saveDoses(doses);
    return true;
  }

  // Filter history records
  function getFilteredHistory({ range = '7days', status = 'all', medicineId = 'all', customDate = '' } = {}) {
    const allDoses = StorageManager.getDoses();
    const today = new Date();
    const todayStr = StorageManager.getTodayString();

    let filtered = allDoses.filter(dose => {
      // Filter by Medicine
      if (medicineId !== 'all' && dose.medicineId !== medicineId) return false;

      // Filter by Status
      if (status !== 'all' && dose.status !== status) return false;

      // Filter by Date range
      if (customDate) {
        return dose.scheduledDate === customDate;
      }

      if (range === 'today') {
        return dose.scheduledDate === todayStr;
      } else if (range === '7days') {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 7);
        const pastDateStr = StorageManager.formatDateString(pastDate);
        return dose.scheduledDate >= pastDateStr && dose.scheduledDate <= todayStr;
      } else if (range === '30days') {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 30);
        const pastDateStr = StorageManager.formatDateString(pastDate);
        return dose.scheduledDate >= pastDateStr && dose.scheduledDate <= todayStr;
      }

      return true; // range === 'all'
    });

    // Sort history descending by date and time
    filtered.sort((a, b) => {
      const cmpDate = b.scheduledDate.localeCompare(a.scheduledDate);
      if (cmpDate !== 0) return cmpDate;
      return b.scheduledTime.localeCompare(a.scheduledTime);
    });

    return filtered;
  }

  // Summary statistics for today
  function getTodayStats() {
    const todayDoses = StorageManager.getTodayDoses();
    const total = todayDoses.length;
    const taken = todayDoses.filter(d => d.status === 'taken').length;
    const missed = todayDoses.filter(d => d.status === 'missed').length;
    const skipped = todayDoses.filter(d => d.status === 'skipped').length;
    const pending = todayDoses.filter(d => d.status === 'pending').length;

    const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

    return {
      total,
      taken,
      missed,
      skipped,
      pending,
      percentage
    };
  }

  return {
    PERIODS,
    getTimePeriod,
    getTodaySchedule,
    markDoseStatus,
    addManualDoseLog,
    deleteDoseLog,
    getFilteredHistory,
    getTodayStats
  };
})();

window.DoseTracker = DoseTracker;


/* ==========================================================================
   MODULE: js/reports.js
   ========================================================================== */

/**
 * MediTrack - Reports and Analytics Module
 * Calculates adherence metrics, renders Chart.js charts with offline SVG fallback,
 * computes streaks, and generates printable doctor summaries.
 */

const ReportsManager = (() => {
  let weeklyChartInstance = null;
  let distributionChartInstance = null;

  // Calculate 7-day adherence statistics
  function getWeeklyAdherenceData() {
    const today = new Date();
    const daysData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = StorageManager.formatDateString(d);
      const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
      const monthDay = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      const doses = StorageManager.getDoses().filter(dose => dose.scheduledDate === dateStr);
      const total = doses.length;
      const taken = doses.filter(dose => dose.status === 'taken').length;
      const missed = doses.filter(dose => dose.status === 'missed').length;
      const skipped = doses.filter(dose => dose.status === 'skipped').length;
      const rate = total > 0 ? Math.round((taken / total) * 100) : 100;

      daysData.push({
        date: dateStr,
        label: i === 0 ? 'Today' : dayName,
        fullLabel: monthDay,
        total,
        taken,
        missed,
        skipped,
        rate
      });
    }

    return daysData;
  }

  // Calculate overall statistics across entire history or past 30 days
  function getOverallStats() {
    const doses = StorageManager.getDoses();
    const total = doses.length;
    const taken = doses.filter(d => d.status === 'taken').length;
    const missed = doses.filter(d => d.status === 'missed').length;
    const skipped = doses.filter(d => d.status === 'skipped').length;
    const pending = doses.filter(d => d.status === 'pending').length;

    // Concluded doses (taken + missed + skipped)
    const concluded = taken + missed + skipped;
    const adherenceRate = concluded > 0 ? Math.round((taken / concluded) * 100) : 100;

    // Calculate current streak of 100% adherence days
    const weeklyData = getWeeklyAdherenceData();
    let streak = 0;
    // Iterate from today backwards
    for (let i = weeklyData.length - 1; i >= 0; i--) {
      const day = weeklyData[i];
      // For today, if some are taken and none are missed, consider streak active
      if (i === weeklyData.length - 1) {
        if (day.missed === 0 && day.taken > 0) {
          streak++;
        }
      } else {
        if (day.rate >= 80 && day.missed === 0) {
          streak++;
        } else {
          break;
        }
      }
    }

    return {
      total,
      taken,
      missed,
      skipped,
      pending,
      adherenceRate,
      streak: Math.max(streak, 1) // realistic friendly streak for motivation
    };
  }

  // Calculate per-medicine adherence stats
  function getMedicineAdherence() {
    const medicines = StorageManager.getMedicines();
    const doses = StorageManager.getDoses();

    return medicines.map(med => {
      const medDoses = doses.filter(d => d.medicineId === med.id);
      const total = medDoses.length;
      const taken = medDoses.filter(d => d.status === 'taken').length;
      const missed = medDoses.filter(d => d.status === 'missed').length;
      const skipped = medDoses.filter(d => d.status === 'skipped').length;
      const concluded = taken + missed + skipped;
      const rate = concluded > 0 ? Math.round((taken / concluded) * 100) : 100;

      return {
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        type: med.type,
        color: med.color,
        total,
        taken,
        missed,
        skipped,
        rate
      };
    });
  }

  // Render or update charts
  function renderCharts() {
    renderWeeklyChart();
    renderDistributionChart();
  }

  // Weekly Adherence Bar Chart
  function renderWeeklyChart() {
    const canvas = document.getElementById('weeklyAdherenceChart');
    if (!canvas) return;

    const data = getWeeklyAdherenceData();
    const labels = data.map(d => d.label);
    const rates = data.map(d => d.rate);

    // If Chart.js is available
    if (window.Chart) {
      if (weeklyChartInstance) {
        weeklyChartInstance.destroy();
      }

      const ctx = canvas.getContext('2d');
      // Create subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, '#0284c7');
      gradient.addColorStop(1, '#bae6fd');

      weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Adherence %',
            data: rates,
            backgroundColor: rates.map(r => r >= 80 ? gradient : '#fca5a5'),
            borderRadius: 8,
            borderSkipped: false,
            borderWidth: 0,
            barThickness: 28
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              displayColors: false,
              callbacks: {
                title: (items) => data[items[0].dataIndex].fullLabel,
                label: (item) => {
                  const day = data[item.dataIndex];
                  return [
                    `Adherence: ${day.rate}%`,
                    `Taken: ${day.taken} | Missed: ${day.missed} | Skipped: ${day.skipped}`
                  ];
                }
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 25,
                callback: (val) => `${val}%`,
                font: { size: 12, family: 'Inter, system-ui' },
                color: '#64748b'
              },
              grid: {
                color: '#f1f5f9'
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 13, weight: '600', family: 'Inter, system-ui' },
                color: '#334155'
              }
            }
          }
        }
      });
    } else {
      renderSvgBarChartFallback(canvas, data);
    }
  }

  // Dose Distribution Doughnut Chart
  function renderDistributionChart() {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) return;

    const stats = getOverallStats();

    if (window.Chart) {
      if (distributionChartInstance) {
        distributionChartInstance.destroy();
      }

      const ctx = canvas.getContext('2d');
      distributionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Taken', 'Missed', 'Skipped', 'Pending'],
          datasets: [{
            data: [stats.taken, stats.missed, stats.skipped, stats.pending],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#94a3b8'],
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16,
                usePointStyle: true,
                pointStyle: 'circle',
                font: { size: 13, family: 'Inter, system-ui', weight: '500' }
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              callbacks: {
                label: (item) => ` ${item.label}: ${item.raw} doses`
              }
            }
          }
        }
      });
    } else {
      renderSvgDoughnutFallback(canvas, stats);
    }
  }

  // Fallback SVG Bar Chart in case CDN is unreachable
  function renderSvgBarChartFallback(canvas, data) {
    const parent = canvas.parentElement;
    parent.innerHTML = `
      <div class="fallback-chart-wrapper" style="width: 100%; height: 240px; display: flex; align-items: flex-end; justify-content: space-around; padding: 20px 10px; border-bottom: 2px solid #e2e8f0;">
        ${data.map(d => `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #0284c7;">${d.rate}%</span>
            <div style="width: 32px; height: ${Math.max(d.rate * 1.6, 6)}px; background: linear-gradient(180deg, #0284c7, #38bdf8); border-radius: 6px;"></div>
            <span style="font-size: 12px; font-weight: 600; color: #475569;">${d.label}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Fallback SVG Doughnut in case CDN is unreachable
  function renderSvgDoughnutFallback(canvas, stats) {
    const total = stats.taken + stats.missed + stats.skipped + stats.pending || 1;
    const takenPct = Math.round((stats.taken / total) * 100);
    const parent = canvas.parentElement;
    parent.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 3rem; font-weight: 800; color: #10b981;">${takenPct}%</div>
        <div style="font-size: 14px; color: #64748b; margin-top: 4px;">Doses Taken on Schedule</div>
        <div style="display: flex; justify-content: center; gap: 16px; margin-top: 20px; font-size: 13px;">
          <span style="color: #10b981; font-weight: 600;">● Taken: ${stats.taken}</span>
          <span style="color: #ef4444; font-weight: 600;">● Missed: ${stats.missed}</span>
          <span style="color: #f59e0b; font-weight: 600;">● Skipped: ${stats.skipped}</span>
        </div>
      </div>
    `;
  }

  // Print Doctor Summary Report
  function printDoctorReport() {
    const settings = StorageManager.getSettings();
    const stats = getOverallStats();
    const medicines = StorageManager.getMedicines().filter(m => m.active);
    const weekly = getWeeklyAdherenceData();

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to open the print-ready medical report.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MediTrack - Medication Adherence Summary</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 30px; color: #1e293b; max-width: 800px; margin: 0 auto; }
          h1 { color: #0284c7; margin-bottom: 4px; font-size: 24px; }
          .header-meta { font-size: 13px; color: #64748b; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
          .patient-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 14px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #0284c7; }
          .stat-label { font-size: 12px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f8fafc; font-weight: 600; }
          .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1>MediTrack Medical Adherence Report</h1>
            <div class="header-meta">Generated on ${new Date().toLocaleDateString(undefined, { dateStyle: 'full' })} at ${new Date().toLocaleTimeString()}</div>
          </div>
          <button class="no-print" onclick="window.print()" style="padding: 10px 18px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Print Report</button>
        </div>

        <div class="patient-box">
          <div><strong>Patient Name:</strong> ${settings.userName || 'N/A'}</div>
          <div><strong>Age:</strong> ${settings.userAge || 'N/A'} years</div>
          <div><strong>Primary Physician:</strong> ${settings.doctorName || 'N/A'}</div>
          <div><strong>Physician Phone:</strong> ${settings.doctorPhone || 'N/A'}</div>
          <div><strong>Emergency Contact:</strong> ${settings.emergencyContact || 'N/A'}</div>
          <div><strong>Overall Adherence:</strong> <span style="color: #10b981; font-weight: bold;">${stats.adherenceRate}%</span></div>
        </div>

        <h3>Adherence Summary</h3>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value" style="color: #10b981;">${stats.adherenceRate}%</div>
            <div class="stat-label">Adherence Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #0284c7;">${stats.taken}</div>
            <div class="stat-label">Doses Taken</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #ef4444;">${stats.missed}</div>
            <div class="stat-label">Missed Doses</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #f59e0b;">${stats.skipped}</div>
            <div class="stat-label">Skipped Doses</div>
          </div>
        </div>

        <h3>Active Medication Schedule</h3>
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Type</th>
              <th>Scheduled Times</th>
              <th>Instructions</th>
              <th>Notes / Purpose</th>
            </tr>
          </thead>
          <tbody>
            ${medicines.map(m => `
              <tr>
                <td><strong>${m.name}</strong></td>
                <td>${m.dosage}</td>
                <td style="text-transform: capitalize;">${m.type}</td>
                <td>${m.times.join(', ')}</td>
                <td>${ReminderEngine.formatInstruction(m.instructions)}</td>
                <td>${m.specialNotes || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3>Past 7 Days Adherence Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Scheduled Doses</th>
              <th>Taken</th>
              <th>Missed</th>
              <th>Skipped</th>
              <th>Daily Adherence</th>
            </tr>
          </thead>
          <tbody>
            ${weekly.map(w => `
              <tr>
                <td>${w.fullLabel} (${w.label})</td>
                <td>${w.total}</td>
                <td style="color: #10b981;"><strong>${w.taken}</strong></td>
                <td style="color: #ef4444;">${w.missed}</td>
                <td style="color: #f59e0b;">${w.skipped}</td>
                <td><strong>${w.rate}%</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          MediTrack Smart Medicine Reminder System • This document is prepared for patient and physician reference.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  return {
    getWeeklyAdherenceData,
    getOverallStats,
    getMedicineAdherence,
    renderCharts,
    printDoctorReport
  };
})();

window.ReportsManager = ReportsManager;


/* ==========================================================================
   MODULE: js/ui.js
   ========================================================================== */

/**
 * MediTrack - User Interface & Rendering Module
 * Manages view switching, toast alerts, modals, SVG icon library, and responsive components.
 */

const UI = (() => {

  // Inline accessible SVG icons dictionary
  const ICONS = {
    dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
    pill: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    tracker: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    bell: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    reports: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    skip: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    tablet: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
    capsule: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    syrup: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v3"/><path d="M14 2v3"/><path d="M8 5h8"/><rect x="7" y="8" width="10" height="13" rx="3"/><path d="M7 14h10"/></svg>`,
    drops: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    injection: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>`,
    inhaler: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h6a2 2 0 0 1 2 2v6H7V5a2 2 0 0 1 2-2z"/><path d="M7 11h11a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H7v-8z"/><path d="M4 17h3"/></svg>`,
    ointment: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-2 15a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3L6 3z"/><path d="M8 8h8"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    printer: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    heartPulse: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`
  };

  // Toast notification manager
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = ICONS.info;
    if (type === 'success') iconSvg = ICONS.check;
    if (type === 'error') iconSvg = ICONS.x;
    if (type === 'warning') iconSvg = ICONS.bell;

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Close message" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Accessible Modal helpers
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Focus first interactive element
    const focusable = modal.querySelector('button, input, select, textarea');
    if (focusable) focusable.focus();
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  // Get medicine type icon
  function getTypeIcon(type) {
    return ICONS[type] || ICONS.tablet;
  }

  // Apply user theme preferences (font size & contrast)
  function applyThemeSettings() {
    const settings = StorageManager.getSettings();
    const root = document.documentElement;
    const body = document.body;

    // Font size
    root.setAttribute('data-font-size', settings.fontSize || 'normal');

    // High contrast
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
  }

  // Render Live Header with Clock & Greeting
  function updateLiveHeader() {
    const now = new Date();
    const settings = StorageManager.getSettings();

    // Time display
    const timeElem = document.getElementById('headerLiveTime');
    if (timeElem) {
      if (settings.timeFormat === '24h') {
        timeElem.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      } else {
        timeElem.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      }
    }

    // Date display
    const dateElem = document.getElementById('headerLiveDate');
    if (dateElem) {
      dateElem.textContent = now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    // Dynamic greeting based on time of day
    const greetingElem = document.getElementById('dashboardGreeting');
    if (greetingElem) {
      const hour = now.getHours();
      let greetingText = 'Good day';
      if (hour >= 5 && hour < 12) greetingText = 'Good morning';
      else if (hour >= 12 && hour < 17) greetingText = 'Good afternoon';
      else if (hour >= 17 && hour < 22) greetingText = 'Good evening';
      else greetingText = 'Rest well';

      const userName = settings.userName ? settings.userName.split(' ')[0] : 'there';
      greetingElem.textContent = `${greetingText}, ${userName}!`;
    }
  }

  // Render Dashboard View
  function renderDashboard() {
    const medicines = StorageManager.getMedicines().filter(m => m.active);
    const todayStats = DoseTracker.getTodayStats();
    const upcomingList = ReminderEngine.getUpcomingReminders();

    // 1. Stat Badges
    const totalMedsElem = document.getElementById('statTotalMedicines');
    if (totalMedsElem) totalMedsElem.textContent = medicines.length;

    const todayDosesElem = document.getElementById('statTodayDoses');
    if (todayDosesElem) todayDosesElem.textContent = todayStats.total;

    const completedDosesElem = document.getElementById('statCompletedDoses');
    if (completedDosesElem) completedDosesElem.textContent = todayStats.taken;

    const missedDosesElem = document.getElementById('statMissedDoses');
    if (missedDosesElem) missedDosesElem.textContent = todayStats.missed;

    // 2. Daily Adherence Progress Bar & Percentage
    const adherenceBar = document.getElementById('dashboardAdherenceBar');
    const adherencePct = document.getElementById('dashboardAdherencePct');
    const adherenceSubtext = document.getElementById('dashboardAdherenceSubtext');

    if (adherenceBar && adherencePct) {
      adherenceBar.style.width = `${todayStats.percentage}%`;
      adherencePct.textContent = `${todayStats.percentage}%`;

      if (todayStats.percentage === 100) {
        adherenceSubtext.textContent = '🌟 Perfect score! All scheduled doses completed!';
      } else if (todayStats.taken > 0) {
        adherenceSubtext.textContent = `${todayStats.taken} of ${todayStats.total} doses taken today`;
      } else {
        adherenceSubtext.textContent = `Ready for today's medications`;
      }
    }

    // 3. Upcoming Medication Reminders Section
    const upcomingContainer = document.getElementById('dashboardUpcomingList');
    if (upcomingContainer) {
      if (upcomingList.length === 0) {
        upcomingContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">${ICONS.sparkles}</div>
            <h3>No Scheduled Doses Today</h3>
            <p>Add your prescribed medicines to get timely reminders.</p>
            <button class="btn btn-primary" onclick="UI.openAddMedicineModal()">${ICONS.plus} Add Medicine</button>
          </div>
        `;
      } else {
        upcomingContainer.innerHTML = upcomingList.slice(0, 4).map(dose => {
          const med = medicines.find(m => m.id === dose.medicineId) || {};
          const isPending = dose.status === 'pending';
          const isTaken = dose.status === 'taken';
          const isMissed = dose.status === 'missed';

          let statusClass = 'status-pending';
          let statusText = 'Pending';
          if (isTaken) { statusClass = 'status-taken'; statusText = 'Taken'; }
          else if (isMissed) { statusClass = 'status-missed'; statusText = 'Missed'; }
          else if (dose.status === 'skipped') { statusClass = 'status-skipped'; statusText = 'Skipped'; }

          const formattedTime = ReminderEngine.formatTimeDisplay(dose.scheduledTime);

          return `
            <div class="reminder-card ${statusClass}">
              <div class="reminder-card-left">
                <div class="reminder-icon-box bg-${dose.color || 'blue'}">
                  ${getTypeIcon(dose.type)}
                </div>
                <div class="reminder-card-info">
                  <div class="reminder-med-title">
                    <h4>${dose.medicineName}</h4>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                  </div>
                  <div class="reminder-meta">
                    <span class="meta-item"><span class="icon-sm">${ICONS.clock}</span> ${formattedTime}</span>
                    <span class="meta-item"><strong>${dose.dosage}</strong></span>
                    <span class="meta-item meta-instruction">${ReminderEngine.formatInstruction(med.instructions)}</span>
                  </div>
                </div>
              </div>
              <div class="reminder-card-actions">
                ${isPending ? `
                  <button class="btn btn-success btn-sm btn-icon-text" onclick="UI.handleTakeDose('${dose.id}', '${dose.medicineName}')">
                    ${ICONS.check} Taken
                  </button>
                  <button class="btn btn-ghost btn-sm" onclick="UI.handleSkipDose('${dose.id}', '${dose.medicineName}')" title="Skip this dose">
                    ${ICONS.skip}
                  </button>
                ` : `
                  <button class="btn btn-outline btn-sm" onclick="UI.handleUndoDose('${dose.id}')">
                    Undo
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // Render Medicine Management View
  function renderMedicines() {
    const medicines = StorageManager.getMedicines();
    const searchInput = document.getElementById('medicineSearchInput');
    const filterType = document.getElementById('medicineTypeFilter');
    const container = document.getElementById('medicinesGrid');

    if (!container) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const typeFilter = filterType ? filterType.value : 'all';

    const filtered = medicines.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(query) ||
                            (med.specialNotes && med.specialNotes.toLowerCase().includes(query)) ||
                            med.dosage.toLowerCase().includes(query);
      const matchesType = typeFilter === 'all' || med.type === typeFilter;
      return matchesSearch && matchesType;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state full-width">
          <div class="empty-icon">${ICONS.pill}</div>
          <h3>${query ? 'No matching medicines found' : 'No medicines added yet'}</h3>
          <p>${query ? 'Try a different search query or clear your filter.' : 'Organize your health routine by adding your first daily medicine.'}</p>
          <button class="btn btn-primary btn-lg" onclick="UI.openAddMedicineModal()">${ICONS.plus} Add New Medicine</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(med => {
      const timesFormatted = med.times.map(t => ReminderEngine.formatTimeDisplay(t)).join(', ');
      const freqLabel = formatFrequency(med.frequency);

      return `
        <div class="medicine-card border-${med.color || 'blue'}">
          <div class="med-card-header">
            <div class="med-card-title-group">
              <div class="med-type-avatar bg-${med.color || 'blue'}">
                ${getTypeIcon(med.type)}
              </div>
              <div>
                <h3 class="med-card-name">${med.name}</h3>
                <span class="med-card-dosage">${med.dosage} • ${ReminderEngine.formatType(med.type)}</span>
              </div>
            </div>
            <div class="med-card-menu">
              <button class="btn-icon" title="Edit Medicine" onclick="UI.openEditMedicineModal('${med.id}')">
                ${ICONS.edit}
              </button>
              <button class="btn-icon text-danger" title="Delete Medicine" onclick="UI.confirmDeleteMedicine('${med.id}', '${med.name}')">
                ${ICONS.trash}
              </button>
            </div>
          </div>

          <div class="med-card-body">
            <div class="med-info-row">
              <span class="info-label">Frequency:</span>
              <span class="info-val font-semibold">${freqLabel}</span>
            </div>
            <div class="med-info-row">
              <span class="info-label">Scheduled:</span>
              <div class="time-pills-wrap">
                ${med.times.map(t => `<span class="time-pill">${ReminderEngine.formatTimeDisplay(t)}</span>`).join('')}
              </div>
            </div>
            <div class="med-info-row">
              <span class="info-label">Instructions:</span>
              <span class="info-val info-tag">${ReminderEngine.formatInstruction(med.instructions)}</span>
            </div>
            ${med.specialNotes ? `
              <div class="med-notes-box">
                <span class="notes-icon">${ICONS.info}</span>
                <span>${med.specialNotes}</span>
              </div>
            ` : ''}
            <div class="med-date-range">
              <span>Start: ${med.startDate || 'Immediate'}</span>
              <span>${med.endDate ? `Ends: ${med.endDate}` : 'Ongoing'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Dose Tracker View
  function renderTracker() {
    const periodButtons = document.querySelectorAll('.period-filter-btn');
    let currentPeriod = 'all';
    periodButtons.forEach(btn => {
      if (btn.classList.contains('active')) currentPeriod = btn.dataset.period;
    });

    const schedule = DoseTracker.getTodaySchedule(currentPeriod);
    const container = document.getElementById('trackerScheduleContainer');

    if (container) {
      if (schedule.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">${ICONS.clock}</div>
            <h3>No doses scheduled for this period</h3>
            <p>Select another time of day or add new medicines to your schedule.</p>
          </div>
        `;
      } else {
        container.innerHTML = schedule.map(dose => {
          const med = StorageManager.getMedicines().find(m => m.id === dose.medicineId) || {};
          const isTaken = dose.status === 'taken';
          const isMissed = dose.status === 'missed';
          const isSkipped = dose.status === 'skipped';
          const isPending = dose.status === 'pending';

          let statusClass = 'status-pending';
          let statusText = 'Pending';
          let completedTimeDisplay = '';

          if (isTaken) {
            statusClass = 'status-taken';
            statusText = 'Taken';
            if (dose.actionTime) {
              const actDate = new Date(dose.actionTime);
              completedTimeDisplay = ` at ${actDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
          } else if (isMissed) {
            statusClass = 'status-missed';
            statusText = 'Missed';
          } else if (isSkipped) {
            statusClass = 'status-skipped';
            statusText = 'Skipped';
          }

          return `
            <div class="dose-tracker-card ${statusClass}">
              <div class="dose-time-badge">
                <span class="time-main">${ReminderEngine.formatTimeDisplay(dose.scheduledTime)}</span>
                <span class="period-sub">${DoseTracker.getTimePeriod(dose.scheduledTime)}</span>
              </div>
              <div class="dose-center-info">
                <div class="dose-name-row">
                  <h4>${dose.medicineName}</h4>
                  <span class="status-badge ${statusClass}">${statusText}${completedTimeDisplay}</span>
                </div>
                <div class="dose-dosage-row">
                  <span>${dose.dosage} • ${ReminderEngine.formatType(dose.type)}</span>
                  <span>•</span>
                  <span>${ReminderEngine.formatInstruction(med.instructions)}</span>
                </div>
                ${dose.notes ? `<div class="dose-note-pill">${dose.notes}</div>` : ''}
              </div>
              <div class="dose-action-buttons">
                ${isPending ? `
                  <button class="btn btn-success btn-action-lg" onclick="UI.handleTakeDose('${dose.id}', '${dose.medicineName}')">
                    ${ICONS.check} Taken
                  </button>
                  <button class="btn btn-danger btn-action-lg" onclick="UI.handleMissedDose('${dose.id}', '${dose.medicineName}')">
                    ${ICONS.x} Missed
                  </button>
                  <button class="btn btn-outline btn-action-sm" onclick="UI.handleSkipDose('${dose.id}', '${dose.medicineName}')" title="Skip dose">
                    ${ICONS.skip}
                  </button>
                ` : `
                  <button class="btn btn-secondary btn-sm" onclick="UI.handleUndoDose('${dose.id}')">
                    Change / Undo
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Dose History List
    renderDoseHistory();
  }

  // Render Dose History Table / Cards
  function renderDoseHistory() {
    const rangeFilter = document.getElementById('historyRangeFilter');
    const statusFilter = document.getElementById('historyStatusFilter');
    const medFilter = document.getElementById('historyMedicineFilter');
    const historyTableBody = document.getElementById('doseHistoryTableBody');

    if (!historyTableBody) return;

    // Populate Medicine dropdown if empty
    if (medFilter && medFilter.options.length <= 1) {
      const medicines = StorageManager.getMedicines();
      medicines.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name;
        medFilter.appendChild(opt);
      });
    }

    const range = rangeFilter ? rangeFilter.value : '7days';
    const status = statusFilter ? statusFilter.value : 'all';
    const medicineId = medFilter ? medFilter.value : 'all';

    const history = DoseTracker.getFilteredHistory({ range, status, medicineId });

    if (history.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">
            No dose history records match the selected filters.
          </td>
        </tr>
      `;
      return;
    }

    historyTableBody.innerHTML = history.map(item => {
      let badgeClass = 'status-pending';
      if (item.status === 'taken') badgeClass = 'status-taken';
      else if (item.status === 'missed') badgeClass = 'status-missed';
      else if (item.status === 'skipped') badgeClass = 'status-skipped';

      const schedFormatted = ReminderEngine.formatTimeDisplay(item.scheduledTime);
      let actionFormatted = '—';
      if (item.actionTime) {
        const actDate = new Date(item.actionTime);
        actionFormatted = actDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      return `
        <tr>
          <td>
            <strong>${item.scheduledDate}</strong>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="history-type-dot bg-${item.color || 'blue'}"></span>
              <strong>${item.medicineName}</strong>
            </div>
          </td>
          <td>${item.dosage}</td>
          <td>${schedFormatted}</td>
          <td>
            <span class="status-badge ${badgeClass}" style="text-transform: capitalize;">${item.status}</span>
            ${actionFormatted !== '—' ? `<span style="font-size: 11px; color: #64748b; margin-left: 4px;">(${actionFormatted})</span>` : ''}
          </td>
          <td>
            <button class="btn-icon text-muted" title="Delete log" onclick="UI.deleteHistoryLog('${item.id}')">
              ${ICONS.trash}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Reports & Analytics View
  function renderReports() {
    const stats = ReportsManager.getOverallStats();
    const todayStats = DoseTracker.getTodayStats();
    const medAdherence = ReportsManager.getMedicineAdherence();

    // Stats cards
    const overallRateElem = document.getElementById('reportOverallAdherence');
    if (overallRateElem) overallRateElem.textContent = `${stats.adherenceRate}%`;

    const streakElem = document.getElementById('reportStreakCount');
    if (streakElem) streakElem.textContent = `${stats.streak} Days`;

    const totalTakenElem = document.getElementById('reportTotalTaken');
    if (totalTakenElem) totalTakenElem.textContent = stats.taken;

    const totalMissedElem = document.getElementById('reportTotalMissed');
    if (totalMissedElem) totalMissedElem.textContent = stats.missed;

    // Render Charts
    ReportsManager.renderCharts();

    // Render Medicine Breakdown Table
    const tableBody = document.getElementById('reportMedicineTableBody');
    if (tableBody) {
      if (medAdherence.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No medicine data available.</td></tr>`;
      } else {
        tableBody.innerHTML = medAdherence.map(med => {
          let barColor = '#10b981';
          if (med.rate < 60) barColor = '#ef4444';
          else if (med.rate < 85) barColor = '#f59e0b';

          return `
            <tr>
              <td>
                <strong>${med.name}</strong>
                <div style="font-size: 12px; color: #64748b;">${med.dosage}</div>
              </td>
              <td>${med.total}</td>
              <td style="color: #10b981; font-weight: 600;">${med.taken}</td>
              <td style="color: #ef4444; font-weight: 600;">${med.missed}</td>
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; min-width: 60px;">
                    <div style="width: ${med.rate}%; height: 100%; background: ${barColor};"></div>
                  </div>
                  <strong style="font-size: 13px;">${med.rate}%</strong>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // Render Reminders Screen
  function renderReminders() {
    const upcomingList = ReminderEngine.getUpcomingReminders();
    const container = document.getElementById('remindersPageList');
    const settings = StorageManager.getSettings();

    // Permission status banner
    const permStatusElem = document.getElementById('notificationPermStatus');
    if (permStatusElem) {
      if (!('Notification' in window)) {
        permStatusElem.innerHTML = `<span class="badge badge-warning">Browser notifications unsupported</span>`;
      } else if (Notification.permission === 'granted') {
        permStatusElem.innerHTML = `<span class="badge badge-success">✓ Browser Notifications Active</span>`;
      } else {
        permStatusElem.innerHTML = `
          <button class="btn btn-outline btn-sm" onclick="ReminderEngine.init(); UI.showToast('Notification permission requested', 'info');">
            Enable Browser Alerts
          </button>
        `;
      }
    }

    if (container) {
      if (upcomingList.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">${ICONS.bell}</div>
            <h3>No Scheduled Reminders</h3>
            <p>Your medicine reminders will appear here once scheduled.</p>
          </div>
        `;
      } else {
        container.innerHTML = upcomingList.map(dose => {
          const med = StorageManager.getMedicines().find(m => m.id === dose.medicineId) || {};
          const isPending = dose.status === 'pending';
          const formattedTime = ReminderEngine.formatTimeDisplay(dose.scheduledTime);

          let relativeLabel = '';
          if (isPending) {
            if (dose.diffMinutes > 0) {
              const hours = Math.floor(dose.diffMinutes / 60);
              const mins = dose.diffMinutes % 60;
              relativeLabel = hours > 0 ? `In ${hours}h ${mins}m` : `In ${mins} minutes`;
            } else if (dose.diffMinutes >= -15) {
              relativeLabel = '🔔 Due right now!';
            } else {
              relativeLabel = '⚠️ Overdue';
            }
          } else {
            relativeLabel = `Status: ${dose.status}`;
          }

          return `
            <div class="reminder-full-card ${dose.status === 'pending' ? 'active-reminder' : ''}">
              <div class="reminder-full-left">
                <div class="reminder-time-large">${formattedTime}</div>
                <div class="reminder-countdown-badge">${relativeLabel}</div>
              </div>
              <div class="reminder-full-body">
                <h3>${dose.medicineName} <span class="badge-dosage">${dose.dosage}</span></h3>
                <div class="reminder-instruction-tag">${ReminderEngine.formatInstruction(med.instructions)}</div>
                ${med.specialNotes ? `<div class="reminder-notes-text">${med.specialNotes}</div>` : ''}
              </div>
              <div class="reminder-full-actions">
                ${isPending ? `
                  <button class="btn btn-success btn-lg" onclick="UI.handleTakeDose('${dose.id}', '${dose.medicineName}')">
                    ${ICONS.check} Mark Taken
                  </button>
                  <button class="btn btn-ghost btn-lg" onclick="UI.handleSkipDose('${dose.id}', '${dose.medicineName}')">
                    Skip
                  </button>
                ` : `
                  <span class="status-badge status-${dose.status}">${dose.status.toUpperCase()}</span>
                `}
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // Populate Settings View
  function renderSettings() {
    const settings = StorageManager.getSettings();

    const nameInput = document.getElementById('settingsUserName');
    if (nameInput) nameInput.value = settings.userName || '';

    const ageInput = document.getElementById('settingsUserAge');
    if (ageInput) ageInput.value = settings.userAge || '';

    const docInput = document.getElementById('settingsDoctorName');
    if (docInput) docInput.value = settings.doctorName || '';

    const phoneInput = document.getElementById('settingsDoctorPhone');
    if (phoneInput) phoneInput.value = settings.doctorPhone || '';

    const emgInput = document.getElementById('settingsEmergencyContact');
    if (emgInput) emgInput.value = settings.emergencyContact || '';

    const time12 = document.getElementById('timeFormat12');
    const time24 = document.getElementById('timeFormat24');
    if (settings.timeFormat === '24h') {
      if (time24) time24.checked = true;
    } else {
      if (time12) time12.checked = true;
    }

    const soundToggle = document.getElementById('settingsSoundToggle');
    if (soundToggle) soundToggle.checked = settings.soundEnabled !== false;

    const notifToggle = document.getElementById('settingsNotifToggle');
    if (notifToggle) notifToggle.checked = settings.notificationsEnabled !== false;

    const fontNormal = document.getElementById('fontNormal');
    const fontLarge = document.getElementById('fontLarge');
    const fontXLarge = document.getElementById('fontXLarge');
    if (settings.fontSize === 'xlarge') { if (fontXLarge) fontXLarge.checked = true; }
    else if (settings.fontSize === 'large') { if (fontLarge) fontLarge.checked = true; }
    else { if (fontNormal) fontNormal.checked = true; }

    const contrastToggle = document.getElementById('settingsHighContrast');
    if (contrastToggle) contrastToggle.checked = settings.highContrast === true;
  }

  // User Actions: Take / Skip / Missed / Undo
  function handleTakeDose(doseId, medicineName) {
    DoseTracker.markDoseStatus(doseId, 'taken');
    showToast(`Marked ${medicineName} as Taken. Great job!`, 'success');
    refreshActiveView();
  }

  function handleMissedDose(doseId, medicineName) {
    DoseTracker.markDoseStatus(doseId, 'missed', 'Marked missed by user');
    showToast(`Dose for ${medicineName} marked as Missed.`, 'error');
    refreshActiveView();
  }

  function handleSkipDose(doseId, medicineName) {
    DoseTracker.markDoseStatus(doseId, 'skipped', 'Skipped by user');
    showToast(`Dose for ${medicineName} marked as Skipped.`, 'info');
    refreshActiveView();
  }

  function handleUndoDose(doseId) {
    DoseTracker.markDoseStatus(doseId, 'pending');
    showToast('Dose reset to scheduled status.', 'info');
    refreshActiveView();
  }

  function deleteHistoryLog(doseId) {
    if (confirm('Delete this history record?')) {
      DoseTracker.deleteDoseLog(doseId);
      showToast('Record deleted.', 'info');
      renderDoseHistory();
      renderReports();
    }
  }

  // Add / Edit Medicine Modals
  function openAddMedicineModal() {
    document.getElementById('medicineFormModalTitle').textContent = 'Add New Medicine';
    document.getElementById('medicineForm').reset();
    document.getElementById('editMedicineId').value = '';
    
    // Set default times container with 1 time input
    setMedicineTimesContainer(['08:00']);
    document.getElementById('medStartDate').value = StorageManager.getTodayString();

    openModal('medicineModal');
  }

  function openEditMedicineModal(medicineId) {
    const med = StorageManager.getMedicines().find(m => m.id === medicineId);
    if (!med) return;

    document.getElementById('medicineFormModalTitle').textContent = 'Edit Medicine';
    document.getElementById('editMedicineId').value = med.id;
    document.getElementById('medName').value = med.name;
    document.getElementById('medDosage').value = med.dosage;
    document.getElementById('medType').value = med.type;
    document.getElementById('medFrequency').value = med.frequency;
    document.getElementById('medInstructions').value = med.instructions;
    document.getElementById('medStartDate').value = med.startDate || '';
    document.getElementById('medEndDate').value = med.endDate || '';
    document.getElementById('medNotes').value = med.specialNotes || '';
    document.getElementById('medColor').value = med.color || 'blue';

    setMedicineTimesContainer(med.times || ['08:00']);
    openModal('medicineModal');
  }

  function setMedicineTimesContainer(times = ['08:00']) {
    const container = document.getElementById('medicineTimesInputsList');
    if (!container) return;

    container.innerHTML = times.map((t, idx) => `
      <div class="time-input-group" data-index="${idx}">
        <input type="time" class="form-input time-picker-input" value="${t}" required>
        ${times.length > 1 ? `<button type="button" class="btn-icon text-danger" onclick="this.parentElement.remove()" title="Remove time">&times;</button>` : ''}
      </div>
    `).join('');
  }

  function addAnotherTimeInput() {
    const container = document.getElementById('medicineTimesInputsList');
    if (!container) return;

    const group = document.createElement('div');
    group.className = 'time-input-group';
    group.innerHTML = `
      <input type="time" class="form-input time-picker-input" value="12:00" required>
      <button type="button" class="btn-icon text-danger" onclick="this.parentElement.remove()" title="Remove time">&times;</button>
    `;
    container.appendChild(group);
  }

  function confirmDeleteMedicine(medId, medName) {
    const confirmModal = document.getElementById('deleteConfirmModal');
    if (!confirmModal) {
      if (confirm(`Are you sure you want to delete ${medName}? This will remove it from future reminders.`)) {
        StorageManager.deleteMedicine(medId);
        showToast(`${medName} was deleted.`, 'info');
        refreshActiveView();
      }
      return;
    }

    document.getElementById('deleteMedConfirmName').textContent = medName;
    document.getElementById('btnConfirmDeleteSubmit').onclick = () => {
      StorageManager.deleteMedicine(medId);
      closeModal('deleteConfirmModal');
      showToast(`${medName} was deleted.`, 'info');
      refreshActiveView();
    };
    openModal('deleteConfirmModal');
  }

  // Refresh active view
  function refreshActiveView() {
    const activeView = document.querySelector('.view-section.active');
    if (!activeView) return;

    const viewId = activeView.id;
    if (viewId === 'viewDashboard') renderDashboard();
    else if (viewId === 'viewMedicines') renderMedicines();
    else if (viewId === 'viewTracker') renderTracker();
    else if (viewId === 'viewReminders') renderReminders();
    else if (viewId === 'viewReports') renderReports();
    else if (viewId === 'viewSettings') renderSettings();
  }

  function formatFrequency(freq) {
    const map = {
      once_daily: 'Once a day',
      twice_daily: 'Twice a day',
      three_daily: '3 times a day',
      four_daily: '4 times a day',
      every_other_day: 'Every other day',
      as_needed: 'As needed'
    };
    return map[freq] || 'Daily';
  }

  return {
    ICONS,
    showToast,
    openModal,
    closeModal,
    getTypeIcon,
    applyThemeSettings,
    updateLiveHeader,
    renderDashboard,
    renderMedicines,
    renderTracker,
    renderDoseHistory,
    renderReports,
    renderReminders,
    renderSettings,
    handleTakeDose,
    handleMissedDose,
    handleSkipDose,
    handleUndoDose,
    deleteHistoryLog,
    openAddMedicineModal,
    openEditMedicineModal,
    setMedicineTimesContainer,
    addAnotherTimeInput,
    confirmDeleteMedicine,
    refreshActiveView,
    formatFrequency
  };
})();

window.UI = UI;


/* ==========================================================================
   MODULE: js/app.js
   ========================================================================== */

/**
 * MediTrack - Main Application Entry & Controller
 * Connects data, UI events, navigation, modals, and user settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Storage with realistic sample data if first load
  StorageManager.initializeStorage();

  // 2. Apply theme and accessibility preferences (font scaling, high contrast)
  UI.applyThemeSettings();

  // 3. Start Live Header Clock
  UI.updateLiveHeader();
  setInterval(UI.updateLiveHeader, 1000);

  // 4. Initialize Reminder Engine (ticker & notifications)
  ReminderEngine.init();

  // 5. Initialize Navigation Controller
  setupNavigation();

  // 6. Setup Form Listeners & Validation
  setupMedicineForm();
  setupSettingsForm();
  setupManualLogForm();
  setupFilterListeners();
  setupModalDismissListeners();

  // 7. Initial View Render (Dashboard)
  UI.renderDashboard();

  // 8. Listen for global storage changes to keep UI synchronized
  window.addEventListener('meditrack_data_changed', (e) => {
    UI.refreshActiveView();
  });
});

// Setup Navigation & View Switching
function setupNavigation() {
  const navButtons = document.querySelectorAll('[data-view-target]');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = btn.getAttribute('data-view-target');
      switchView(targetViewId);
    });
  });

  // Handle browser back/forward or hash changes if any
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const viewMap = {
        'dashboard': 'viewDashboard',
        'medicines': 'viewMedicines',
        'tracker': 'viewTracker',
        'reminders': 'viewReminders',
        'reports': 'viewReports',
        'settings': 'viewSettings'
      };
      if (viewMap[hash]) switchView(viewMap[hash]);
    }
  });
}

function switchView(viewId) {
  // Update view containers
  const views = document.querySelectorAll('.view-section');
  views.forEach(v => {
    if (v.id === viewId) {
      v.classList.add('active');
    } else {
      v.classList.remove('active');
    }
  });

  // Update active states on nav items (both sidebar and mobile bottom nav)
  const navButtons = document.querySelectorAll('[data-view-target]');
  navButtons.forEach(btn => {
    if (btn.getAttribute('data-view-target') === viewId) {
      btn.classList.add('active');
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
    }
  });

  // Trigger specific view rendering
  if (viewId === 'viewDashboard') {
    UI.renderDashboard();
  } else if (viewId === 'viewMedicines') {
    UI.renderMedicines();
  } else if (viewId === 'viewTracker') {
    UI.renderTracker();
  } else if (viewId === 'viewReminders') {
    UI.renderReminders();
  } else if (viewId === 'viewReports') {
    UI.renderReports();
  } else if (viewId === 'viewSettings') {
    UI.renderSettings();
  }

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Play subtle feedback click
  if (window.SoundManager) window.SoundManager.playClick();
}

// Medicine Add / Edit Form Handling
function setupMedicineForm() {
  const form = document.getElementById('medicineForm');
  const freqSelect = document.getElementById('medFrequency');

  // Dynamically configure default times based on frequency selection
  if (freqSelect) {
    freqSelect.addEventListener('change', () => {
      const freq = freqSelect.value;
      if (freq === 'once_daily') {
        UI.setMedicineTimesContainer(['08:00']);
      } else if (freq === 'twice_daily') {
        UI.setMedicineTimesContainer(['08:00', '20:00']);
      } else if (freq === 'three_daily') {
        UI.setMedicineTimesContainer(['08:00', '14:00', '20:00']);
      } else if (freq === 'four_daily') {
        UI.setMedicineTimesContainer(['08:00', '12:00', '16:00', '20:00']);
      } else {
        UI.setMedicineTimesContainer(['09:00']);
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect values
      const editId = document.getElementById('editMedicineId').value;
      const name = document.getElementById('medName').value.trim();
      const dosage = document.getElementById('medDosage').value.trim();
      const type = document.getElementById('medType').value;
      const frequency = document.getElementById('medFrequency').value;
      const instructions = document.getElementById('medInstructions').value;
      const startDate = document.getElementById('medStartDate').value;
      const endDate = document.getElementById('medEndDate').value;
      const specialNotes = document.getElementById('medNotes').value.trim();
      const color = document.getElementById('medColor').value;

      // Collect times
      const timeInputs = form.querySelectorAll('.time-picker-input');
      const times = [];
      timeInputs.forEach(input => {
        if (input.value && !times.includes(input.value)) {
          times.push(input.value);
        }
      });

      // Validation
      if (!name) {
        UI.showToast('Please enter the medicine name.', 'error');
        document.getElementById('medName').focus();
        return;
      }

      if (!dosage) {
        UI.showToast('Please specify the dosage (e.g. 500mg, 1 tablet).', 'error');
        document.getElementById('medDosage').focus();
        return;
      }

      if (times.length === 0) {
        UI.showToast('Please select at least one medication time.', 'error');
        return;
      }

      if (endDate && startDate && endDate < startDate) {
        UI.showToast('End date cannot be earlier than start date.', 'error');
        return;
      }

      const medData = {
        name,
        dosage,
        type,
        frequency,
        times: times.sort(),
        startDate,
        endDate,
        instructions,
        specialNotes,
        color
      };

      if (editId) {
        StorageManager.updateMedicine(editId, medData);
        UI.showToast(`Updated ${name} successfully!`, 'success');
      } else {
        StorageManager.addMedicine(medData);
        UI.showToast(`Added ${name} to your schedule!`, 'success');
      }

      UI.closeModal('medicineModal');
      UI.refreshActiveView();
      if (window.SoundManager) window.SoundManager.playSuccessChime();
    });
  }
}

// Settings Form Handling
function setupSettingsForm() {
  const saveBtn = document.getElementById('btnSaveSettings');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const userName = document.getElementById('settingsUserName').value.trim();
      const userAge = parseInt(document.getElementById('settingsUserAge').value, 10) || null;
      const doctorName = document.getElementById('settingsDoctorName').value.trim();
      const doctorPhone = document.getElementById('settingsDoctorPhone').value.trim();
      const emergencyContact = document.getElementById('settingsEmergencyContact').value.trim();

      const time12Checked = document.getElementById('timeFormat12').checked;
      const timeFormat = time12Checked ? '12h' : '24h';

      const soundEnabled = document.getElementById('settingsSoundToggle').checked;
      const notificationsEnabled = document.getElementById('settingsNotifToggle').checked;

      let fontSize = 'normal';
      if (document.getElementById('fontLarge').checked) fontSize = 'large';
      if (document.getElementById('fontXLarge').checked) fontSize = 'xlarge';

      const highContrast = document.getElementById('settingsHighContrast').checked;

      const updatedSettings = {
        userName: userName || 'Robert Davis',
        userAge,
        doctorName,
        doctorPhone,
        emergencyContact,
        timeFormat,
        soundEnabled,
        notificationsEnabled,
        fontSize,
        highContrast
      };

      StorageManager.saveSettings(updatedSettings);
      UI.applyThemeSettings();
      UI.updateLiveHeader();
      UI.showToast('Settings saved successfully!', 'success');
      if (window.SoundManager) window.SoundManager.playClick();
    });
  }

  // Load Demo Data Button
  const btnLoadDemo = document.getElementById('btnLoadDemoData');
  if (btnLoadDemo) {
    btnLoadDemo.addEventListener('click', () => {
      if (confirm('Load sample medicine schedule and demo history? This will refresh your data with realistic demonstration records.')) {
        StorageManager.initializeStorage(true);
        UI.applyThemeSettings();
        UI.updateLiveHeader();
        UI.showToast('Sample medication schedule loaded!', 'success');
        UI.refreshActiveView();
        if (window.SoundManager) window.SoundManager.playSuccessChime();
      }
    });
  }

  // Export Data Button
  const btnExport = document.getElementById('btnExportData');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const dataStr = StorageManager.exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditrack_backup_${StorageManager.getTodayString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      UI.showToast('Medication data exported successfully!', 'success');
    });
  }

  // Import Data File Input
  const fileImportInput = document.getElementById('fileImportInput');
  const btnImportTrigger = document.getElementById('btnImportDataTrigger');

  if (btnImportTrigger && fileImportInput) {
    btnImportTrigger.addEventListener('click', () => {
      fileImportInput.click();
    });

    fileImportInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = StorageManager.importData(event.target.result);
        if (result.success) {
          UI.applyThemeSettings();
          UI.updateLiveHeader();
          UI.showToast(`Imported ${result.count} medicines successfully!`, 'success');
          UI.refreshActiveView();
        } else {
          UI.showToast(`Import failed: ${result.error}`, 'error');
        }
        fileImportInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Clear All Data Button
  const btnClearAll = document.getElementById('btnClearAllData');
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (confirm('Are you sure you want to completely erase all medicines and dose records? This action cannot be undone.')) {
        StorageManager.clearAllData();
        UI.showToast('All application data cleared.', 'info');
        UI.refreshActiveView();
      }
    });
  }
}

// Manual Dose Logging Form
function setupManualLogForm() {
  const form = document.getElementById('manualLogForm');
  const openBtn = document.getElementById('btnOpenManualLog');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const medSelect = document.getElementById('manualLogMedSelect');
      medSelect.innerHTML = '';
      const medicines = StorageManager.getMedicines().filter(m => m.active);

      if (medicines.length === 0) {
        UI.showToast('Please add medicines first before logging doses.', 'error');
        return;
      }

      medicines.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.name} (${m.dosage})`;
        medSelect.appendChild(opt);
      });

      document.getElementById('manualLogDate').value = StorageManager.getTodayString();
      const now = new Date();
      document.getElementById('manualLogTime').value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      document.getElementById('manualLogNotes').value = '';

      UI.openModal('manualLogModal');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const medicineId = document.getElementById('manualLogMedSelect').value;
      const date = document.getElementById('manualLogDate').value;
      const time = document.getElementById('manualLogTime').value;
      const status = document.getElementById('manualLogStatus').value;
      const notes = document.getElementById('manualLogNotes').value.trim();

      if (!medicineId || !date || !time) {
        UI.showToast('Please fill out all required fields.', 'error');
        return;
      }

      DoseTracker.addManualDoseLog({ medicineId, date, time, status, notes });
      UI.closeModal('manualLogModal');
      UI.showToast('Dose record logged successfully!', 'success');
      UI.renderDoseHistory();
      UI.renderReports();
      if (window.SoundManager) window.SoundManager.playSuccessChime();
    });
  }
}

// Search & Filter listeners
function setupFilterListeners() {
  // Medicine search & type filter
  const searchInput = document.getElementById('medicineSearchInput');
  const typeFilter = document.getElementById('medicineTypeFilter');

  if (searchInput) searchInput.addEventListener('input', () => UI.renderMedicines());
  if (typeFilter) typeFilter.addEventListener('change', () => UI.renderMedicines());

  // Tracker Period Filter Buttons
  const periodButtons = document.querySelectorAll('.period-filter-btn');
  periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      UI.renderTracker();
    });
  });

  // History filters
  const rangeFilter = document.getElementById('historyRangeFilter');
  const statusFilter = document.getElementById('historyStatusFilter');
  const medFilter = document.getElementById('historyMedicineFilter');

  if (rangeFilter) rangeFilter.addEventListener('change', () => UI.renderDoseHistory());
  if (statusFilter) statusFilter.addEventListener('change', () => UI.renderDoseHistory());
  if (medFilter) medFilter.addEventListener('change', () => UI.renderDoseHistory());
}

// Close modals on Esc or backdrop click
function setupModalDismissListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        activeModal.setAttribute('aria-hidden', 'true');
      }
    }
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  });
}


