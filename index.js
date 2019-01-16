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
      response.forEach(exchange => results[choice].push(exchange));
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

function renderResult(choice) {
  //moved bars into function, passed into graph. So, non-global.
  let bars = ["price in USD"];
  let prices = [];
  let ask = ["ask"];
  let bid = ["bid"];

  let newArray = results[choice].map((obj, index)=>{
      let exchangeList = ["binance", "gdax", "bitfinex", "bitstamp", "poloniex"];
      if('detail' in obj){
        delete obj['detail'];
        let exchange = {"exchange" : exchangeList[index], "pair" : choice, "price" :0, bid: 0};
        Object.assign(obj, exchange)
      }
      console.log(obj);
  });

  // results[choice].forEach(item => {
  //   if(item.exchange !== undefined){
  //     bars.push(item.price);
  //     ask.push(item.ask);
  //     bid.push(item.bid);
  //   } else {
  //     bars.push(0);
  //     ask.push(0);
  //     bid.push(0);
  //   }
  // });
//   2: {exchange: "bitstamp", pair: "btcusd", price: 3577.01, ask: 3577.01, bid: 3575.21}
// 3: {detail: "Request was throttled. Expected available in 1 second."}


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
