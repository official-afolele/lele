# Panduan Integrasi Google Apps Script & Google Sheets
## Undangan Pernikahan Jaka, S.Kom & Harinurdian, S.E (Dian)

Script ini digunakan untuk menghubungkan formulir **Ucapan & RSVP** serta **Daftar Tamu** dari website undangan pernikahan langsung ke **Google Spreadsheet**. Setiap tamu yang mengisi ucapan akan otomatis tercatat sebagai baris baru di Spreadsheet Anda secara *real-time*.

---

### Langkah-langkah Pemasangan (2 Menit):

1. **Buka Google Sheets**
   - Akses [https://sheets.google.com](https://sheets.google.com) dan buat dokumen spreadsheet baru.
   - Beri nama spreadsheet, contohnya: `Buku Tamu Undangan Jaka & Dian`.

2. **Buka Editor Apps Script**
   - Di menu atas Spreadsheet, klik **Ekstensi (Extensions)** > **Apps Script**.

3. **Tempelkan Script**
   - Hapus semua tulisan di file `Code.gs`.
   - Buka file `google-apps-script/Code.gs` dari proyek ini, salin seluruh kodenya, lalu tempelkan (paste) ke editor Apps Script.
   - Klik tombol **Simpan** (ikon disket atau `Ctrl + S`).

4. **Terapkan Sebagai Aplikasi Web (Deploy as Web App)**
   - Klik tombol biru **Terapkan (Deploy)** di pojok kanan atas > pilih **Penerapan Baru (New Deployment)**.
   - Klik ikon **Gear ⚙️** di samping *"Pilih jenis"*, lalu pilih **Aplikasi Web (Web App)**.
   - Isi formulir konfigurasi:
     - **Deskripsi**: `Undangan Pernikahan Jaka & Dian`
     - **Jalankan sebagai (Execute as)**: `Saya (email Anda)`
     - **Siapa yang memiliki akses (Who has access)**: **`Siapa saja (Anyone)`** *(Wajib dipilih agar website undangan dapat mengirim data tanpa login)*.
   - Klik tombol **Terapkan (Deploy)**.

5. **Beri Izin Akses (Authorize Access)**
   - Google akan menampilkan jendela persetujuan izin akses.
   - Klik **Beri Akses (Review Permissions)**.
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik tautan kecil bertuliskan **Lanjutan (Advanced)** di bawah.
   - Klik tautan **Buka project (tidak aman) / Go to project (unsafe)**.
   - Klik tombol biru **Izinkan (Allow)**.

6. **Salin URL Aplikasi Web**
   - Salin **URL Aplikasi Web** yang berakhiran `/exec` (misalnya: `https://script.google.com/macros/s/AKfycbx.../exec`).

7. **Hubungkan ke Website Undangan**
   - Buka Admin Panel website undangan (`/admin`).
   - Masuk ke tab **📊 Google Sheets & Script**.
   - Tempelkan URL Aplikasi Web tersebut di kolom yang disediakan.
   - Klik **Simpan URL**, lalu klik **Uji Koneksi** dan **Sinkronkan Data Sekarang**.

Selesai! Sekarang semua ucapan dan RSVP yang dikirim tamu akan otomatis tersimpan ganda: di server website dan di Google Sheets Anda.
