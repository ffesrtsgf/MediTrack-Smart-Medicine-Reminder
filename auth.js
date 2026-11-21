/**
 * MediTrack – Authentication & User Management Module
 * College Demonstration Authentication using Web Crypto API (SHA-256) and LocalStorage.
 * 
 * IMPORTANT DEMONSTRATION NOTICE:
 * This module is designed for academic / educational demonstrations.
 * In production systems, passwords should never be verified solely in client-side code,
 * and authentication must be handled server-side using secure password hashing 
 * algorithms (such as Argon2id or bcrypt) with HTTP-only cookies and CSRF protection.
 */

const AuthManager = (() => {
  const STORAGE_KEYS = {
    USERS: 'meditrack_users',
    CURRENT_USER: 'meditrack_current_user',
    REMEMBERED_EMAIL: 'meditrack_remembered_email'
  };

  const DEFAULT_SALT = 'meditrack_edu_salt_2026_';

  // Seed default demonstration user
  const DEFAULT_USER = {
    id: 'user_robert_davis',
    name: 'Robert Davis',
    email: 'robert.davis@example.com',
    // SHA-256 hash of "meditrack_edu_salt_2026_Password123!"
    passwordHash: '8e62f2423ffb55859dde27f2d44f437bd797da5f1a7db8f300eca35820f3a05c',
    age: 68,
    createdAt: new Date('2026-01-15T08:00:00Z').toISOString()
  };

  /**
   * Hashes a password using the browser's native Web Crypto API (SHA-256).
   * Does NOT store passwords in plain text.
   */
  async function hashPassword(password) {
    const salted = DEFAULT_SALT + password;
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(salted);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for environments lacking crypto.subtle
      let hash = 0;
      for (let i = 0; i < salted.length; i++) {
        const char = salted.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      return 'fb_' + Math.abs(hash).toString(16);
    }
  }

  /**
   * Retrieve all registered users from LocalStorage.
   */
  function getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      if (!Array.isArray(users) || users.length === 0) {
        // Initialize with default demo user
        const initial = [DEFAULT_USER];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
        return initial;
      }
      return users;
    } catch {
      const initial = [DEFAULT_USER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
  }

  /**
   * Save users list to LocalStorage.
   */
  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  /**
   * Get currently active logged-in user session.
   */
  function getCurrentUser() {
    try {
      const current = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return current ? JSON.parse(current) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set currently active logged-in user session.
   */
  function setCurrentUser(user) {
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age || null,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionData));

    // Also synchronize user name with meditrack_settings so the dashboard greeting is personalized
    try {
      const settings = JSON.parse(localStorage.getItem('meditrack_settings') || '{}');
      settings.userName = user.name;
      if (user.age) settings.userAge = user.age;
      localStorage.setItem('meditrack_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not sync name to settings:', e);
    }

    return sessionData;
  }

  /**
   * Register a new user.
   * Performs validation, duplicate email check, and password hashing.
   */
  async function registerUser({ name, email, password, age = null }) {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Validation
    if (!cleanName || cleanName.length < 2) {
      throw new Error('Please enter your full name (minimum 2 characters).');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address (e.g. name@example.com).');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = getUsers();

    // Prevent duplicate email registration
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in instead.');
    }

    // Cryptographic hashing (demonstration)
    const passwordHash = await hashPassword(password);

    const newUser = {
      id: 'user_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash: passwordHash,
      age: age ? parseInt(age, 10) : null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Automatically create session
    setCurrentUser(newUser);

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };
  }

  /**
   * Log in an existing user.
   */
  async function loginUser(email, password, rememberMe = false) {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No account found with this email. Please check your spelling or register.');
    }

    // Hash the input password and compare with stored hash
    const inputHash = await hashPassword(password);

    if (inputHash !== user.passwordHash) {
      throw new Error('Incorrect password. Please verify your password and try again.');
    }

    // Remember email preference
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, cleanEmail);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }

    // Establish active session
    const session = setCurrentUser(user);

    return {
      success: true,
      user: session
    };
  }

  /**
   * Log out currently authenticated user.
   */
  function logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.href = 'login.html?logout=true';
  }

  /**
   * Get remembered email address if user previously checked "Remember me".
   */
  function getRememberedEmail() {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) || '';
  }

  /**
   * Route Guard for Protected Pages (Dashboard / index.html).
   * Redirects to login.html if not authenticated.
   */
  function requireAuth() {
    const current = getCurrentUser();
    if (!current) {
      // Store current page in sessionStorage so we can return after login if needed
      window.location.replace('login.html');
      return false;
    }
    return true;
  }

  /**
   * Route Guard for Auth Pages (login.html, register.html).
   * Redirects to dashboard if already authenticated.
   */
  function redirectIfLoggedIn() {
    const current = getCurrentUser();
    if (current) {
      window.location.replace('index.html');
      return true;
    }
    return false;
  }

  return {
    hashPassword,
    getUsers,
    getCurrentUser,
    setCurrentUser,
    registerUser,
    loginUser,
    logoutUser,
    getRememberedEmail,
    requireAuth,
    redirectIfLoggedIn,
    DEFAULT_USER
  };
})();

// Expose globally
window.AuthManager = AuthManager;
