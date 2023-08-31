## About

A promised based op.gg scraper for League of Legends with a few more data than 
other packages.


## Usage

```javascript
import opggScraper from 'opgg-scraper';

opggScraper('hide on bush', 'kr').
    then(stats => console.log(stats))       
```

## Parameters
- username (string): The League of Legends username to retrieve stats for.
- region (string): The region where the user's account is located (e.g., 'na', 'kr', 'euw', etc.).
- refresh (boolean): Whether to refresh the data, it's set false by default


## Regions

na kr oce jp euw eune lan br las ru tr



```javascript
// Output
  {
  name: 'hide on bush',
  level: '689',
  profilePic: 'https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon6.jpg?image=q_auto,f_png,w_auto&v=1693456151155',
  lastMatches: 14,
  wins: 7,
  loses: 7,
  rank: 'Master',
  kDA: '7.0 / 4.7 / 5.7',
  previousRank: 'S2023 S1 Master, S2022 Diamond 1, S2021 Master',
  rankedLP: '297 LP',
  winRate: '55%',
  mainChampion: 'Tristana',
  lastTimeOnline: '5 hours ago',
  matches: [
    { teamA: [Array], teamB: [Array], result: 'victory' },
    { teamA: [Array], teamB: [Array], result: 'defeat' },
    { teamA: [Array], teamB: [Array], result: 'defeat' },
    { teamA: [Array], teamB: [Array], result: 'victory' },
    { teamA: [Array], teamB: [Array], result: 'victory' }
  ]
}

```

