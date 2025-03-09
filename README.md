


## API Reference

### `getStats(user, region, refresh)`


## Usage

```javascript
import getStats from 'opgg-scraper';

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

```
##output
```json
{
  name: 'Trick2g',
  level: '615',
  rank: 'Emerald 2',
  wins: '1',
  loses: '5',
  winrate: '17%',
  lp: '45 LP',
  mainChampion: 'Udyr',
  kda: '1.2 KDA',
  lastTime: '20 days ago',
  image: 'https://static.bigbrain.gg/assets/lol/riot_static/15.4.1/img/profileicon/6075.png'
}
```

Fetches player statistics from U.GG.

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `user` | string | Summoner name with optional tag (e.g., 'PlayerName' or 'PlayerName#123') | - |
| `region` | string | Server region (e.g., 'na', 'euw', 'kr') | - |
| `refresh` | boolean | Whether to refresh the stats before scraping | `false` |

Returns a Promise that resolves to an object containing player statistics.

## Supported Regions

- `na1` - North America
- `euw1` - Europe West
- `eune1` - Europe Nordic & East
- `kr` - Korea
- `br1` - Brazil
- `jp1` - Japan
- `las1` - Latin America South
- `lan1` - Latin America North
- `oce1` - Oceania
- `tr1` - Turkey
- `ru1` - Russia

## Troubleshooting

### Browser Detection Issues

If the scraper fails to find a browser automatically, you can modify the `getBrowserExecutablePath()` function in `index.js` to point to your Chrome/Chromium executable location.

### Selector Changes

U.GG may change their website structure periodically. If the scraper stops working, it might be due to CSS selector changes. Check the console errors and update the selectors in the `scrapeUGG()` function.

# Changelog

## 2.0.0 (2023-07-14)

### Breaking Changes
- Switched from OP.GG to U.GG for data source
- Changed output format structure

### New Features
- Added support for player tags (e.g., PlayerName#123)
- Added profile image URL to output

## Dependencies

- [Playwright](https://playwright.dev/) - Browser automation library

## License

This project is licensed under the MIT License - see the LICENSE file for details.


[![Buy Me a Coffee](https://cdn.ko-fi.com/cdn/kofi2.png?v=3)](https://ko-fi.com/kaycm)