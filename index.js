const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin());





exports.getStats = async (user, region, refresh) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const context = browser.defaultBrowserContext();
        context.overridePermissions(`https://${region}.op.gg`, ["geolocation", "notifications"]);
        const page = await browser.newPage();
        await page.goto(`https://${region}.op.gg/summoner/userName=${user}`)

        if (refresh === true) {
            await page.click('#SummonerRefreshButton')
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.waitForSelector('div.GameItemList')
            await page.waitForTimeout(2000);
        } else { }

        await page.waitForTimeout(1000);
        await page.click('#right_gametype_soloranked');
        await page.waitForTimeout(2000);


        const wins = await page.$eval('span.win', e => e.innerText).catch(() => { return 'unraked' })
        const loses = await page.$eval('span.lose', e => e.innerText).catch(() => { return 'unraked' })
        const level = await page.$eval('.Level', e => e.innerText);
        const rank = await page.$eval('.TierRank', e => e.innerText);
        const pdl = await page.$eval('.LeaguePoints', e => e.innerText).catch(() => { return 'Unranked' })
        const main = await page.$$eval('.PositionStatContent .Name', e => e[0].innerHTML).catch(() => { return 'unraked' })
        const mainChampion = await page.$$eval('.MostChampionContent .ChampionName', e => e[0].innerText).catch(() => { return 'unraked' })
        const winrate = await page.$eval('#GameAverageStatsBox-matches div.Text', e => e.innerText).catch(() => { return 'none' })
        const lastTime = await page.$$eval('.TimeStamp ._timeago', e => e[0].innerText).catch(() => { return 'inactive player' })
        const image = await page.$eval('img.ProfileImage', e => e.src);

        const stats = {
            'Name': user,
            'Level': level,
            'ProfilePic': image,
            'LastMatches': wins.length + loses.length,
            'Wins': wins.length,
            'Loses': loses.length,
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
        console.error(e)
    }

}
