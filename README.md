# BRX Bank Simulation Test

README penuh ini disediakan supaya imej-imej dalam repo `brxbanksimulationtest` akan keluar (render) dengan betul di GitHub. Salin fail ini ke root repositori anda sebagai `README.md` dan pastikan imej-imej dimuat naik ke path yang digunakan di bawah.

---

## Struktur cadangan repositori
Saranan struktur direktori:
- README.md
- /assets
  - screenshot.png
  - logo.png
  - diagrams/flowchart.png

Pastikan semua fail imej ini telah `git add` dan `git commit` ke branch utama (contoh: `main` atau `master`).

---

## Cara menyertakan imej (contoh)

1) Menggunakan path relatif (cara paling mudah dan disyorkan jika imej ada dalam repo)

```markdown
![Tangkapan Skrin Aplikasi](assets/screenshot.png)
```

2) Menggunakan URL `raw.githubusercontent.com` (berguna untuk rujukan dari luar repo atau README di branch lain)

Gantikan `{owner}`, `{repo}` dan `{branch}` dengan nilai sebenar:
```markdown
![Tangkapan Skrin Aplikasi](https://raw.githubusercontent.com/{owner}/{repo}/{branch}/assets/screenshot.png)
```
Contoh:
```markdown
![Tangkapan Skrin Aplikasi](https://raw.githubusercontent.com/Luqman1512/brxbanksimulationtest/main/assets/screenshot.png)
```

3) Mengawal saiz imej (HTML dibenarkan dalam Markdown GitHub)
```html
<img src="assets/screenshot.png" alt="Tangkapan Skrin" width="640" />
```

4) Sesetengah fail besar — gunakan Git LFS
Jika imej terlalu besar (> 5 MB) pertimbangkan untuk gunakan Git LFS:
- Pasang Git LFS: `git lfs install`
- Track imej: `git lfs track "assets/*.png"`
- Commit `.gitattributes` dan push.

---

## Contoh README lengkap dengan beberapa seksyen

```markdown
# BRX Bank Simulation Test

![Logo BRX](assets/logo.png)

Projek ini adalah simulasi ujian untuk BRX Bank — yang mengandungi skrip, konfigurasi dan contoh output. Di bawah adalah beberapa tangkapan skrin dan rajah aliran.

## Tangkapan Skrin
![Main Screen](assets/screenshot.png)

## Rajah Aliran
<img src="assets/diagrams/flowchart.png" alt="Rajah Aliran" width="700" />

## Cara Jalankan
1. Clone repo:
   ```
   git clone https://github.com/{owner}/{repo}.git
   ```
2. Masuk ke folder:
   ```
   cd brxbanksimulationtest
   ```
3. Ikut arahan di folder `docs/` atau fail `CONTRIBUTING.md`.

## Troubleshooting imej tidak keluar
- Pastikan path imej betul (huruf besar / kecil sensitif di Linux).
- Pastikan imej telah di-commit dan di-push ke remote.
- Jika guna path relatif: path mesti tepat relatif kepada lokasi README.md.
- Jika guna `raw.githubusercontent.com`, pastikan `branch` yang betul digunakan (contoh `main`).
- Gunakan inspect element (klik kanan > Inspect) untuk melihat URL sebenar imej yang diminta — buka URL itu terus di browser untuk uji akses.

## Nota
Jika anda mahu saya sediakan versi README dengan path tepat untuk repo anda, hantarkan:
- Nama owner GitHub (contoh `Luqman1512`) atau URL repo penuh,
- Nama branch (contoh `main`),
- Lokasi sebenar imej dalam repo (contoh `assets/screenshot.png`).

```

---

Jika nak saya terus tulis README khusus dengan path imej yang tepat (contoh: gantikan `{owner}` dan `{branch}` automatik), berikan nama owner/URL repo dan branch — saya akan hasilkan README yang siap guna.
