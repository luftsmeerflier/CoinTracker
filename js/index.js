//Object to query
let options = {
   btcusd: [
      "binance:btcusdt",
      "gdax:btcusd",
      "bitfinex:btcusd",
      "bitstamp:btcusd",
      "poloniex:btcusdt"
   ],
   ethusd: [
      "binance:ethusdt",
      "bitstamp:ethusd",
      "gdax:ethusd",
      "bitfinex:ethusd",
      "poloniex:ethusdt"
   ],
   ltcusd: [   
      "binance:ltcusdt",
      "gdax:ltcusd",
      "bitstamp:ltcusd",
      "bitfinex:ltcusd",
      "poloniex:ltcusdt"
   ]
};

let results = {
   btcusd : [],
   ethusd : [],
   ltcusd : []
}

// let results = {
// btcusd : [
//    {
//      "exchange": "poloniex",
//      "pair": "btcusdt",
//      "price": 6284.68989042,
//      "ask": 6286.14052,
//      "bid": 6284.11733751
//    },
//    {
//      "exchange": "gdax",
//      "pair": "btcusd",
//      "price": 6274.02,
//      "ask": 6274.02,
//      "bid": 6274.01
//    },
//    {
//      "exchange": "bitstamp",
//      "pair": "btcusd",
//      "price": 6272.86,
//      "ask": 6273.8,
//      "bid": 6272.84
//    },
//    {
//      "exchange": "binance",
//      "pair": "btcusdt",
//      "price": 6281.3,
//      "ask": 6285.72,
//      "bid": 6281.32
//    },
//    {
//      "exchange": "bitfinex",
//      "pair": "btcusd",
//      "price": 6278.3851614,
//      "ask": 6278.4,
//      "bid": 6278.3
//    }
// ],

//    ethusd : [
//       {
//           "exchange": "binance",
//           "pair": "ethusdt",
//           "price": 223.86,
//           "ask": 223.9,
//           "bid": 223.88
//       },

//       {
//           "exchange": "bitstamp",
//           "pair": "ethusd",
//           "price": 223.45,
//           "ask": 223.45,
//           "bid": 223.34
//       },

//       {
//           "exchange": "gdax",
//           "pair": "ethusd",
//           "price": 222.78,
//           "ask": 222.78,
//           "bid": 222.77
//       },

//       {
//           "exchange": "bitfinex",
//           "pair": "ethusd",
//           "price": 222.96610187,
//           "ask": 222.97,
//           "bid": 222.96
//       },

//       {
//           "exchange": "poloniex",
//           "pair": "ethusdt",
//           "price": 223.22823681,
//           "ask": 223.15049371,
//           "bid": 223.06825372
//       }
//    ],

//    ltcusd : [
//       {
//           "exchange": "binance",
//           "pair": "ltcusdt",
//           "price": 55.52,
//           "ask": 55.55,
//           "bid": 55.51
//       },

//       {
//           "exchange": "gdax",
//           "pair": "ltcusd",
//           "price": 55.56,
//           "ask": 55.56,
//           "bid": 55.55     
//       },

//       {
//           "exchange": "bitstamp",
//           "pair": "ltcusd",
//           "price": 55.52,
//           "ask": 55.59,
//           "bid": 55.53
//       },

//       {
//           "exchange": "bitfinex",
//           "pair": "ltcusd",
//           "price": 55.693,
//           "ask": 55.693,
//           "bid": 55.658
//       },
//       {
//           "exchange": "poloniex",
//           "pair": "ltcusdt",
//           "price": 55.41875064,
//           "ask": 55.84634138,
//           "bid": 55.6638748
//       }

//    ]
// } 

function APIcall(choice) {
   let settings = {
     "async": true,
     "crossDomain": true,
     "url": 'https://whispering-brook-59383.herokuapp.com/data/' + choice,
     "method": "GET",
     "headers": {
       "Authorization": "Token fb5499d2f5cc9b01b6e80864abe8be92fbebdd7f"
     }
   }
   $.ajax(settings).done(function (response) {
      response.forEach(exchange => results[choice].push(exchange));
      renderResult(choice);
   });
}


