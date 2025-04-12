# 🎯 Loto System RO

Script Node.js care extrage automat rezultatele pentru Loto 6/49, Joker, Noroc, Loto 5/40, Noroc Plus și Super Noroc din www.loto49.ro, și le salvează într-un fișier JSON pentru afișare publică (ex: pe WordPress).

---

## ⚙️ Rulare locală

```bash
npm install axios cheerio
node dorin_buraca_loto-system.js
```

Fișierul `toate-extragerile.json` va fi generat în directorul curent.

---

## ☁️ Automatizare GitHub Actions

Creează fișierul:  
`.github/workflows/main.yml`  
cu următorul conținut:

```yaml
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

```
https://royalcoder88.github.io/loto-system-ro/toate-extragerile.json
```

---

## 📥 Integrare WordPress

În WordPress poți folosi un shortcode:

```php
[loto_latest]
```

Codul va consuma date din:

```
https://royalcoder88.github.io/loto-system-ro/toate-extragerile.json
```

Recomandăm folosirea unui modul custom care să afișeze grafic și interactiv numerele și premiile.

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