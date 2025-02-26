// League of Legends stats scraper for U.GG

import getStats from './index.js';

async function test() {
  try {
    // Get stats and return only the results object
    const results = await getStats('trick2g#na1', 'na', true);
    return results;
  } catch (error) {
    return { error: error.message };
  }
}

// Run and display only the results object
test().then(results => console.log(results));       