$(document).ready(function() {

   APIcall('btcusd');

   $('.BTC').on('click', (e) => {
      e.preventDefault();
      let choice = 'btcusd';
      $('#menubar1 > li > a').html("BTC");
      APIcall(choice);
   });

   $('.ETH').on('click', (e) => {
      e.preventDefault();
      $('#menubar1 > li > a').html("ETH");
      let choice = 'ethusd';
      APIcall(choice);
   });

   $('.LTC').on('click', (e) => {
      e.preventDefault();
      $('#menubar1 > li > a').html("LTC");
      let choice = 'ltcusd';
      APIcall(choice);
   });
   
});

function renderResult(choice){
   //moved bars into function, passed into graph. So, non-global. 
   let bars = ['price in USD'];
   let prices = [];
   let ask = ['ask'];
   let bid = ['bid'];
   bars = bars.concat(results[choice].map(exchange => exchange.price));
   prices.push(...results[choice].map(exchange => exchange.price));
   ask.push(...results[choice].map(exchange => exchange.ask));
   bid.push(...results[choice].map(exchange => exchange.bid));

   let min = Math.min(...prices);
   let high = Math.max(...prices);
   let padding = ((min + high) / 2) / 10;
   let compare = ['high'];

   graph(choice, compare, high, min, bars, ask, bid);
   exchangeStats(choice, high, ask, bid);
}

//try to truncate spread to two decimal places
// function a() {
//    let price = exchange.price;
//    if (price.length )
// }

function exchangeStats(choice, high, ask, bid) {
   let colors = ['blue', 'black', 'orange', 'green', 'gray'];
   let contentExchanges = results[choice].map((exchange, i)=> (`
       <div class='exchange'>
         <div class='left'>
            <h2 style="color: ${colors[i]}">${exchange.exchange}:</h2>
            <p>Exchange rate: $${(exchange.price).toFixed(2)}</p>
            <p>Spread: $${(exchange.price - high).toFixed(2) * -1}</p>
         </div>
         <div class='right'>
            <p>ask: $${(exchange.ask).toFixed(2)}</p>
            <p>bid: $${(exchange.bid).toFixed(2)}</p>
            <p>Difference:$${(exchange.ask - exchange.bid).toFixed(2)}</p>
         </div>
         <div class="clearfix"></div>
       </div>
     `)
   );
   $('.content-exchanges').html(contentExchanges);
}

function graph(choice, compare, high, min, bars, ask, bid){
   for(i in results[choice]) {
      compare.push(high);
   };

   let chart = c3.generate({
       bindto: '#chart',
       data: {
         columns: [
           bars,
           compare,
           ask,
           bid
         ],
         type: 'bar',
         types: {
            'high': 'line',
            'ask' : 'area-spline',
            'bid' : 'area-spline'
         }
       },
      axis: {
           x: {
               type: 'category',
               categories: ['Binance', 'GDAX', 'Bitfinex', 'Bitstamp', 'Poloniex']
           },
           y: {
               high: high,
               min: min,
               padding: {top: 100, bottom: 100}
           }
       }
   });
}













// const data = [
//   {
//       "exchange": "bitfinex",
//       "pair": "btcusd",
//       "price": 6934,
//       "ask": 6934,
//       "bid": 6933.9
//   },
//   {
//     "exchange": "gdax",
//     "pair": "btcusd",
//     "price": 6942.19,
//     "ask": 6942.2,
//     "bid": 6942.19
//   },
//   {
//     "exchange": "bitfinex",
//     "pair": "btcusd",
//     "price": 6941.6,
//     "ask": 6941.7,
//     "bid": 6941.6
//   },
//   {
//     "exchange": "bitfinex",
//     "pair": "btcusd",
//     "price": 6941.6,
//     "ask": 6941.7,
//     "bid": 6941.6
//   },
//   {
//     "exchange": "poloniex",
//     "pair": "btcusdt",
//     "price": 6940.58668,
//     "ask": 6940.58668,
//     "bid": 6939.89
//   }
// ];


// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "https://coinograph.io/ticker/?symbol=bitstamp:btcusd",
//   "method": "GET",
//   "headers": {
//     "Authorization": "Token feaea3806c50a1d5c934e388af2cad8af1cc12bf"
//   }
// }

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });


// const data = {
//    "binance" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "gdax" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "bitfinex" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "bitstamp" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "poloniex" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    }
// }


// const data = {
//    "binance" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "gdax" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "bitfinex" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "bitstamp" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    },
//    "poloniex" : {
//       "btc" : 7080.19,
//       "eth" : 65.29,
//       "ltc" : 63.59
//    }
// }

// Just as every star is a child of the night sky...
// Were he not a Byron, he would have been Friedrich Nietzche. 
