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
  Level: '329',
  ProfilePic: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon4073.jpg?image=q_auto:best&v=1518361200',
  LastMatches: 3,
  Wins: 2,
  Loses: 1,
  Rank: 'Master',
  RankedLP: '1 LP ',
  WinRate: '55%',
  MainLane: 'Middle',
  MainChampion: 'Yasuo',
  LastTimeOnline: '21 hours ago'
}
```

## Paramaters
getStats(username: string, region: string, refresh: boolean)


## Regions

na kr oce jp euw eune lan br las ru tr


