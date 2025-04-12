const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const games = {
  loto649: 'https://www.loto49.ro/extragere-loto.php',
  joker: 'https://www.loto49.ro/rezultate-joker.php',
  noroc: 'https://www.loto49.ro/rezultate-noroc.php',
  loto540: 'https://www.loto49.ro/rezultate-loto5din40.php',
  norocplus: 'https://www.loto49.ro/rezultate-norocplus.php',
  supernoroc: 'https://www.loto49.ro/rezultate-supernoroc.php',
};

const monthMap = {
  Ianuarie: '01', Februarie: '02', Martie: '03', Aprilie: '04',
  Mai: '05', Iunie: '06', Iulie: '07', August: '08',
  Septembrie: '09', Octombrie: '10', Noiembrie: '11', Decembrie: '12',
};

const extractGameData = async (url, gameName) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let game = {
      date: '',
      numbers: [],
      categories: [],
      total_fund: ''
    };

    $('h2').each((index, el) => {
      const title = $(el).text().trim();
      const numbersRaw = $(el).next('p').text().trim();

      const matchDate = title.match(/(\d{1,2}) ([^\s]+) (\d{4})/);
      if (!matchDate) return;

      const zi = matchDate[1];
      const lunaRo = matchDate[2];
      const anul = matchDate[3];
      const parsedDate = `${anul}-${monthMap[lunaRo]}-${zi.padStart(2, '0')}`;
      game.date = parsedDate;

      // Numere
      game.numbers = numbersRaw.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

      // Tabel premii
      const table = $(el).nextAll('table').first();
      table.find('tr').slice(1).each((i, row) => {
        const cols = $(row).find('td').map((i, td) => $(td).text().trim()).get();
        if (cols.length >= 4) {
          game.categories.push({
            category: cols[0].match(/\((.*?)\)/)?.[1] || cols[0],
            winners: cols[1],
            prize: cols[2],
            report: cols[3],
          });
        }
      });

      // Fond total
      const lastP = $(el).nextAll('p').last().text().trim();
      if (lastP.toLowerCase().includes('încasat') || lastP.toLowerCase().includes('fond')) {
        game.total_fund = lastP;
      }
    });

    return game;
  } catch (err) {
    console.error(`❌ Eroare la ${gameName}:`, err.message);
    return null;
  }
};

(async () => {
  let results = {};

  for (const [game, url] of Object.entries(games)) {
    console.log(`🔍 Extragem ${game}...`);
    const gameData = await extractGameData(url, game);
    results[game] = gameData || {};
  }

  fs.writeFileSync('toate-extragerile.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('✅ toate-extragerile.json salvat cu succes!');
})();
