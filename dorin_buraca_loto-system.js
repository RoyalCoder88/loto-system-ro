const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
  try {
    const { data } = await axios.get('https://www.loto49.ro/extragere-loto.php');
    const $ = cheerio.load(data);

    let result = {
      date: '',
      numbers: [],
      categories: [],
      total_fund: ''
    };

    let latestDate = '2000-01-01'; // inițial, cea mai veche posibilă

    $('h2').each((_, el) => {
      const title = $(el).text().trim();

      if (title.includes("Loto 6/49")) {
        const dateText = title.split('–')[1]?.trim(); // ex: Joi, 10 Aprilie 2025
        const match = dateText.match(/(\d{1,2}) ([^\s]+) (\d{4})/);

        if (!match) return;

        const [_, zi, lunaRo, anul] = match;

        const monthMap = {
          "Ianuarie": "01", "Februarie": "02", "Martie": "03", "Aprilie": "04",
          "Mai": "05", "Iunie": "06", "Iulie": "07", "August": "08",
          "Septembrie": "09", "Octombrie": "10", "Noiembrie": "11", "Decembrie": "12"
        };

        const parsedDate = `${anul}-${monthMap[lunaRo]}-${zi.padStart(2, '0')}`;

        if (parsedDate > latestDate) {
          latestDate = parsedDate;

          // Resetăm datele
          result.date = parsedDate;
          result.numbers = [];
          result.categories = [];
          result.total_fund = '';

          // Numere extrase
          const numberText = $(el).next('p').text().trim();
          result.numbers = numberText.split(',').map(n => parseInt(n.trim()));

          // Tabel premii
          const table = $(el).nextAll('table').first();
          table.find('tr').slice(1).each((_, row) => {
            const cols = $(row).find('td').map((_, td) => $(td).text().trim()).get();
            result.categories.push({
              category: cols[0].match(/\((.*?)\)/)?.[1] || '',
              winners: cols[1],
              prize: cols[2],
              report: cols[3]
            });
          });

          // Fond total
          const fundText = $(el).nextAll('p').last().text();
          result.total_fund = fundText.split(':').pop().trim();
        }
      }
    });

    // Salvăm rezultatul
    fs.writeFileSync('loto-649.json', JSON.stringify(result, null, 2), 'utf8');
    console.log('✅ JSON salvat cu succes:', result.numbers);
  } catch (err) {
    console.error('❌ Eroare:', err.message);
  }
})();
