import puppeteer from 'puppeteer';
export default class opgg_scraper {
    constructor(user) {
        this.user = user;
    }


    async getStats(user, region, refresh) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`https://${region}.op.gg/summoner/userName=${user}`)
            await page.waitForSelector('div.GameItemList');
            await page.waitForTimeout(1000);
            await page.click('#right_gametype_soloranked');
            await page.waitForTimeout(1000);
            await page.waitForSelector('div.GameItemList');

            if (refresh === true) {
                await page.click('#SummonerRefreshButton')
                await page.waitForSelector('div.GameItemList')
            } else { }
            const fetchWins = await page.$$('div.Win');
            const fetchLoses = await page.$$('div.Lose');
            const name = await page.$$('span.Name', e => e[1].innerText);
            const level = await page.$eval('.Level', e => e.innerText);
            const rank = await page.$eval('.TierRank', e => e.innerText);
            const pdl = await page.$eval('.LeaguePoints', e => e.innerText);
            const main = await page.$$eval('.PositionStatContent .Name', e => e[0].innerHTML);
            const mainChampion = await page.$$eval('.MostChampionContent .ChampionName', e => e[0].innerText);
            const winrate = await page.$eval('#GameAverageStatsBox-matches div.Text', e => e.innerText);
            const lastTime = await page.$$eval('.TimeStamp ._timeago', e => e[0].innerText);
            const image = await page.$eval('img.ProfileImage', e => e.src);

            const stats = {
                'Name': name,
                'Level': level,
                'ProfilePic': image,
                'LastMatches': fetchWins.length + fetchLoses.length,
                'Wins': fetchWins.length,
                'Loses': fetchLoses.length,
                'Rank': rank,
                'RankedLP': pdl,
                'WinRate': winrate,
                'MainLane': main,
                'MainChampion': mainChampion,
                'LastTimeOnline': lastTime
            }
            await browser.close();
            return stats
        } catch (e) {
            return console.log(`Player not found. This player may not exist on the this region.
            Ctrl+C to quit 
            `)
        }

    }
}
