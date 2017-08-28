//bot.js
var twit = require('twit');
var markov = require('markov-strings')
var config = require('./config.js');
var T = new twit(config);

setInterval(tweetIt, 1000*60*5)

tweetIt()

function tweetIt() {
  var tweet = {
    status: 'Hello World!'
  }

  T.post('statuses/update', tweet, tweeted)

  function tweeted(err, data, response) {
    if (err) {
      console.log("Something went wrong!");
    } else {
      console.log(data);
    }

  }
  /*T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    console.log(data)
  })*/
}