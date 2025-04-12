# 🎲 Loto System RO – Scraper & JSON Generator

Acest proiect extrage automat ultimele extrageri Loto din România (de pe loto49.ro) și generează un fișier JSON unificat: `toate-extragerile.json`.

## 🔍 Jocuri incluse:
- Loto 6/49
- Joker
- Noroc
- Loto 5/40
- Noroc Plus
- Super Noroc

## 🧠 Structura fișierului generat (`toate-extragerile.json`)
```json
{
  "loto649": {
    "date": "2025-04-11",
    "numbers": [8, 39, 48, 18, 45, 34],
    "categories": [ ... ],
    "total_fund": "..."
  },
  "joker": { ... },
  ...
}
```

---

## ⚙️ Rulare locală

```bash
npm install axios cheerio
node dorin_buraca_loto-system.js
```

Fișierul `toate-extragerile.json` va fi generat în directorul curent.

---

## ☁️ Automatizare GitHub Actions

Creează fișierul `.github/workflows/main.yml` cu conținutul de mai jos:

```yml
name: Update Loto JSON

on:
  schedule:
    - cron: '0 9 * * *' # rulează zilnic la ora 9:00
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Clonare repo
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Instalare dependențe
        run: npm install

      - name: Rulează scriptul
        run: node dorin_buraca_loto-system.js

      - name: Commit & push JSON
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add toate-extragerile.json
          git commit -m "🔄 Update toate-extragerile.json"
          git push
```

Asigură-te că fișierul `toate-extragerile.json` este în branch-ul `gh-pages` sau publicat la:

```bash
https://royalcoder88.github.io/loto-system-ro/toate-extragerile.json
```

---

## 📥 Integrare WordPress

În site-ul tău WordPress, poți folosi un shortcode pentru a afisa extragerile. Acest shortcode va consuma JSON-ul generat:

```php
[loto_latest]
```

Se va încărca conținutul din:

```bash
https://royalcoder88.github.io/loto-system-ro/toate-extragerile.json
```

---

## 🧑‍💻 Autor

Dorin Buraca © 2025  
Made with ❤️ pentru România și... noroc 🍀
