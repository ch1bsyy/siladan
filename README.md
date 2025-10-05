# SILADAN (Sistem Informasi Layanan dan Aduan)
**Proyek Manajemen Proyek - Kelompok 10**

Selamat datang di repository resmi SILADAN. Proyek ini adalah sistem informasi berbasis web yang dirancang untuk menangani layanan dan aduan secara efisien.

## 🏛️ Struktur Proyek
Repository ini dikelola menggunakan struktur monorepo, di mana kode untuk frontend dan backend berada dalam satu repository utama untuk mempermudah pengelolaan.

- ```/frontend``` - Berisi semua kode yang berkaitan dengan antarmuka pengguna (UI/UX). Dibangun menggunakan React.js, Vite, Tailwind CSS.

- ```/backend``` - Berisi semua kode yang berkaitan dengan logika server, API, dan database. Dibangun menggunakan [sebutkan teknologinya, misal: Node.js, Express].

## 🚀 Aturan Kontribusi & Alur Kerja Git
Untuk menjaga integritas kode dan memastikan kolaborasi berjalan lancar, semua kontributor wajib mengikuti alur kerja berikut.

### Aturan Emas 🥇
1. **Jangan Pernah Push Langsung ke ```main```!** Branch ```main``` dilindungi. Semua perubahan harus melalui *Pull Request*.

2. **Selalu Update Branch ```main``` Lokal Anda.** Sebelum membuat branch baru, pastikan Anda memiliki versi terbaru dari kode.

3. **Bekerja di *Feature Branch.*** Setiap tugas, fitur, atau perbaikan bug harus dikerjakan di branch terpisah.

### Alur Kerja Harian
Berikut adalah langkah-langkah yang harus diikuti setiap kali Anda akan mulai bekerja:

**1. Pindah ke branch ```main``` dan sinkronkan dengan remote.**

**Bash** <br>
```git checkout main``` <br>
```git pull origin main```

**2. Buat branch baru untuk tugas Anda.**

Gunakan penamaan yang deskriptif, contoh: ```feature/halaman-login``` atau ```bugfix/tombol-rusak```.

**Bash** <br>
```git checkout -b nama-branch-anda```

**3. Kerjakan kode Anda.**

Lakukan commit secara berkala dengan pesan yang jelas.

**Bash** <br>
```git add .``` <br>
```git commit -m "feat(frontend): Buat komponen form login"``` <br>

**4. Push branch Anda ke GitHub.**

**Bash** <br>
```git push origin nama-branch-anda``` 

**5. Buat Pull Request (PR).**

Buka repository di GitHub, dan buat Pull Request dari branch Anda menuju branch main. Setelahnya kita akan bersama sama berdiskusi dan melakukan code review.

**6. Gabungkan (Merge) PR.**

Setelah PR disetujui dan lolos semua pemeriksaan, gabungkan ke main melalui antarmuka GitHub.
