# Frontend — React Dashboard

Dashboard Smart Inventory & Demand Prediction. Dibangun dengan **React 19 + Vite 8 (JavaScript)** + React Router + Context + Fetch API.

## Struktur

```
frontend/
├── vite.config.js
└── src/
    ├── main.jsx          # entry point
    ├── App.jsx           # root + router
    ├── components/       # komponen UI (tabel, form, chart, sidebar)
    ├── hooks/            # hooks custom (mis. useAuth)
    └── services/         # modul Fetch API per resource
        ├── auth.js
        ├── products.js
        ├── categories.js
        ├── sales.js
        ├── stock.js
        ├── forecast.js
        └── dashboard.js
```

## Setup

```bash
npm install
```

Buat file `.env.local` dari `.env.example`, lalu:

```bash
npm run dev     # http://localhost:5173
```

Base URL API diambil dari `import.meta.env.VITE_API_BASE_URL` (default `http://localhost:8000/api`).

## Halaman

| Route | Halaman | Akses |
|---|---|---|
| `/login` | Login | Publik |
| `/register` | Register (user pertama → Owner) | Publik |
| `/` | Dashboard (KPI, tren, stok kritis, ringkasan forecast) | Login |
| `/products` | Produk (CRUD) | Login (tulis: Owner) |
| `/categories` | Kategori (CRUD) | Login (tulis: Owner) |
| `/sales` | Penjualan (form multi-item + riwayat) | Login |
| `/stock` | Stok (list + form stok masuk) | Login |
| `/forecast` | Forecast & rekomendasi restock | Login |
| `/settings` | Kelola user (buat staff/admin, ubah role) | Owner |

## Konvensi

- Semua pemanggilan API lewat `src/services/` dengan **Fetch API** (tanpa axios).
- Auth state via Context (`useAuth`); token access disimpan dan di-refresh otomatis.
- UI text dalam Bahasa Indonesia; kode dalam Bahasa Inggris.
- Warna status stok: 🟢 Aman · 🟡 Menipis · 🔴 Kritis.

## Build

```bash
npm run build
```
