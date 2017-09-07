//bot.js
var twit = require('twit');
var config = require('./config.js');
const Markov = require('markov-strings');
//var markovRequire = require('./markov.js');
var T = new twit(config);
const data = [];
const options = {
  maxLength: 130,
  minWords: 10,
  minScore: 25,
  checker: sentence => {
    return sentence.endsWith(''); // I want my tweets to end with a dot.
  }
};

// TODO: Check if random word drop is working
// TODO: Automate
// TODO: Get rid of underscores in tweets
// TODO: check 

getTweets(T).then(tweetIt);

var tweet;
var user_tweets = [];

/* REGULAR EXPRESSIONS HERE */
var re1 = /\b(RT|MT) .+/; // RTs
var re2 = /(^|\s)(#[a-z\d-]+)/gi; // Hashtags
var re3 = /\n/; // Extra lines
var re4 = /\"|\(|\)/; // Attribution
var re5 = /\s*(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi // Removes hyperlinks
var re6 = /@\w{1,15}/gi // Removes @ mentions
var re7 = /(^|\s)(_[a-z\d-]+)/gi // Removes underscores
// /@\w{1,15}/g alternative @ regex from Shep

var regexes = [re1, re2, re3, re4, re5, re6, re7];
// str.replace(regexp|substr, newSubstr|function)
function filterTweet(rawTweet) { // filters tweets with regex
  let tmp;
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
  let tempMaxId;
  // while sourceTweets isn't full yet
  while (sourceTweets.length < 3600) {
    result = await T.get('statuses/user_timeline', params);
    freshBatch = result.data;
    console.log("Array Length: " + freshBatch.length + " | max_id: " + params.max_id);
    // get oldest ID, and set params.max_id
    if (freshBatch.length === 0 || freshBatch.length - 1 === 0) {
      console.log("Not enough tweets. Breaking");
      break;
    }
    else {
      params.max_id = freshBatch[freshBatch.length - 1].id - 1;
      tempMaxId = freshBatch[freshBatch.length - 5].id - 1;
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
  //console.log(sourceTweets[0]);
  markov.buildCorpus()
    .then(() => {

      // Generate some tweets
      const tweets = [];
      for (let i = 0; i < 10; i++) {
        tweets.push(markov.generateSentence());
        //console.log(results[i].string);
        // .then(result => {
        //   tweets.push(result);
        // });
      }
      Promise.all(tweets).then(tweets => {
        for (let tweet of tweets) {
            console.log(tweet.string);
        }
      });
      Promise.all(tweets)
        .then(results => {
          let actualTweet;
          let min = 1;
          let max = 5;
          let dropWordRand;
          actualTweet = results.pop().string;

          function dropWordMath(min, max) {
            dropWordRand = Math.random() * (max - min) + min;
            if ((dropWordRand === 4) && (actualTweet.test(/(in|to|from|for|with|by|our|of|your|around|under|beyond)\s\w+$/) == true)){
                dropWord();
            }
          }

          function dropWord()  {
            actualTweet = actualTweet.replace(/\s\w+.$/, '');
            console.log("Dropping last word randomly");
            return actualTweet;
          }
          
          dropWordMath(min, max);
          T.post('statuses/update', { status: actualTweet }, tweeted);

          function tweeted(err, data, response) {
            if (err) {
              console.log("Something went wrong!");
              console.log(err);
            } else {
              console.log(response.data);
            }

          }
        });

    });
}



