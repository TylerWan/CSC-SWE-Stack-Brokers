# Web-based Stock Forecast

Authors: Tyler Wannamaker, Sofiya Varshavskaya, Robert Quillian, Russell Hornbuckle, Imtiaz Ahmed

## Setup
You will need to install necessarily modules by running the following
```
npm install mysql
npm install --save stock-info
```

To run the nodejs application through terminal, navigate to the project file and run the following
```
node bin\www
```

## API

To view stock information:
- /api/stocks = shows all DB stocks
- /api/stocks/[stockticker] = shows certain DB stock info
- /api/stocks/[stockticker]/realtime = shows API lookup for stock
- /api/stocks/(bottom/top) = shows top or bottom 5 stocks in the database
