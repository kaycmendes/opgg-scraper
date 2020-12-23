# About

A promised based op.gg scraper for League of Legends with a few more data than 
other packages.

## Installation

```dash
npm i opgg-scraper
```

After installing it make sure to add the line below to your package.json file next to your file.js
```dash
"type": "module" 
```


## Usage
```javascript
import opgg_scraper from 'opgg-scraper'
const user = new opgg_scraper;
user.getStats('yassuo', 'na', false).
    then(stats => console.log(stats))     
```

```javascript
 ## About

A promised based op.gg scraper for League of Legends with a few more data than 
other packages.

## Installation

```dash
npm i opgg-scraper
```

After installing it make sure to add the line below to your package.json file next to your file.js
```dash
"type": "module" 
```


## Example
```javascript
import opgg_scraper from 'opgg-scraper'
const user = new opgg_scraper;
user.getStats('yassuo', 'na', false).
    then(stats => console.log(stats))   
```  
```javascript

 {
  Name: 'Yassuo',
  Level: '318',
  ProfilePic: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon4832.jpg?image=q_auto:best&v=1518361200',
  LastMatches: 20,
  Wins: 8,
  Loses: 12,
  Rank: 'Diamond 1',
  RankedLP: '79 LP ',
  WinRate: '40%',
  MainLane: 'Middle',
  MainChampion: 'Yasuo',
  LastTimeOnline: '20 hours ago'
}
```

## Paramaters
getStats(username: string, region: string, refresh: boolean)



## Regions

na kr oce jp euw eune lan br las ru tr


