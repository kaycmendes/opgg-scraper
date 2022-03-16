const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin());





exports.getStats = async (user, region, refresh) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const context = browser.defaultBrowserContext();
        context.overridePermissions(`https://${region}.op.gg`, ["geolocation", "notifications"]);
        const page = await browser.newPage();
        if( region === 'kr'){
             await page.goto(`https://www.op.gg/summoner/userName=${user}`)
        }else{
             await page.goto(`https://${region}.op.gg/summoner/userName=${user}`)
        }

        if (refresh === true) {
            
            await page.click('.ejbh9aw1') //update button
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.waitForSelector('exlvoq30').catch(() => { return "player haven't played recently" }) //game list
            await page.waitForTimeout(2000);
        } else { }

        await page.waitForTimeout(1000);
        await page.click('button[value="SOLORANKED"]');
        await page.waitForTimeout(2000);


        const wins = await page.$eval('span.win', e => e.innerText).catch(() => { return 'unknown' })
        const loses = await page.$eval('span.lose', e => e.innerText).catch(() => { return 'unknown' })
        const level = await page.$eval('.level', e => e.innerText);
        const kda = await page.$eval('.css-1mznf9n table td.kda .k-d-a', e => e.innerText).catch(() => { return 'no kd' })
        const kdaRatio = await page.$eval('.kda-ratio', e => e.textContent).catch(() => { return 'unknown' })
        const rank = await page.$eval('.tier-rank', e => e.innerText).catch(() => { return 'unranked' })
        const pdl = await page.$eval('span.lp', e => e.innerText).catch(() => { return 'unknown' })
        await page.waitForTimeout(1000);
        const main = await page.$eval('.position-stats', e => e.children[0].children[0].children[1].children[0].innerText).catch(() => { return 'unraked' })
        const mainChampion =await page.$eval("div.champion-box .info .name", e => e.innerText).catch(() => { return 'unknown' })
        const winrate = await page.$eval('.chart .text', e => e.innerText).catch(() => { return 'none' })
        const lastTime = await page.$eval('.e19epo2o2 .info div.time-stamp', e => e.innerText).catch(() => { return 'inactive player' })
        const image = await page.$eval('.profile-icon img', e => e.src);

        const stats = {
            'Name': user,
            'Level': level,
            'ProfilePic': image,
            'LastMatches': wins.length + loses.length,
            'Wins': wins.length,
            'Loses': loses.length,
            'Rank': rank,
            'KDA': kda,
            'KDARatio': kdaRatio,
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
