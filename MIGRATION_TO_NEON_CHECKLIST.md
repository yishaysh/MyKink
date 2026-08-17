# 🐘 מדריך וצ'קליסט מעבר מ-Supabase ל-Neon.tech (5 הפרויקטים שלך)

מדריך זה מרכז את כל השלבים, קובצי ה-SQL המקוריים, ופקודות הטרמינל המדויקות להעברת 5 הפרויקטים שלך ל-**[Neon.tech](https://neon.tech)**.

> 🌐 **לוח מעקב אינטראקטיבי בדפדפן:**  
> מומלץ לפתוח ישירות בדפדפן את [`Migration_Dashboard.html`](file:///c:/Users/yishay.shavlev/Desktop/Private%20Projects/MyKink/Migration_Dashboard.html) – כולל כפתורי "העתק פקודה" בלחיצה אחת וסרגלי התקדמות חיים שנשמרים אוטומטית!

---

## 📋 שלב 0: הקמת חשבון כללי ב-Neon.tech (חד-פעמי)
- [ ] כניסה ל-[Neon.tech](https://neon.tech) והרשמה מהירה באמצעות GitHub.
- [ ] וידוא שהחשבון מוגדר במסלול ה-Free (כולל Connection Pooling חינמי ו-Scale to Zero).

---

## 🎯 1. פרויקט: `MyKink`
📁 נתיב: `C:\Users\yishay.shavlev\Desktop\Private Projects\MyKink`

- [ ] **1. יצירת DB ב-Neon:** פתח פרויקט בשם `MyKink` (Region: `Frankfurt eu-central-1`, Postgres 16).
- [ ] **2. שמירת ה-Connection Strings:** עדכן את `server/.env`:
  ```env
  DATABASE_URL="postgres://[USER]:[PASSWORD]@[HOST]-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
  DIRECT_URL="postgres://[USER]:[PASSWORD]@[HOST].eu-central-1.aws.neon.tech/neondb?sslmode=require"
  ```
- [ ] **3. דחיפת סכמת ה-Prisma בטרמינל:**
  ```powershell
  cd "C:\Users\yishay.shavlev\Desktop\Private Projects\MyKink\server"
  npx prisma db push
  npx prisma generate
  ```
- [ ] **4. עדכון משתנים ב-Vercel ו-Redeploy:** עדכן את `DATABASE_URL` ב-Vercel Settings ובצע Redeploy.

---

## 🎯 2. פרויקט: `ayala-simply-delicious`
📁 נתיב: `C:\Users\yishay.shavlev\Desktop\Private Projects\ayala-simply-delicious`

- [ ] **1. יצירת DB ב-Neon:** פתח פרויקט בשם `ayala-simply-delicious` ב-Neon.
- [ ] **2. הרצת קובץ הסכמה המקומי `supabase_schema.sql`:**
  * פתח את הקובץ: `ayala-simply-delicious\supabase_schema.sql`
  * העתק את כל תוכנו והדבק ב-**Neon SQL Editor** ➔ לחץ **Run**.
- [ ] **3. עדכון קובץ `.env.local` המקומי:**
  ```env
  DATABASE_URL="postgres://[USER]:[PASSWORD]@[HOST]-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
  ```
- [ ] **4. עדכון משתנים ב-Vercel ו-Redeploy:** עדכן את `DATABASE_URL` ב-Vercel Settings.

---

## 🎯 3. פרויקט: `RivkaLapid`
📁 נתיב: `C:\Users\yishay.shavlev\Desktop\Private Projects\RivkaLapid`

- [ ] **1. יצירת DB ב-Neon:** פתח פרויקט בשם `RivkaLapid` ב-Neon.
- [ ] **2. הרצת קובצי ה-SQL המקומיים ב-Neon SQL Editor לפי הסדר:**
  1. `RivkaLapid\supabase-schema.sql` (מבנה הטבלאות)
  2. `RivkaLapid\supabase-upgrade.sql` (שדרוגי עמודות ואינדקסים)
  3. `RivkaLapid\seed-demo-data.sql` (אופציונלי - נתוני הדגמה)
- [ ] **3. עדכון קובץ `.env` המקומי:**
  ```env
  DATABASE_URL="postgres://[USER]:[PASSWORD]@[HOST]-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
  ```
- [ ] **4. עדכון משתנים ב-Vercel ו-Redeploy:** עדכן את משתנה הסביבה ב-Vercel ובדוק את האתר.

---

## 🎯 4. פרויקט: `YuvalStudio`
📁 נתיב: `C:\Users\yishay.shavlev\Desktop\Private Projects\YuvalStudio`

- [ ] **1. יצירת DB ב-Neon:** פתח פרויקט בשם `YuvalStudio` ב-Neon.
- [ ] **2. הרצת קובץ המיגרציה המלא `db_full_migration_safe.sql`:**
  * פתח את הקובץ: `YuvalStudio\db_full_migration_safe.sql`
  * העתק את כל תוכנו והדבק ב-**Neon SQL Editor** ➔ לחץ **Run**.
- [ ] **3. עדכון קובץ `.env` המקומי:**
  ```env
  DATABASE_URL="postgres://[USER]:[PASSWORD]@[HOST]-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
  ```
- [ ] **4. עדכון משתנים ב-Vercel ו-Redeploy:** ביצוע Redeploy ב-Vercel ווידוא פעילות האתר.

---

## 🎯 5. פרויקט: `ai-research-app`
📁 נתיב: `C:\PrivateProjects\ai-research-app`

- [ ] **1. יצירת DB ב-Neon:** פתח פרויקט בשם `ai-research-app` ב-Neon.
- [ ] **2. עדכון קובץ `.env` המקומי:**
  ```env
  DATABASE_URL="postgres://[USER]:[PASSWORD]@[HOST]-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
  ```
- [ ] **3. סנכרון סכמת הנתונים בטרמינל:**
  ```powershell
  cd "C:\PrivateProjects\ai-research-app"
  npx prisma db push
  npx prisma generate
  ```
- [ ] **4. עדכון משתני פרודקשן ב-Vercel ו-Redeploy.**
