# About

A promised based op.gg scraper for League of Legends with a few more data than 
other packages.

## Installation

```dash
npm i opgg-scraper
```

## Usage 

```javascript
import opgg_scraper from 'opgg-scraper'
const user = new opgg_scraper;
user.getStats('hide on bush', 'br', false).then(stats => console.log(stats))    
```

## Paramaters
getStats(username: string, region: string, refresh: boolean)



## Regions

na kr oce jp euw eune lan br las ru tr

