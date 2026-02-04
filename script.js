import { signUp, signIn, signOut, getCurrentUser, getUserProfile, getUserSubscription, onAuthStateChange, supabase } from './auth.js';

let currentUser = null;
let currentProfile = null;
let currentSubscription = null;
let isGateOpen = false;

document.addEventListener('DOMContentLoaded', async () => {
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const authStatus = document.getElementById('auth-status');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');

    onAuthStateChange(async (event, session) => {
        if (session?.user) {
            currentUser = session.user;
            await loadUserData();
            showDashboard();
        } else {
            currentUser = null;
            currentProfile = null;
            currentSubscription = null;
            showAuth();
        }
    });

    showSignupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        signupForm.classList.add('active');
        clearErrors();
    });

    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.remove('active');
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginForm.classList.add('active');
        clearErrors();
    });

    loginBtn?.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            showError(loginError, 'נא למלא את כל השדות');
            return;
        }

        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'מתחבר...';
            await signIn(email, password);
        } catch (error) {
            console.error('Login error:', error);
            showError(loginError, error.message || 'שגיאה בהתחברות');
            loginBtn.disabled = false;
            loginBtn.textContent = 'כניסה';
        }
    });

    signupBtn?.addEventListener('click', async () => {
        const name = document.getElementById('signup-name').value;
        const phone = document.getElementById('signup-phone').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        if (!name || !email || !password || !phone) {
            showError(signupError, 'נא למלא את כל השדות');
            return;
        }

        if (password.length < 6) {
            showError(signupError, 'הסיסמה חייבת להכיל לפחות 6 תווים');
            return;
        }

        try {
            signupBtn.disabled = true;
            signupBtn.textContent = 'נרשם...';
            await signUp(email, password, name, phone);
            authStatus.textContent = 'ההרשמה הושלמה! מתחבר...';
            authStatus.style.color = 'var(--success)';
        } catch (error) {
            console.error('Signup error:', error);
            showError(signupError, error.message || 'שגיאה בהרשמה');
            signupBtn.disabled = false;
            signupBtn.textContent = 'הרשמה';
        }
    });

    logoutBtn?.addEventListener('click', async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    function showError(element, message) {
        if (element) {
            element.textContent = message;
            setTimeout(() => {
                element.textContent = '';
            }, 5000);
        }
    }

    function clearErrors() {
        loginError.textContent = '';
        signupError.textContent = '';
        authStatus.textContent = '';
    }

    async function loadUserData() {
        try {
            currentProfile = await getUserProfile(currentUser.id);
            currentSubscription = await getUserSubscription(currentUser.id);

            updateUserUI();

            if (currentProfile?.role === 'admin') {
                await loadAdminData();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    function updateUserUI() {
        const usernameEl = document.querySelector('.username');
        const userPlanEl = document.getElementById('user-plan');
        const adminNavBtn = document.getElementById('admin-nav-btn');
        const avatarEl = document.querySelector('.avatar');

        if (currentProfile) {
            if (usernameEl) usernameEl.textContent = currentProfile.full_name;
            if (avatarEl) {
                avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.full_name)}&background=D4AF37&color=000`;
            }
        }

        if (currentSubscription) {
            if (userPlanEl) userPlanEl.textContent = currentSubscription.plan.toUpperCase();
        }

        if (adminNavBtn && currentProfile?.role === 'admin') {
            adminNavBtn.style.display = 'block';
        }
    }

    async function loadAdminData() {
        try {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (!profilesError && profiles) {
                document.getElementById('total-users').textContent = profiles.length;
                renderAdminUsers(profiles);
            }

            const { data: properties, error: propertiesError } = await supabase
                .from('properties')
                .select('*');

            if (!propertiesError && properties) {
                document.getElementById('total-properties').textContent = properties.length;
            }

            const { data: events, error: eventsError } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (!eventsError && events) {
                const today = new Date().toDateString();
                const todayEvents = events.filter(e => new Date(e.created_at).toDateString() === today);
                document.getElementById('total-events').textContent = todayEvents.length;
                renderAdminEvents(events.slice(0, 10));
            }

            const { data: subscriptions, error: subsError } = await supabase
                .from('subscriptions')
                .select('*');

            if (!subsError && subscriptions) {
                const active = subscriptions.filter(s => s.status === 'active').length;
                document.getElementById('active-subscriptions').textContent = active;

                const coreCount = subscriptions.filter(s => s.plan === 'core').length;
                const signatureCount = subscriptions.filter(s => s.plan === 'signature').length;
                const eliteCount = subscriptions.filter(s => s.plan === 'elite').length;

                document.getElementById('core-count').textContent = coreCount;
                document.getElementById('signature-count').textContent = signatureCount;
                document.getElementById('elite-count').textContent = eliteCount;
            }

        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    function renderAdminUsers(users) {
        const usersList = document.getElementById('admin-users-list');
        if (!usersList) return;

        usersList.innerHTML = users.map(user => `
            <div class="user-item">
                <span>${user.full_name}</span>
                <span style="color: var(--gold); font-size: 0.85rem;">${user.role}</span>
            </div>
        `).join('');
    }

    function renderAdminEvents(events) {
        const eventsList = document.getElementById('admin-events-list');
        if (!eventsList) return;

        if (events.length === 0) {
            eventsList.innerHTML = '<p class="loading-text">אין אירועים</p>';
            return;
        }

        eventsList.innerHTML = events.map(event => `
            <div class="event-item">
                <span>${event.message}</span>
                <span style="color: var(--text-muted); font-size: 0.85rem;">
                    ${new Date(event.created_at).toLocaleTimeString('he-IL')}
                </span>
            </div>
        `).join('');
    }

    function showAuth() {
        authScreen.classList.remove('hidden');
        authScreen.classList.add('active');
        dashboardScreen.classList.remove('active');
        dashboardScreen.classList.add('hidden');
    }

    function showDashboard() {
        authScreen.classList.remove('active');
        authScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
        dashboardScreen.classList.add('active');

        addLog("כניסת משתמש: " + (currentProfile?.full_name || 'משתמש'));
    }

    const btnOpen = document.getElementById('btn-open');
    const btnClose = document.getElementById('btn-close');
    const gateVisual = document.querySelector('.gate-visual');
    const gateStatusLabel = document.getElementById('gate-status');
    const logList = document.getElementById('log-list');

    btnOpen?.addEventListener('click', () => {
        if (isGateOpen) return;
        setGateState('opening');
    });

    btnClose?.addEventListener('click', () => {
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
            }, 3000);
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

    function addLog(message) {
        if (!logList) return;

        const li = document.createElement('li');
        li.className = 'log-item';

        const now = new Date();
        const timeString = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

        li.innerHTML = `
            <span>${message}</span>
            <span class="log-time">${timeString}</span>
        `;

        logList.prepend(li);

        if (logList.children.length > 10) {
            logList.removeChild(logList.lastChild);
        }
    }

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

    const navBtns = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            viewSections.forEach(v => {
                v.classList.remove('active');
                v.classList.add('hidden');
            });

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.remove('hidden');
                targetView.classList.add('active');
            }

            if (targetId === 'admin-view' && currentProfile?.role === 'admin') {
                loadAdminData();
            }
        });
    });

    const planButtons = document.querySelectorAll('.select-plan');
    planButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!currentUser) {
                alert('נא להתחבר כדי לבחור תוכנית');
                return;
            }

            const planCard = e.target.closest('.pricing-card');
            const planName = planCard.querySelector('h3').textContent.toLowerCase();

            const originalText = e.target.textContent;
            e.target.textContent = "מעדכן...";
            e.target.style.background = "var(--gold)";
            e.target.style.color = "#000";

            try {
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        plan: planName,
                        status: 'active'
                    })
                    .eq('user_id', currentUser.id);

                if (error) throw error;

                currentSubscription = await getUserSubscription(currentUser.id);
                updateUserUI();

                e.target.textContent = "נבחר בהצלחה";
                e.target.style.background = "var(--success)";
                e.target.style.color = "#fff";

                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = "";
                    e.target.style.color = "";
                }, 2000);

                addLog(`תוכנית עודכנה ל: ${planName.toUpperCase()}`);
            } catch (error) {
                console.error('Error updating plan:', error);
                e.target.textContent = "שגיאה";
                e.target.style.background = "var(--danger)";
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = "";
                    e.target.style.color = "";
                }, 2000);
            }
        });
    });

    const cameras = document.querySelectorAll('.cam-feed');
    cameras.forEach((cam, index) => {
        const scanOverlay = cam.querySelector('.scan-overlay');
        if (scanOverlay) {
            scanOverlay.style.animationDelay = `${index * 0.7}s`;
        }
    });

    const sensorItems = document.querySelectorAll('.sensor-item');
    setInterval(() => {
        if (Math.random() > 0.85 && dashboardScreen.classList.contains('active')) {
            const randomSensor = sensorItems[Math.floor(Math.random() * sensorItems.length)];
            randomSensor.style.transform = 'scale(1.02)';
            randomSensor.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.2)';

            setTimeout(() => {
                randomSensor.style.transform = 'scale(1)';
                randomSensor.style.boxShadow = 'none';
            }, 800);
        }
    }, 5000);

    const gateLeft = document.querySelector('.gate-left');
    const gateRight = document.querySelector('.gate-right');

    setInterval(() => {
        if (isGateOpen) {
            const intensity = 0.3 + Math.random() * 0.2;
            if (gateLeft) gateLeft.style.boxShadow = `0 0 30px rgba(48, 207, 85, ${intensity})`;
            if (gateRight) gateRight.style.boxShadow = `0 0 30px rgba(48, 207, 85, ${intensity})`;
        } else {
            if (gateLeft) gateLeft.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)';
            if (gateRight) gateRight.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)';
        }
    }, 1000);

    addLog("מערכת הופעלה מחדש");
    addLog("בדיקת חיישנים הושלמה");
});
