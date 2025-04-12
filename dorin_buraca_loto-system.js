const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
  try {
    const { data } = await axios.get('https://www.loto49.ro/extragere-loto.php');
    const $ = cheerio.load(data);

    const monthMap = {
      "Ianuarie": "01", "Februarie": "02", "Martie": "03", "Aprilie": "04",
      "Mai": "05", "Iunie": "06", "Iulie": "07", "August": "08",
      "Septembrie": "09", "Octombrie": "10", "Noiembrie": "11", "Decembrie": "12"
    };

    const jocuri = {
      loto649: {},
      joker: {},
      noroc: {},
      loto540: {},
      norocplus: {},
      supernoroc: {}
    };

    $('h2').each((_, el) => {
      const title = $(el).text().trim();
      const joc = title.toLowerCase();

      let cheie = null;
      if (joc.includes('loto 6/49')) cheie = 'loto649';
      else if (joc.includes('joker')) cheie = 'joker';
      else if (joc.includes('noroc plus')) cheie = 'norocplus';
      else if (joc.includes('noroc') && !joc.includes('plus') && !joc.includes('super')) cheie = 'noroc';
      else if (joc.includes('super noroc')) cheie = 'supernoroc';
      else if (joc.includes('loto 5/40')) cheie = 'loto540';

      if (!cheie) return;

      // Extragem data
      const dateMatch = title.match(/(\d{1,2}) ([^\s]+) (\d{4})/);
      const zi = dateMatch?.[1];
      const luna = dateMatch?.[2];
      const an = dateMatch?.[3];
      const parsedDate = `${an}-${monthMap[luna]}-${zi.padStart(2, '0')}`;

      const section = $(el).nextUntil('h2');

      // Extragem numere
      const numere = [];
      section.find('img[src*="/bile/"]').each((_, img) => {
        const match = $(img).attr('src').match(/\/(\d+)\.png/);
        if (match) numere.push(parseInt(match[1]));
      });

      // Tabel câștiguri
      const categories = [];
      section.find('table').first().find('tr').slice(1).each((_, row) => {
        const cols = $(row).find('td').map((_, td) => $(td).text().trim()).get();
        if (cols.length >= 4) {
          categories.push({
            category: cols[0],
            winners: cols[1],
            prize: cols[2],
            report: cols[3]
          });
        }
      });

      // Fond total
      const fundLine = section.find('p').filter((_, p) =>
        $(p).text().includes('S-au încasat') || $(p).text().includes('Fond total')
      ).last().text().trim();

      // Populăm jocul
      jocuri[cheie] = {
        date: parsedDate,
        numbers: numere,
        categories: categories.length ? categories : undefined,
        total_fund: fundLine || null
      };
    });

    fs.writeFileSync('toate-extragerile.json', JSON.stringify(jocuri, null, 2), 'utf8');
    console.log('✅ toate-extragerile.json salvat cu succes!');
  } catch (err) {
    console.error('❌ Eroare:', err.message);
  }
})();



// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// (async () => {
//   try {
//     const { data } = await axios.get('https://www.loto49.ro/extragere-loto.php');
//     const $ = cheerio.load(data);

//     let result = {
//       date: '',
//       numbers: [],
//       categories: [],
//       total_fund: ''
//     };

//     let latestDate = '2000-01-01'; // inițial, cea mai veche posibilă

//     $('h2').each((_, el) => {
//       const title = $(el).text().trim();

//       if (title.includes("Loto 6/49")) {
//         const dateText = title.split('–')[1]?.trim(); // ex: Joi, 10 Aprilie 2025
//         const match = dateText.match(/(\d{1,2}) ([^\s]+) (\d{4})/);

//         if (!match) return;

//         const [_, zi, lunaRo, anul] = match;

//         const monthMap = {
//           "Ianuarie": "01", "Februarie": "02", "Martie": "03", "Aprilie": "04",
//           "Mai": "05", "Iunie": "06", "Iulie": "07", "August": "08",
//           "Septembrie": "09", "Octombrie": "10", "Noiembrie": "11", "Decembrie": "12"
//         };

//         const parsedDate = `${anul}-${monthMap[lunaRo]}-${zi.padStart(2, '0')}`;

//         if (parsedDate > latestDate) {
//           latestDate = parsedDate;

//           // Resetăm datele
//           result.date = parsedDate;
//           result.numbers = [];
//           result.categories = [];
//           result.total_fund = '';

//           // Numere extrase
//           const numberText = $(el).next('p').text().trim();
//           result.numbers = numberText.split(',').map(n => parseInt(n.trim()));

//           // Tabel premii
//           const table = $(el).nextAll('table').first();
//           table.find('tr').slice(1).each((_, row) => {
//             const cols = $(row).find('td').map((_, td) => $(td).text().trim()).get();
//             result.categories.push({
//               category: cols[0].match(/\((.*?)\)/)?.[1] || '',
//               winners: cols[1],
//               prize: cols[2],
//               report: cols[3]
//             });
//           });

//           // Fond total
//           const fundText = $(el).nextAll('p').last().text();
//           result.total_fund = fundText.split(':').pop().trim();
//         }
//       }
//     });

//     // Salvăm rezultatul
//     fs.writeFileSync('loto-649.json', JSON.stringify(result, null, 2), 'utf8');
//     console.log('✅ JSON salvat cu succes:', result.numbers);
//   } catch (err) {
//     console.error('❌ Eroare:', err.message);
//   }
// })();


