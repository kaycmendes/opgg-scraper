import opgg_scraper from 'opgg-scraper';
const user = new opgg_scraper;
user.getStats('ymrnobody', 'br', false).
    then(stats => console.log(stats))    