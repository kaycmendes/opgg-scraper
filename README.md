# About

A promised based op.gg scraper for League of Legends with a few more data than 
other packages.


## Usage
```javascript
const opggScraper = require('opgg-scraper');

opggScraper.getStats('yassuo', 'na', false).
    then(stats => console.log(stats))       
```


```javascript
// Output
 {
  Name: 'yassuo',
  Level: '333',
  ProfilePic: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon4073.jpg?image=q_auto:best&v=1518361200',
  LastMatches: 4,
  Wins: 2,
  Loses: 2,
  Rank: 'Master',
  KDA: '2.02:1 KDA',
  KDARatio: '1.82:1',
  RankedLP: '28 LP ',
  WinRate: '50%',
  MainLane: 'Middle',
  MainChampion: 'Yasuo',
  LastTimeOnline: '12 minutes ago'
}
```

## Paramaters
getStats(username: string, region: string, refresh: boolean)


## Regions

na kr oce jp euw eune lan br las ru tr


