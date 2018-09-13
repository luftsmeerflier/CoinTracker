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

function APIcall(choice) {
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
    response.forEach(exchange => results[choice].push(exchange));
    renderResult(choice);
  });
}

$(document).ready(function() {
  APIcall("btcusd");

  $(".BTC").on("click", e => {
    e.preventDefault();
    let choice = "btcusd";
    $("#menubar1 > li > a").html("BTC");
    APIcall(choice);
  });

  $(".ETH").on("click", e => {
    e.preventDefault();
    $("#menubar1 > li > a").html("ETH");
    let choice = "ethusd";
    APIcall(choice);
  });

  $(".LTC").on("click", e => {
    e.preventDefault();
    $("#menubar1 > li > a").html("LTC");
    let choice = "ltcusd";
    APIcall(choice);
  });
});

function renderResult(choice) {
  //moved bars into function, passed into graph. So, non-global.
  let bars = ["price in USD"];
  let prices = [];
  let ask = ["ask"];
  let bid = ["bid"];
  bars = bars.concat(results[choice].map(exchange => exchange.price));
  prices.push(...results[choice].map(exchange => exchange.price));
  ask.push(...results[choice].map(exchange => exchange.ask));
  bid.push(...results[choice].map(exchange => exchange.bid));

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

  let chart = c3.generate({
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
