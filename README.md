# 🎰 Loto System RO – Export JSON actualizat

Script Node.js pentru extragerea automată a rezultatelor Loto 6/49, Joker, Noroc, 5/40, Noroc Plus și Super Noroc de pe loto49.ro, în format JSON pentru WordPress sau aplicații externe.

[![Loto JSON Workflow](https://github.com/RoyalCoder88/loto-system-ro/actions/workflows/run-loto.yml/badge.svg)](https://github.com/RoyalCoder88/loto-system-ro/actions)

---

## ⚙️ Rulare locală

```bash
npm install axios cheerio
node dorin_buraca_loto-system.js
```

Va genera:

```bash
📦 toate-extragerile.json
```

Exemplu de structură:

```json
{
  "loto649": {
    "date": "2025-04-19",
    "numbers": [1, 29, 41, 6, 8, 10],
    "categories": [...],
    "total_fund": "La tragerea..."
  },
  "joker": {...},
  ...
}
```

---

## ☁️ Automatizare cu GitHub Actions

Creează fișierul:

```
.github/workflows/run-loto.yml
```

Conținut:

```yaml
name: Update Loto JSON

on:
  schedule:
    - cron: '0 9 * * *' # rulează zilnic la ora 09:00
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

      - name: Commit & push
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add toate-extragerile.json
          git commit -m "🔄 Update toate-extragerile.json"
          git push
```

---

## 🔗 Publicare GitHub Pages

Asigură-te că `toate-extragerile.json` este pe branch-ul `gh-pages` sau într-o locație publică.

Exemplu:

```
https://royalcoder88.github.io/loto-system-ro/toate-extragerile.json
```

---

## 📥 Integrare WordPress

Folosește shortcode-ul:

```php
[loto_latest]
```

Pluginul tău WordPress va prelua datele din:

```
https://royalcoder88.github.io/loto-system-ro/toate-extragerile.json
```

Și va afișa:
- 🔢 numerele extrase
- 📊 tabelul de premii
- 🎯 jocuri filtrabile
- 🎲 generator noroc automat

---

## 🧪 Jocuri disponibile

| Joc          | URL sursă                                             |
|--------------|--------------------------------------------------------|
| Loto 6/49    | https://www.loto49.ro/extragere-loto.php              |
| Joker        | https://www.loto49.ro/rezultate-joker.php             |
| Noroc        | https://www.loto49.ro/rezultate-noroc.php             |
| Loto 5/40    | https://www.loto49.ro/rezultate-loto5din40.php        |
| Noroc Plus   | https://www.loto49.ro/rezultate-norocplus.php         |
| Super Noroc  | https://www.loto49.ro/rezultate-supernoroc.php        |

---

## 🧑‍💻 Autor

**Dorin Buraca** © 2025  
Made with ❤️ pentru România și... noroc 🍀