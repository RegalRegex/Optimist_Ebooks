//bot.js
var twit = require('twit');
var config = require('./config.js');
const Markov = require('markov-strings');
//var markovRequire = require('./markov.js');
var T = new twit(config);
const data = [];
const options = {
  maxLength: 140,
  minWords: 10,
  minScore: 50,
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

var regexes = [re1, re2, re3, re4, re5];
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

async function getTweets(T) { // collects tweets and edits

  var params = {
    screen_name: config.user,
    count: 200,
    max_id: undefined,
    include_rts: false,
    trim_user: true,
    exclude_replies: true
  };

  let sourceTweets = [];
  let freshBatch;
  let uniqueTweets = [];
  let result;
  // while sourceTweets isn't full yet
  while (sourceTweets.length < 1000) {
    result = await T.get('statuses/user_timeline', params);
    freshBatch = result.data;
    console.log("Array Length: " + freshBatch.length + " | max_id: " + params.max_id);
    // get oldest ID, and set params.max_id
    if (freshBatch.length === 0) {
      console.log("FreshBatch empty. Randomly readjusting");
      let tempNum = (Math.random() * (10 - 1) + 1)
      params.max_id = sourceTweets[sourceTweets.length - tempNum];
      continue;
    }
    else {
      params.max_id = freshBatch[freshBatch.length - 1].id - 1;
      // filter out duplicate tweets in new batch
      uniqueTweets = freshBatch.map(tweet => filterTweet(tweet.text))
        .filter(tweet => tweet.length > 0);
      // sanitise the new tweets, then append to the buffer
      sourceTweets = sourceTweets.concat(uniqueTweets);
    }
  }
  return sourceTweets;
}

function fillData(sourceTweets) {
  //console.log(sourceTweets[0]);
  data.push.apply(data, sourceTweets);
  //console.log(data);

  return data;
}

function tweetIt(sourceTweets) {
  fillData(sourceTweets);
  const markov = new Markov(data, options);
  console.log('The length of the source:', sourceTweets.length);
  //console.log(sourceTweets);
  // Build the corpus
  console.log(sourceTweets[0]);
  markov.buildCorpus()
    .then(() => {

      // Generate some tweets
      const tweets = [];
      for (let i = 0; i < 10; i++) {
        tweets.push(markov.generateSentence());
        //console.log(tweets[i]);
        // .then(result => {
        //   tweets.push(result);
        // });
      }
      Promise.all(tweets)
        .then(results => {
            T.post('statuses/update', { status: results.pop().string }, tweeted);

            function tweeted(err, data, response) {
              if (err) {
                console.log("Something went wrong!");
                console.log(err);
              } else {
                console.log(response.data);
              }

            }
    });

      // Promise.all(arrayOfPromises)
      // .then(arrayOfValues => {
      //   console.log(arrayOfValues)
      // });
      // console.log(tweets);

    });
}





// data.push(sourceTweets)

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
  e_tweet = { status: sourceTweets.pop() };
  T.post('statuses/update', e_tweet, tweeted)
 
  function tweeted(err, data, response) {
    if (err) {
      console.log("Something went wrong!");
    } else {
      console.log(data);
    }
 
  }
}*/







