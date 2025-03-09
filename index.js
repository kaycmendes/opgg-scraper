import { chromium } from 'playwright';

/**
 * Fetches League of Legends player statistics from U.GG
 * @param {string} user - Summoner name with tag (e.g., 'God#777')
 * @param {string} region - Server region (e.g., 'na', 'euw', 'kr')
 * @param {boolean} refresh - Whether to refresh the stats
 * @returns {Object} Player statistics
 */
async function getStats(user, region, refresh = false) {
  let browser;
  try {
    // Parse summoner name and tagline
    let summonerName, tagline;
    if (user.includes('#')) {
      [summonerName, tagline] = user.split('#');
    } else {
      summonerName = user;
      tagline = '';
    }
    
    // Format tagline for URL if present
    const formattedUser = tagline ? `${summonerName}-${tagline}` : summonerName;
    
    // Launch the browser with appropriate executable path
    browser = await chromium.launch({
      headless: true, // Run headless for cleaner output
      executablePath: getBrowserExecutablePath(),
    });

    // Create a new context with permissions
    const context = await browser.newContext({
      permissions: ['geolocation', 'notifications'],
    });
    
    const page = await context.newPage();

    // Format region for U.GG (e.g., "na" becomes "na1" excluding "kr")
    const uggRegion = region.endsWith('1') || region === 'kr' ? region : `${region}1`;
    const url = `https://u.gg/lol/profile/${uggRegion}/${formattedUser.toLowerCase()}/overview`;
    
    await page.goto(url);

    // Handle the consent popup
    await page.locator('button.fc-button.fc-cta-consent.fc-primary-button').click()
  

    // Extract the data
    const result = await scrapeUGG(page, user, region, refresh);
    await browser.close();
    return result;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { error: error.message };
  } finally {
    // Ensure browser is closed
    if (browser) await browser.close();
  }

  /**
   * Scrapes player data from U.GG using the specific selectors provided
   * @param {Page} page - Playwright page
   * @param {string} user - Summoner name
   * @param {string} region - Server region
   * @param {boolean} refresh - Whether to refresh the stats
   * @returns {Object} Player statistics
   */
  async function scrapeUGG(page, user, region, refresh) {
    try {
      // If refresh requested, click the refresh button (if available)
      if (refresh) {
        await page.locator('.summoner-profile_update-button').click()
          .catch(() => {/* Ignore if button not found */});
        await page.waitForTimeout(3000);
      }
      
      // Extract username with the exact selector
      const name = await page.evaluate(() => {
        const usernameElement = document.querySelector('#content > div > div.content-side-padding.w-full.max-w-\\[1016px\\].mx-auto.md\\:box-content > div > div > div.pt-\\[24px\\] > div.flex.items-end.flex-1 > div.flex.flex-col.justify-between.flex-1.ml-\\[24px\\].max-xs\\:ml-\\[12px\\].min-w-0 > div.mb-\\[8px\\].flex.items-center.overflow-hidden > div.flex.items-end.font-\\[\\\'Barlow\\\'\\].text-\\[36px\\].font-semibold.overflow-hidden.max-xs\\:text-\\[20px\\] > span.leading-\\[normal\\].max-w-\\[20ch\\].truncate');
        return usernameElement ? usernameElement.textContent.trim() : "unknown";
      });
      
      // Extract level with the exact selector
      const level = await page.evaluate(() => {
        const levelElement = document.querySelector('#content > div > div.content-side-padding.w-full.max-w-\\[1016px\\].mx-auto.md\\:box-content > div > div > div.pt-\\[24px\\] > div.flex.items-end.flex-1 > div.relative.flex-none.w-\\[93px\\].h-\\[93px\\].max-xs\\:w-\\[75px\\].max-xs\\:h-\\[75px\\].rounded-\\[6px\\].border-\\[2px\\].border-lavender-400.bg-\\[\\#17172e\\] > div.absolute.z-\\[2\\].top-\\[-16px\\].left-\\[50\\%\\].translate-x-\\[-50\\%\\].flex.items-center.justify-center.w-\\[36px\\].h-\\[20px\\].rounded-\\[4px\\].border-\\[1px\\].border-lavender-400.bg-\\[\\#06061f\\].text-white.text-\\[11px\\].font-bold');
        return levelElement ? levelElement.textContent.trim() : "unknown";
      });
      
      // Extract rank with the rank-title selector
      const rank = await page.evaluate(() => {
        const rankElement = document.querySelector('.rank-title');
        return rankElement ? rankElement.textContent.trim() : "unknown";
      });
      
      // Extract LP with the updated selector
      const lp = await page.evaluate(() => {
        const selector = '#content > div > div.content-side-padding.w-full.max-w-\\[1016px\\].mx-auto.md\\:box-content > div > div > div.summoner-profile_overview.w-\\[1016px\\].mt-\\[24px\\] > div.summoner-profile_overview__side > div.rank-block > div > div:nth-child(1) > div > div.rank-sub-content > div.text-container > div.rank-text > span:nth-child(2)';
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : "unknown";
      });
      
      // Get wins and losses using the updated selector
      const winsLosses = await page.evaluate(() => {
        // Using the updated selector for wins/losses
        const element = document.querySelector('#content > div > div.content-side-padding.w-full.max-w-\\[1016px\\].mx-auto.md\\:box-content > div > div > div.summoner-profile_overview.w-\\[1016px\\].mt-\\[24px\\] > div.summoner-profile_overview__side > div.rank-block > div > div:nth-child(1) > div > div.rank-sub-content > div.text-container > div.rank-wins > span.total-games');
        return element ? element.textContent.trim() : "unknown";
      });
      
      // Parse wins and losses
      let wins = "unknown";
      let loses = "unknown";
      let winrate = "unknown";
      
      if (winsLosses !== "unknown") {
        // Try a more flexible regex that can handle different formats
        const winMatch = winsLosses.match(/(\d+)\s*W/i);
        const loseMatch = winsLosses.match(/(\d+)\s*L/i);
        
        if (winMatch) wins = winMatch[1];
        if (loseMatch) loses = loseMatch[1];
        
        // Extract win rate percentage
        const winrateMatch = winsLosses.match(/(\d+)%/);
        if (winrateMatch) {
          winrate = winrateMatch[1] + "%";
        } else if (wins !== "unknown" && loses !== "unknown") {
          // Calculate if not directly available
          const totalGames = parseInt(wins) + parseInt(loses);
          if (totalGames > 0) {
            winrate = Math.round((parseInt(wins) / totalGames) * 100) + "%";
          }
        }
      }
      
      // Extract main champion
      const mainChampion = await page.evaluate(() => {
        // Using XPath for favorite champion
        const xpath = '/html/body/div[2]/div/div[3]/div[2]/div/div/div[1]/div/div[2]/div/div/div[4]/div[1]/div[2]/div[2]/div[1]/div/div[2]/div[1]/div[1]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element ? element.textContent.trim() : "unknown";
      });
      
      // Get KDA
      const kda = await page.evaluate(() => {
        // Using XPath for KDA
        const xpath = '/html/body/div[2]/div/div[3]/div[2]/div/div/div[1]/div/div[2]/div/div/div[4]/div[2]/div/div[2]/div/div[1]/div[3]/div[1]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element ? element.textContent.trim() : "unknown";
      });
      
      // Get last time online using the selector
      const lastTime = await page.evaluate(() => {
        const selector = '#content > div > div.content-side-padding.w-full.max-w-\\[1016px\\].mx-auto.md\\:box-content > div > div > div.summoner-profile_overview.w-\\[1016px\\].mt-\\[24px\\] > div.summoner-profile_overview__main > div > div:nth-child(3) > div > div.match-summary.match-summary_desktop.match_win.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div.content-container > div.group-one > div.row-one > div.from-now';
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : "unknown";
      });
      
      // Get profile image with the selector
      const image = await page.evaluate(() => {
        const selector = '#content > div > div.content-side-padding.w-full.max-w-\\[1016px\\].mx-auto.md\\:box-content > div > div > div.pt-\\[24px\\] > div.flex.items-end.flex-1 > div.relative.flex-none.w-\\[93px\\].h-\\[93px\\].max-xs\\:w-\\[75px\\].max-xs\\:h-\\[75px\\].rounded-\\[6px\\].border-\\[2px\\].border-lavender-400.bg-\\[\\#17172e\\] > div.relative.w-full.h-full.rounded-\\[4px\\].border-\\[2px\\].border-\\[\\#17172e\\].overflow-hidden > img';
        const imgElement = document.querySelector(selector);
        return imgElement ? imgElement.getAttribute('src') : null;
      });
      
      // Compile and return the extracted data
      return {
        name,
        level,
        rank,
        wins,
        loses,
        winrate,
        lp,
        mainChampion,
        kda,
        lastTime,
        image
      };
    } catch (error) {
      console.error("Error in UGG scraping:", error);
      throw error;
    }
  }

  /**
   * Determines the Chrome executable path based on the operating system
   * @returns {string|null} Path to Chrome executable
   */
  function getBrowserExecutablePath() {
    const defaultPaths = {
      linux: "/usr/bin/chromium",
      darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      win32: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      win64: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      arm64: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    };

    const platform = process.platform;
    if (defaultPaths.hasOwnProperty(platform)) {
      return defaultPaths[platform];
    } else {
      console.error(`Platform "${platform}" is not supported.`);
      return null;
    }
  }
}

export default getStats;
