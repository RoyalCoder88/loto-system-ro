# 🎲 Loto System RO – Scraper & JSON Generator

Acest proiect extrage automat ultimele extrageri Loto din România (de pe loto49.ro) și generează un fișier JSON unificat: `toate-extragerile.json`.

---

## 🔍 Jocuri incluse:

- Loto 6/49
- Joker
- Noroc
- Loto 5/40
- Noroc Plus
- Super Noroc

---

## 🧠 Structura fișierului generat (`toate-extragerile.json`)

```json
{
  "loto649": {
    "date": "2025-04-11",
    "numbers": [8, 39, 48, 18, 45, 34],
    "categories": [
      { "category": "6/6", "winners": "REPORT", "prize": "500.000", "report": "1.2 mil" }
    ],
    "total_fund": "S-au încasat 4.000.000 lei..."
  },
  "joker": {
    "date": "...",
    "numbers": [...],
    "categories": [...],
    "total_fund": "..."
  },
  ...
}
