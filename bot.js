//bot.js
var twit = require('twit');
var config = require('./config.js');
const Markov = require('markov-strings');
//var markovRequire = require('./markov.js');
var T = new twit(config);
var source_tweets = [];
const data = [];
const options = {
  maxLength: 140,
  minWords: 10,
  minScore: 25,
  checker: sentence => {
    return sentence.endsWith(''); // I want my tweets to end with a dot.
  }
};

// Instantiate the generator 
//const markov = new Markov(data, options);

getTweets(T).then(tweetIt);
//tweetIt(data);
//setInterval(tweetIt, 1000 * 60 * 5)
//setInterval(getTweets, 1000 * 60 * 60 * 24)


var tweet;
var user_tweets = [];

/* REGULAR EXPRESSIONS HERE */
var re1 = /\b(RT|MT) .+/; // RTs
var re2 = /(^|\s)(#[a-z\d-]+)/; // Hashtags
var re3 = /\n/; // Extra lines
var re4 = /\"|\(|\)/; // Attribution
var re5 = /\s*(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi

var regexes = [/*re1, re2, re3, re4, re5*/];
// str.replace(regexp|substr, newSubstr|function)
function filterTweet(rawTweet) { // filters tweets with regex
  var tmp;
  var tweetNew;
  for (let i = 0; i < regexes.length; i++) {
    tmp = rawTweet.replace(regexes[i], '');
    tweetNew = tmp;
  }
  return tweetNew;
}

function getTweets(T) { // collects tweets and edits

  var params = {
    screen_name: config.user,
    count: 3000,
    //max_id: max_id, 
    include_rts: false,
    trim_user: true,
    exclude_replies: true
  };
  // string array user_tweets
  return T.get('statuses/user_timeline', params)
  .then(result => {
    const tweets = result.data;
    for (var i = 0; i < tweets.length; i++) {
      const filteredTweet = filterTweet(tweets[i].text);
      if (filteredTweet.length != 0){
        source_tweets.push(filteredTweet);
      }
    }
    // return undefined (because promises)
  });
  
  /*function editTweets(err, data, response) {
    console.log('printing out data.length');
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      //console.log(tweets[i].text);
      const filteredTweet = filterTweet(data[i].text)

      if (filteredTweet.length != 0) {
        source_tweets.push(filteredTweet);
      }
    }
    
    console.log(source_tweets[0]); // so this one works
    // fillData(source_tweets);
    // return source_tweets;
  }*/
 // source_tweets = source_tweets;
  //console.log(source_tweets[0]); // UNDEFINED
  //fillData(source_tweets);
  
}

function fillData(source_tweets){
  //console.log(source_tweets[0]);
  data.push.apply(data, source_tweets);
  //console.log(data);
  
  return data;
}

function tweetIt() {
  fillData(source_tweets);
  const markov = new Markov(data, options);
  console.log('The length of the source:', source_tweets.length);
  //console.log(source_tweets);
  // Build the corpus
  console.log(source_tweets[0]);
  markov.buildCorpus()
    .then(() => {

      // Generate some tweets
      const tweets = [];
      for (let i = 0; i < 10; i++) {
        tweets.push(markov.generateSentence());
          // .then(result => {
          //   tweets.push(result);
          // });
      }
      Promise.all(tweets)
      .then(results => {
        function postTweets(T) {
        T.post('statuses/update', response.body, tweeted)
        
         function tweeted(err, data, response) {
           if (err) {
             console.log("Something went wrong!");
           } else {
             console.log(data);
           }
        
         }
      };
      });

      // Promise.all(arrayOfPromises)
      // .then(arrayOfValues => {
      //   console.log(arrayOfValues)
      // });
      // console.log(tweets);
    })
}




// data.push(source_tweets)

/*function tweetIt(markov) {
  // Build the corpus
  markov.buildCorpus()
    .then(() => {

      // Generate some tweets
      var markovTweets = [];
      for (let i = 0; i < 10; i++) {
        markov.generateSentence()
          .then(result => {
            markovTweets.push(result);
            console.log(markovTweets);
          });
        }
    //  console.log(markovTweets);
    // return markovTweets;
    })
    .then((markovTweets) => {
      var e_tweet;
      e_tweet = markovTweets.pop();
      console.log(e_tweet);
      return e_tweet;
    });*/

  /*
  e_tweet = { status: source_tweets.pop() };
  T.post('statuses/update', e_tweet, tweeted)
 
  function tweeted(err, data, response) {
    if (err) {
      console.log("Something went wrong!");
    } else {
      console.log(data);
    }
 
  }
}*/







