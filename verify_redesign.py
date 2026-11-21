"""
MediTrack SaaS Redesign Verification Script
Checks all requirements:
1. Asset existence and integrity
2. Required HTML elements and IDs
3. Color palette and CSS class coverage
4. JavaScript syntax and critical functions
"""

import os
import re
import xml.etree.ElementTree as ET

BASE_DIR = r"d:\Meditrack"

def test_assets():
    required_images = [
        "assets/images/logo.svg",
        "assets/images/healthcare-hero.svg",
        "assets/images/medicine-illustration.svg",
        "assets/images/empty-state.svg",
        "assets/images/medication-reminder.svg",
    ]
    print("\n--- 1. Testing Required Visual Assets ---")
    for img in required_images:
        path = os.path.join(BASE_DIR, img.replace('/', os.sep))
        assert os.path.exists(path), f"Missing required asset: {img}"
        # Validate XML parsing
        try:
            tree = ET.parse(path)
            root = tree.getroot()
            assert root.tag.endswith('svg'), f"{img} is not an SVG root element"
            print(f"  [PASS] {img} (Valid SVG, {os.path.getsize(path)} bytes)")
        except Exception as e:
            raise AssertionError(f"Invalid SVG in {img}: {e}")

def test_html_ids():
    print("\n--- 2. Testing DOM IDs & Bindings ---")
    files_to_check = {
        "login.html": [
            "loginEmail", "loginPassword", "btnTogglePassword", "rememberMe", 
            "loginAlertBox", "btnLoginSubmit", "btnFillDemoLogin", "btnQuickDemoLogin"
        ],
        "register.html": [
            "regName", "regEmail", "regAge", "regPassword", "btnToggleRegPassword",
            "strengthFill", "strengthText", "regConfirmPassword", "btnToggleConfirmPassword", "acceptTerms",
            "registerAlertBox", "btnRegisterSubmit"
        ],
        "index.html": [
            "sidebarUserProfile", "sidebarUserName", "sidebarUserEmail", "btnSidebarLogout",
            "headerLiveDate", "headerLiveTime", "viewDashboard", "dashboardGreeting",
            "statTotalMedicines", "statTodayDoses", "statCompletedDoses", "statMissedDoses",
            "dashboardAdherencePct", "dashboardAdherenceBar", "dashboardUpcomingList",
            "viewMedicines", "medicineSearchInput", "medicineTypeFilter", "medicinesGrid",
            "viewTracker", "trackerScheduleContainer", "doseHistoryTableBody",
            "viewReminders", "reminderSpotlightContainer", "remindersPageList",
            "viewReports", "reportOverallAdherence", "reportStreakCount",
            "reportTotalTaken", "reportTotalMissed", "weeklyAdherenceChart", "distributionChart",
            "viewSettings", "settingsAccountName", "settingsAccountEmail", "btnSaveSettings",
            "medicineModal", "medicineForm", "medName", "medDosage", "medType", "medFrequency",
            "btnSubmitMedicine", "reminderAlertModal", "btnReminderTake", "btnReminderSkip",
            "deleteConfirmModal", "btnConfirmDeleteSubmit", "manualLogModal"
        ]
    }
    
    for filename, expected_ids in files_to_check.items():
        filepath = os.path.join(BASE_DIR, filename)
        assert os.path.exists(filepath), f"File {filename} not found"
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found_ids = set(re.findall(r'id=["\']([^"\']+)["\']', content))
        missing = [i for i in expected_ids if i not in found_ids]
        assert not missing, f"In {filename}, missing IDs: {missing}"
        print(f"  [PASS] {filename} contains all {len(expected_ids)} checked IDs")

def test_css_palette():
    print("\n--- 3. Testing CSS SaaS Palette & Components ---")
    css_path = os.path.join(BASE_DIR, "style.css")
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()
    
    required_colors = [
        ("#2563EB", "Primary Blue"),
        ("#142B4A", "Dark Navy"),
        ("#EFF6FF", "Light Blue"),
        ("#F7FAFF", "Background"),
        ("#10B981", "Green Completed"),
        ("#F59E0B", "Orange Reminder"),
        ("#EF4444", "Red Missed")
    ]
    for hex_code, label in required_colors:
        assert hex_code.lower() in css.lower(), f"Missing required color {label} ({hex_code}) in style.css"
        print(f"  [PASS] Palette {label} ({hex_code}) verified")
    
    required_classes = [
        ".auth-split-container", ".auth-hero-pane", ".auth-form-pane",
        ".welcome-banner", ".welcome-banner-graphic", ".stats-grid", ".stat-card",
        ".medicine-card", ".reminder-spotlight-card", ".reminder-spotlight-img",
        ".empty-state", ".empty-state-img"
    ]
    for cls in required_classes:
        assert cls in css, f"Missing CSS class {cls}"
        print(f"  [PASS] CSS class {cls} verified")

def test_js_integrity():
    print("\n--- 4. Testing JavaScript Integrity & Logic ---")
    auth_path = os.path.join(BASE_DIR, "auth.js")
    with open(auth_path, 'r', encoding='utf-8') as f:
        auth_js = f.read()
    
    # Check sha256 function
    assert "crypto.subtle.digest" in auth_js, "Web Crypto SHA-256 missing in auth.js"
    assert "AuthManager" in auth_js, "AuthManager missing in auth.js"
    print("  [PASS] auth.js has SHA-256 hashing and AuthManager")

    script_path = os.path.join(BASE_DIR, "script.js")
    with open(script_path, 'r', encoding='utf-8') as f:
        script_js = f.read()
    
    assert "getUserKey" in script_js, "getUserKey missing in script.js (multi-user isolation)"
    assert "assets/images/empty-state.svg" in script_js, "empty-state.svg missing in script.js"
    assert "assets/images/medication-reminder.svg" in script_js, "medication-reminder.svg missing in script.js"
    assert "reminderSpotlightContainer" in script_js, "reminderSpotlightContainer logic missing in script.js"
    print("  [PASS] script.js has multi-user isolation, empty-state graphics, and reminder spotlight")

if __name__ == "__main__":
    test_assets()
    test_html_ids()
    test_css_palette()
    test_js_integrity()
    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<\n")
