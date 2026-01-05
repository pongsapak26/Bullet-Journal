<div align="center">

# 📓 Bullet Journal

<p>
  <em>จดบันทึกความคิด ติดตามความก้าวหน้า</em>
</p>

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase)

</div>

---

## 🎨 Design Theme

### Color Palette

| Color        | Hex       | Usage                 |
| ------------ | --------- | --------------------- |
| 🟤 **Cream** | `#e3ddc5` | Background หลัก       |
| 🟫 **Brown** | `#543f3f` | Text, Headers, Accent |
| 🟠 **Tan**   | `#ae866c` | Secondary, Borders    |

### Extended Colors

```javascript
// Cream - Background
cream: {
  100: "#f5f3eb",
  200: "#ebe7d8",
  300: "#e3ddc5",  // Primary
  400: "#d4cba8",
}

// Brown - Text & Accent
brown: {
  700: "#5f4c4c",
  800: "#543f3f",  // Primary
  900: "#453636",
}

// Tan - Secondary
tan: {
  400: "#c9a082",
  500: "#ae866c",  // Primary
  600: "#9a7059",
}
```

---

## ✒️ Typography

| Font       | Type       | Usage              |
| ---------- | ---------- | ------------------ |
| **Caveat** | Cursive    | หัวข้อ, ตัวเลขใหญ่ |
| **Nunito** | Sans-serif | เนื้อหาหลัก        |
| **Prompt** | Sans-serif | ข้อความภาษาไทย     |

```css
/* Headers - Handwritten style */
font-family: "Caveat", cursive;

/* Body - Clean & readable */
font-family: "Nunito", sans-serif;

/* Thai text support */
font-family: "Prompt", sans-serif;
```

---

## ✨ Features

- 🔐 **Magic Link Authentication** - Login ง่ายๆ ด้วย Email (Supabase Auth)
- 📅 **Monthly View** - ดูบันทึกตามเดือน/ปี (พ.ศ.)
- 📝 **CRUD Entries** - สร้าง, แก้ไข, ลบบันทึก
- 🖼️ **Image Gallery** - อัปโหลดรูปหลายรูป (Base64, max 5MB)
- 📊 **Statistics** - สรุปความคืบหน้า พร้อมเปอร์เซ็นต์
- 🎯 **Status Tracking** - Todo, In Progress, Done, Cancelled
- 🎨 **Minimal Icons** - ไอคอนสวยๆ ตาม theme สีน้ำตาล

---

## 🎯 Status Icons

| Status      | Icon | Color     | Description    |
| ----------- | ---- | --------- | -------------- |
| Todo        | ○    | `#ae866c` | ยังไม่ได้เริ่ม |
| In Progress | ◐    | `#f59e0b` | กำลังทำ        |
| Done        | ●    | `#22c55e` | เสร็จแล้ว      |
| Cancelled   | ✕    | `#9ca3af` | ยกเลิก         |

---

## 🚀 Tech Stack

```
├── Frontend
│   ├── Next.js 16 (App Router)
│   ├── React 19
│   ├── Tailwind CSS 3
│   └── TypeScript
│
├── Backend
│   ├── Server Actions
│   ├── Prisma ORM
│   └── PostgreSQL (Supabase)
│
└── Auth
    └── Supabase Auth (Magic Link OTP)
```

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/pongsapak26/Bullet-Journal.git
cd Bullet-Journal

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Push database schema
npm run prisma:push

# Run development server
npm run dev
```

---

## ⚙️ Environment Variables

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📁 Project Structure

```
app/
├── actions/          # Server Actions (auth, entries)
├── auth/callback/    # Supabase Auth Callback
├── components/       # Shared Components (Icons, Layout)
├── dashboard/        # Dashboard Pages
│   ├── [year]/[month]/  # Monthly View
│   └── stats/        # Statistics Page
├── entry/[id]/       # Entry Detail & Edit
├── globals.css       # Global Styles & Animations
├── layout.tsx        # Root Layout (Fonts)
└── page.tsx          # Login Page

lib/
├── prisma.ts         # Prisma Client
├── session.ts        # Session Management (1 year expiry)
└── supabase/         # Supabase Clients (client/server)

prisma/
└── schema.prisma     # Database Schema (User, Entry, Image)
```

---

## 🔧 Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:push   # Push schema to database
npm run prisma:studio # Open Prisma Studio
```

---

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add Environment Variables
4. Deploy!

### Required Vercel Environment Variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## 📄 License

MIT License - Free to use and modify

---

<div align="center">

Made with ☕ and 💛

**Bullet Journal** - Your thoughts, organized.

</div>
