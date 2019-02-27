# Web-based Stock Forecast

Authors: Tyler Wannamaker, Sofiya Varshavskaya, Robert Quillian, Russell Hornbuckle, Imtiaz Ahmed

##Setup
You will need to install necessarily modules by running the following
```
npm install mysql
npm install --save stock-info
```

To run the nodejs application through terminal, navigate to the project file and run the following
```
node bin\www
```

##API
To access objects contained in the stock database containing specific stock info, you may go to 'api/stocks', or 'api/stocks/[ticker]' for a certain stock.
To access objects contained in the article database containing specific article info, you may go to 'api/articles', or 'api/articles/stock/[ticker]' for a certain stock.