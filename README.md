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
npm install -S formidable
npm install --save chart.js 
npm install twilio
```
This application requires a configuration to be added into the stockconfig/config file:
- Database login information for the MySQL server
- History API Key from World Trading Data
- Twilio API Key

To run the nodejs application through terminal, navigate to the project file and run the following
```
node bin\www
```

## API

- /api/stocks = shows all DB stocks
- /api/stocks/industry/[industry] = shows industry stocks
- /api/stocks/[stockticker] = shows certain DB stock info
- /api/stocks/[stockticker]/realtime = shows API lookup for stock
- /api/stocks/[stockticker]/history = shows stock price history
- /api/stocks/[stockticker]/projection = shows stock projection models
- /api/stocks/projections = shows all projections
- /api/stocks/(top/bottom) = shows stocks sorted from top/bottom from hybrid projection model

- /api/articles = shows 5 articles for each stock
- /api/articles/[stockticker] = shows 5 articles for certain stock

- /api/users = shows users
- /api/users/[userid] = shows specific user info
