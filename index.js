import puppeteer from "puppeteer-extra";

async function getStats(user, region, refresh = false, matchHistory = 1) {
  try {
    console.log("Loading the data...");
    const launchOptions = {
      headless: true,
      executablePath: getBrowserExecutablePath(),
    };
    const browser = await puppeteer.launch(launchOptions);

    const context = browser.defaultBrowserContext();
    context.overridePermissions(`https://${region}.op.gg`, [
      "geolocation",
      "notifications",
    ]);
    const page = await browser.newPage();
    if (region === "kr") {
      await page.goto(`https://www.op.gg/summoner/userName=${user}`);
    } else {
      await page.goto(`https://${region}.op.gg/summoner/userName=${user}`);
    }

    if (refresh === true) {
      await page.click(".e18vylim0"); //update button
      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });
      await page.waitForSelector("e17ux5u10").catch(() => {
        return "player haven't played recently";
      }); //game list
      await page.waitForTimeout(2000);
    } else {
    }

    await page.waitForTimeout(1000);
    await page.click('button[value="SOLORANKED"]');
    await page.waitForTimeout(2000);

    const wins = await page
      .$eval("span.win", (e) => e.innerText)
      .catch(() => {
        return "unknown";
      });
    const loses = await page
      .$eval("span.lose", (e) => e.innerText)
      .catch(() => {
        return "unknown";
      });
    const previousRank = await page
      .$eval(".tier-list", (e) => e.innerText.replace(/\n/g, ", "))
      .catch(() => {
        return "unknown";
      });
    const level = await page.$eval(".level", (e) => e.innerText);
    const kda = await page
      .$eval(".k-d-a", (e) => e.innerText)
      .catch(() => {
        return "no kd";
      });
    const rank = await page
      .$eval(".tier", (e) => e.innerText)
      .catch(() => {
        return "unranked";
      });
    const pdl = await page
      .$eval(".lp", (e) => e.innerText)
      .catch(() => {
        return "unknown";
      });
    await page.waitForTimeout(1000);
    const mainChampion = await page
      .$eval("div.champion-box .info .name", (e) => e.innerText)
      .catch(() => {
        return "unknown";
      });
    const winrate = await page
      .$eval(".chart .text", (e) => e.innerText)
      .catch(() => {
        return "none";
      });
    const lastTime = await page
      .$eval(
        "li.game-item:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)",
        (e) => e.innerText
      )
      .catch(() => {
        return "inactive player";
      });
    const image = await page.$eval(".profile-icon img", (e) => e.src);

    const matches = await page.evaluate((matchHistory, user) => {
        const participantsElements = Array.from(document.querySelectorAll('.participants ul'));
        const resultElements = Array.from(document.querySelectorAll('.result'));
        const participantsData = [];
    
        for (let i = 0; i < participantsElements.length; i += 2) {
            if (i >= matchHistory * 10) {
                break;
            }
    
            const allyElement = participantsElements[i];
            const enemyElement = participantsElements[i + 1];
            const resultElement = resultElements[i / 2];
    
            const allyNameElements = Array.from(allyElement.querySelectorAll('.name a'));
            const allyNicknames = allyNameElements.map(nameElement => nameElement.textContent.trim());
    
            const enemyNameElements = Array.from(enemyElement.querySelectorAll('.name a'));
            const enemyNicknames = enemyNameElements.map(nameElement => nameElement.textContent.trim());
    
            const matchResult = resultElement.textContent.toLowerCase(); // Assuming result is 'WIN' or 'LOSE'
    
            const matchData = {
                teamA: [],
                teamB: [],
                result: matchResult
            };
    
            if (allyNicknames.includes(user)) {
                matchData.teamA = allyNicknames;
                matchData.teamB = enemyNicknames;
            } else {
                matchData.teamA = enemyNicknames;
                matchData.teamB = allyNicknames;
            }
    
            participantsData.push(matchData);
        }
    
        return participantsData;
    }, matchHistory, user);
    
      
      
    const stats = {
      name: user,
      level: level,
      profilePic: image,
      lastMatches: wins.length + loses.length,
      wins: wins.length,
      loses: loses.length,
      rank: rank,
      kDA: kda,
      previousRank: previousRank,
      rankedLP: pdl,
      winRate: winrate,
      mainChampion: mainChampion,
      lastTimeOnline: lastTime,
      matches: matches
    };
    await browser.close();
    return stats;
  } catch (e) {
    console.error(e);
  }

  function getBrowserExecutablePath() {
    const defaultPaths = {
      linux: "/usr/bin/chromium", // Change to the appropriate path on your system
      darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      win32: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    };

    // Check if the current platform is in the defaultPaths object
    const platform = process.platform;
    if (defaultPaths.hasOwnProperty(platform)) {
      return defaultPaths[platform];
    } else {
      // Add additional handling here for platforms that are not in the defaultPaths
      // You can return an appropriate path or provide an error message
      console.error(`Platform "${platform}" is not supported.`);
      return null;
    }
  }
}
export default getStats;
