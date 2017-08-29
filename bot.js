//bot.js
var twit = require('twit');
var config = require('./config.js');
var markovRequire = require('./markov.js');
var T = new twit(config);
/**
 * STEPS:
 * 
 * 1. Get tweet from accounts
 * 2. Remove RT crud
 * 3. Randomize with Markov
 * 4. Post new tweet
 * 5. Interval
 */


markovIt();
tweetIt();
setInterval(tweetIt, 1000 * 60 * 5)
setInterval(markovIt, 1000 * 60 * 60 * 24)

function markovIt() {
  var tweet;
  var source_tweets = [];

  /* REGULAR EXPRESSIONS HERE */

  // str.replace(regexp|substr, newSubstr|function)
  function filterTweet(tweet) {
    tweet = tweet.replace('\b(RT|MT) .+', ''); //Take out anything after RT or MT
    tweet = tweet.replace('(\#|@|(h\/t)|(http))\S+', '') //Take out URLs, hashtags, hts, etc.
    tweet = tweet.replace('\n', '') //take out new lines.
    tweet = tweet.replace('\"|\(|\)', '') //take out quotes.
    tweet = tweet.replace('\s+\(?(via|says)\s@\w+\)?', '') // remove attribution
    
    //I don't know what this is \/
    htmlsents = tweet.exec('&/w+;')
    if (length(htmlsents) > 0){
      for (itme in htmlsents) {
        tweet = tweet.replace(item, tweet)
      }
    }
    tweet = tweet.replace('\xe9', 'e');
    return tweet;
  }

  function getTweets(T) {
    //Collating source tweets and putting into Markov class' data array

    var params = {
      screen_name: config.user,
      count: 200,
      //max_id: max_id, 
      include_rts: True,
      trim_user: True,
      exclude_replies: True
    };
    // string array user_tweets
    var source_tweets = [];
    user_tweets = T.get('statuses/user_timeline', params, function (err, data, response) {
      console.log(data)
    })
    for (tweet in user_tweets) {
      tweet = filterTweet(tweet);
    }
    if (length(tweet) != 0) {
      source_tweets.push(tweet);
    }
    return source_tweets;
  }

  data = source_tweets;
}

function tweetIt(tweets) {
 // markovRequire.markov.buildCorpus()
  //.then(tweets => {
    var e_tweet = tweets.splice(Math.floor(Math.random()*array.length), 1);
  //})
  T.post('statuses/update', e_tweet, tweeted)
  
    function tweeted(err, data, response) {
      if (err) {
        console.log("Something went wrong!");
      } else {
        console.log(data);
      }
  
    }
  }

