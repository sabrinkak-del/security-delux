# מבנה מערכת Royal Guard SaaS

## 🖥️ מבנה המערכת (SaaS Architecture)

### Frontend
*   **Web**: React / Next.js לפלטפורמת הניהול והדשבורד.
*   **Mobile**: React Native / Flutter לאפליקציית משתמש הקצה (iOS/Android).
*   **Design System**: עיצוב יוקרתי (Dark Mode, Gold Accents) עם דגש על UX/UI ברמה גבוהה.

### Backend
*   **Core API**: Node.js (NestJS) / Python (FastAPI).
*   **ניהול משתמשים**: ניהול זהויות (Auth0 / Firebase Auth), הרשאות מבוססות תפקידים (RBAC).
*   **ניהול אירועים**: מערכת Real-time (WebSockets) לקבלת התראות ועדכוני סטטוס.

### AI Layer
*   **Computer Vision**: מודלים (YOLO/OpenCV) לניתוח וידאו בזמן אמת.
*   **Behavior Analysis**: זיהוי דפוסים חריגים (שוטטות, טיפוס על גדרות).
*   **Validation**: אימות התראות שווא למניעת הצפות מידע.

### Integrations
*   **Camera Streams**: תמיכה ב-RTSP/ONVIF לחיבור מצלמות IP.
*   **IoT**: חיבור לחיישני תנועה, שערים חכמים, ומערכות אזעקה.
*   **Smart Home**: אינטגרציה עם Home Assistant / Google Home / Apple HomeKit.

### Cloud Infrastructure
*   **Storage**: אחסון וידאו מוצפן (AWS S3 / Google Cloud Storage).
*   **Database**: PostgreSQL (נתונים רלציוניים), Redis (Caching), InfluxDB (Time-series לנתוני חיישנים).
*   **Scaling**: Kubernetes / Docker Swarm לניהול מיקרו-שירותים.

---

## 📊 דשבורד מנהל (Admin)

*   **Global Overview**: מפת חום (Heatmap) של אירועים בזמן אמת.
*   **Asset Status**: סטטוס חיבור ותקינות לכל הנכסים והמצלמות.
*   **Trends Analysis**: גרפים וניתוח מגמות אבטחה לאורך זמן.
*   **User Management**: ניהול לקוחות, הרשאות גישה, ויומני פעילות.
*   **Reports**: ייצוא דוחות תקופתיים (PDF/Excel) ללקוחות.

---

## 🔐 אבטחה וציות (Security & Compliance)

*   **Encryption**: הצפנה מקצה לקצה (E2E) לוידאו ולנתונים רגישים.
*   **GDPR/Privacy**: עמידה בתקני פרטיות מחמירים (הסתרת פנים, מחיקת מידע אוטומטית).
*   **Multi-Tenancy**: הפרדה לוגית מלאה בין נתוני לקוחות שונים.
*   **Audit Logs**: רישום מלא של כל פעולה במערכת לצרכי תחקור ובקרה.

---

## 🧪 MVP חכם (להתחלה)

1.  **חיבור**: תמיכה במצלמת IP אחת (RTSP).
2.  **AI**: זיהוי תנועה חכם (אדם/רכב) עם סינון רעשים בסיסי.
3.  **App**: אפליקציה בסיסית לצפייה ב-Live Feed וקבלת Push Notifications.
4.  **Notifications**: התראות "שקטות" לטלפון.
5.  **Interface**: דשבורד WEB בסיסי למשתמש.

---

## 🚀 Go-To-Market Strategy

*   **Digital Presence**: אתר תדמית יוקרתי עם דמו חי (כפי שנבנה כעת).
*   **Beta Pilot**: גיוס 5 לקוחות יוקרה (וילות/מתחמים) לשימוש חינם תמורת פידבק.
*   **Partnerships**: שיתוף פעולה עם אדריכלי יוקרה וקבלני בתי חכמים.
*   **Upselling**: מודל Freemium/Tiered לפיצ'רים מתקדמים (זיהוי פנים, שמירה בענן).
