# Web-based Stock Forecast

Authors: Tyler Wannamaker, Sofiya Varshavskaya, Robert Quillian, Russell Hornbuckle, Imtiaz Ahmed

## Setup
You will need to install necessarily modules by running the following
```
npm install mysql
npm install --save stock-info
npm install node-schedule
npm install --save node-gnews
npm install sentiment
npm install stock-data.js
```

To run the nodejs application through terminal, navigate to the project file and run the following
```
node bin\www
```

## API

- /api/stocks = shows all DB stocks
- /api/stocks/[stockticker] = shows certain DB stock info
- /api/stocks/[stockticker]/realtime = shows API lookup for stock
- /api/stocks/(top/bottom) = shows top/bottom 5 stocks in database
- /api/stocks/industry/[industry] = shows industry stocks
- /api/articles = shows 5 articles for each stock
- /api/articles/[stockticker] = shows 5 articles for certain stock
