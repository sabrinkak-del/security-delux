document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const biometricBtn = document.getElementById('biometric-btn');
    const scanner = document.querySelector('.biometric-scanner');
    const statusText = document.querySelector('.status-text');

    const btnOpen = document.getElementById('btn-open');
    const btnClose = document.getElementById('btn-close');
    const gateVisual = document.querySelector('.gate-visual');
    const gateStatusLabel = document.getElementById('gate-status');
    const logList = document.getElementById('log-list');

    // State
    let isGateOpen = false;

    // --- Login Logic ---
    biometricBtn.addEventListener('click', startLogin);
    scanner.addEventListener('click', startLogin);

    function startLogin() {
        if (scanner.classList.contains('scanning')) return;

        scanner.classList.add('scanning');
        statusText.textContent = "סורק טביעת אצבע...";
        statusText.style.color = "#fff";

        setTimeout(() => {
            statusText.textContent = "עיבוד נתונים ביומטריים...";
        }, 1500);

        setTimeout(() => {
            statusText.textContent = "גישה אושרה";
            statusText.style.color = "var(--success)";
            scanner.style.borderColor = "var(--success)";
            scanner.querySelector('i').style.color = "var(--success)";

            setTimeout(() => {
                loginScreen.classList.remove('active');
                loginScreen.classList.add('hidden');
                dashboardScreen.classList.remove('hidden');
                dashboardScreen.classList.add('active');
                addLog("כניסת משתמש: אדון כהן");
            }, 1000);
        }, 3000);
    }

    // --- Gate Logic ---
    btnOpen.addEventListener('click', () => {
        if (isGateOpen) return;
        setGateState('opening');
    });

    btnClose.addEventListener('click', () => {
        if (!isGateOpen) return;
        setGateState('closing');
    });

    function setGateState(action) {
        if (action === 'opening') {
            gateStatusLabel.textContent = "בתהליך פתיחה...";
            gateStatusLabel.className = "status-badge warning";
            gateVisual.classList.add('open');
            addLog("פקודה נשלחה: פתיחת שער ראשי");

            setTimeout(() => {
                isGateOpen = true;
                gateStatusLabel.textContent = "פתוח";
                gateStatusLabel.className = "status-badge open";
                addLog("שער ראשי נפתח בהצלחה");
            }, 3000); // Matches CSS transition
        } else {
            gateStatusLabel.textContent = "בתהליך סגירה...";
            gateStatusLabel.className = "status-badge warning";
            gateVisual.classList.remove('open');
            addLog("פקודה נשלחה: סגירת שער ראשי");

            setTimeout(() => {
                isGateOpen = false;
                gateStatusLabel.textContent = "סגור";
                gateStatusLabel.className = "status-badge closed";
                addLog("שער ראשי נסגר וננעל");
            }, 3000);
        }
    }

    // --- Logger ---
    function addLog(message) {
        const li = document.createElement('li');
        li.className = 'log-item';

        const now = new Date();
        const timeString = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

        li.innerHTML = `
            <span>${message}</span>
            <span class="log-time">${timeString}</span>
        `;

        logList.prepend(li);

        // Keep only last 10 logs
        if (logList.children.length > 10) {
            logList.removeChild(logList.lastChild);
        }
    }

    // --- Random Events Simulator ---
    const randomEvents = [
        "זיהוי תנועה: מצלמה 2 (חניון)",
        "רכב מורשה זוהה: רולס רויס (לוחית 77-777-77)",
        "שירותי ניקיון הגיעו לשער",
        "בדיקת מערכת שגרתית: תקין",
        "טמפרטורת שרתים: אופטימלית",
        "גנן נכנס דרך שער צדדי"
    ];

    setInterval(() => {
        if (Math.random() > 0.7 && dashboardScreen.classList.contains('active')) {
            const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            addLog(event);
        }
    }, 8000);

    // --- Navigation Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and views
            navBtns.forEach(b => b.classList.remove('active'));
            viewSections.forEach(v => {
                v.classList.remove('active');
                v.classList.add('hidden');
            });

            // Add active class to clicked button and target view
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
        });
    });

    // --- Pricing Logic ---
    const planButtons = document.querySelectorAll('.select-plan');
    planButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Animation feedback
            const originalText = e.target.textContent;
            e.target.textContent = "נבחר בהצלחה";
            e.target.style.background = "var(--success)";
            e.target.style.color = "#fff";
            e.target.style.borderColor = "var(--success)";

            setTimeout(() => {
                // Reset button state
                e.target.textContent = originalText;
                e.target.style.background = "";
                e.target.style.color = "";
                e.target.style.borderColor = "";

                // Navigate to Dashboard
                document.getElementById('pricing-view').classList.remove('active');
                document.getElementById('pricing-view').classList.add('hidden');
                document.getElementById('dashboard-view').classList.remove('hidden');
                document.getElementById('dashboard-view').classList.add('active');

                // Update Nav Buttons
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector('[data-target="dashboard-view"]').classList.add('active');

                addLog("מעבר ללוח הבקרה הראשי");
            }, 1500);

            // Log selection
            const planName = e.target.closest('.pricing-card').querySelector('h3').textContent;
            addLog(`לקוח בחר בתוכנית: ${planName}`);
        });
    });

    // Initial Logs
    addLog("מערכת הופעלה מחדש");
    addLog("בדיקת חיישנים הושלמה");
});
