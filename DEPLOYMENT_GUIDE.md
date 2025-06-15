# Panduan Deployment ke Vercel

## Permasalahan yang Sudah Diperbaiki

### 1. Konflik App Router vs Pages Router
- ✅ Menghapus folder `pages/` yang menyebabkan konflik dengan `app/` directory
- ✅ Next.js sekarang menggunakan App Router secara konsisten

### 2. Konfigurasi Next.js
- ✅ Memperbaiki `next.config.js` untuk mengganti `experimental.serverComponentsExternalPackages` dengan `serverExternalPackages`
- ✅ Menambahkan konfigurasi Vercel yang tepat di `vercel.json`

### 3. Environment Variables
- ✅ Membuat `.env.example` sebagai template
- ✅ Menambahkan `.gitignore` yang komprehensif

## Langkah Deployment ke Vercel

### 1. Persiapkan Environment Variables
Tambahkan variabel berikut di Vercel Dashboard → Settings → Environment Variables:

```
GOOGLE_APPS_SCRIPT_URL=your_google_apps_script_url_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

### 2. Deploy ke Vercel
1. Push semua perubahan ke GitHub repository
2. Connect repository ke Vercel
3. Vercel akan otomatis mendeteksi Next.js dan menggunakan konfigurasi yang tepat
4. Build command: `next build` (sudah dikonfigurasi)
5. Framework: Next.js (terdeteksi otomatis)

### 3. Struktur Aplikasi yang Sudah Diperbaiki
```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── register/route.ts
│   ├── orders/route.ts
│   └── products/route.ts
├── auth/page.tsx
├── buyer/
│   ├── orders/page.tsx
│   └── page.tsx
├── seller/page.tsx
├── layout.tsx
├── page.tsx
└── globals.css
```

## Catatan Penting
- Aplikasi sekarang menggunakan Next.js App Router secara penuh
- Semua API routes sudah dikonfigurasi dengan benar untuk Vercel
- Environment variables perlu diatur di Vercel Dashboard
- Google Apps Script URL harus valid dan accessible