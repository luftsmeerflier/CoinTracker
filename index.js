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
  btcusd: [],
  ethusd: [],
  ltcusd: []
};

let chart;

function APIcall(choice) {    
  $('.content').hide();
  $('.header').hide();
  $('#loader').show();
  $('.content-exchanges').hide();
  results[choice] = [];
  let settings = {
    async: true,
    crossDomain: true,
    url: "https://whispering-brook-59383.herokuapp.com/data/" + choice,
    method: "GET",
    headers: {
      Authorization: "Token fb5499d2f5cc9b01b6e80864abe8be92fbebdd7f"
    }
  };
  $.ajax(settings).done(function(response) {
    $('#loader').hide();
    $('.results-page').show();
    $('.content').show();
    $('.header').show();
    $('.content-exchanges').show()
    $('.exchange-prices-header').show();
    response.forEach(exchange => {
      if('exchange' in exchange){
        results[choice].push(exchange)
      };
    });
    renderResult(choice);
  });
}

$(document).ready(function() {
   $('.results-page').hide();
  $(".BTC").on("click", e => {
    e.preventDefault();
    // $('.results-page').html(' ');
    $("#menubar1 > li > a").html("BTC");
    $(".landing-page").hide();
    $(".results-page").show();
    APIcall("btcusd");
  });

  $(".ETH").on("click", e => {
    e.preventDefault();
    // $('.results-page').html(' ');
    $("#menubar1 > li > a").html("ETH");
    $(".landing-page").hide();
    $(".results-page").show();
    APIcall("ethusd");
  });

  $(".LTC").on("click", e => {
    e.preventDefault();
    // $('.results-page').html(' ');
    $("#menubar1 > li > a").html("LTC");
    $(".landing-page").hide();
    $(".results-page").show();
    APIcall("ltcusd");
  });
});

//A new array with the results returned, minus errors
function renderResult(choice) {
  //moved bars into function, passed into graph. So, non-global.
  let bars = ["price in USD"];
  let prices = [];
  let ask = ["ask"];
  let bid = ["bid"];

  // let bars = ["price in USD", 100, 200, 300, 400];
  // let prices = ["price in USD", 100, 200, 300, 400];
  // let ask = ["ask", 100, 200, 300, 400];
  // let bid = ["bid", 100, 200, 300, 400];

  //let exchangeList = ["binance", "gdax", "bitfinex", "bitstamp", "poloniex"];
  // let newArray = results[choice].map(obj => { 

  // const resObj = [ 
  //   { exchange: "bitstamp", pair: "btcusd", price: 3577.01, ask: 3577.01, bid: 3575.21},
  //   { exchange: "gdax", pair: "btcusd", price: 3577.01, ask: 3577.01, bid: 3575.21},
  //   { exchange: "exchange", pair: "btcusd", price: 3577.01, ask: 3577.01, bid: 3575.21},
  //   { error: "request throttled"},
  //   { error: "request throttled"}
  // ]

  // for(obj of results[choice]){
  results[choice].forEach(item => {
      bars.push(item.price);
      ask.push(item.ask);
      bid.push(item.bid);
  });





  //bars = bars.concat(newArray).map(exchange => exchange.price);
  prices.push(...results[choice].map(exchange => exchange.price));
  //ask.push(...results[choice].map(exchange => exchange.ask));
  //bid.push(...results[choice].map(exchange => exchange.bid));

  let min = Math.min(...prices);
  let high = Math.max(...prices);
  let padding = (min + high) / 2 / 10;
  let compare = ["high"];

  graph(choice, compare, high, min, bars, ask, bid);
  exchangeStats(choice, high, ask, bid);
}

function exchangeStats(choice, high, ask, bid) {
  let colors = ["blue", "black", "orange", "green", "gray"];
  let contentExchanges = results[choice].map(
    (exchange, i) => `
       <div class='exchange'>
         <div class='left'>
            <h2 style="color: ${colors[i]}">${exchange.exchange}:</h2>
            <p>Exchange rate: $${exchange.price.toFixed(2)}</p>
            <p>Spread: $${(exchange.price - high).toFixed(2) * -1}</p>
         </div>
         <div class='right'>
            <p>ask: $${exchange.ask.toFixed(2)}</p>
            <p>bid: $${exchange.bid.toFixed(2)}</p>
            <p>Difference:$${(exchange.ask - exchange.bid).toFixed(2)}</p>
         </div>
         <div class="clearfix"></div>
       </div>
     `
  );
  $(".content-exchanges").html(contentExchanges);
}

function graph(choice, compare, high, min, bars, ask, bid) {
  for (i in results[choice]) {
    compare.push(high);
  }
  chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: [bars, compare, ask, bid],
      type: "bar",
      types: {
        high: "line",
        ask: "area-spline",
        bid: "area-spline"
      }
    },
    axis: {
      x: {
        type: "category",
        categories: ["Binance", "GDAX", "Bitfinex", "Bitstamp", "Poloniex"]
      },   
      y: {
        high: high,
        min: min,
        padding: { top: 100, bottom: 100 }
      }
    }
  });
}

// Just as every star is a child of the night sky...
// Were he not a Byron, he would have been Friedrich Nietzche.
