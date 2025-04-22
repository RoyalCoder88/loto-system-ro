const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const monthMap = {
  "Ianuarie": "01", "Februarie": "02", "Martie": "03", "Aprilie": "04",
  "Mai": "05", "Iunie": "06", "Iulie": "07", "August": "08",
  "Septembrie": "09", "Octombrie": "10", "Noiembrie": "11", "Decembrie": "12"
};

const jocuri = {
  loto649: 'https://www.loto49.ro/extragere-loto.php',
  noroc: 'https://www.loto49.ro/rezultate-noroc.php',
  loto540: 'https://www.loto49.ro/rezultate-loto5din40.php',
  norocplus: 'https://www.loto49.ro/rezultate-norocplus.php',
  supernoroc: 'https://www.loto49.ro/rezultate-supernoroc.php',
  joker: 'https://www.loto49.ro/rezultate-joker.php'
};

function parseDate(rawTitle) {
  const match = rawTitle.match(/(Luni|Marți|Miercuri|Joi|Vineri|Sâmbătă|Duminică)[,]? (\d{1,2}) ([^\s]+) (\d{4})/i);
  if (!match) return null;
  const [, , zi, lunaRo, an] = match;
  const luna = monthMap[lunaRo];
  return `${an}-${luna}-${zi.padStart(2, '0')}`;
}

function extractNumbers(text) {
  return text
    .replace(/\s+/g, '')
    .split(',')
    .map(n => parseInt(n))
    .filter(n => !isNaN(n));
}

(async () => {
  const rezultate = {};

  for (const [cheie, url] of Object.entries(jocuri)) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      let latestDate = '2000-01-01';
      let result = {
        date: '',
        numbers: [],
        categories: [],
        total_fund: ''
      };

      $('h2').each((_, el) => {
        const titlu = $(el).text().trim();
        const dataParsed = parseDate(titlu);
        if (!dataParsed || dataParsed <= latestDate) return;

        const numbersText = $(el).next('p').text().trim();
        const numbers = extractNumbers(numbersText);

        const table = $(el).nextAll('table').first();
        const categories = [];

        table.find('tr').slice(1).each((_, row) => {
          const cols = $(row).find('td').map((_, td) => $(td).text().trim()).get();
          if (cols.length >= 3) {
            categories.push({
              category: cols[0],
              winners: cols[1],
              prize: cols[2],
              report: cols[3] || ''
            });
          }
        });

        const fundText = $(el).nextAll('p').last().text();
        const total_fund = fundText.split(':').pop()?.trim() || '';

        // update final
        latestDate = dataParsed;
        result = {
          date: dataParsed,
          numbers,
          categories,
          total_fund
        };
      });

      rezultate[cheie] = result;
      console.log(`✅ ${cheie} salvat: ${result.date}`);
    } catch (err) {
      console.error(`❌ Eroare la ${cheie}:`, err.message);
    }
  }

  fs.writeFileSync('toate-extragerile.json', JSON.stringify(rezultate, null, 2), 'utf8');
  console.log('📦 toate-extragerile.json generat cu succes!');
})();
