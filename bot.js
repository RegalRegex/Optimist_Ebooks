//bot.js
var twit = require('twit');
var config = require('./config.js');
var userAccounts = require('./user_accounts.js');
const cleanUp = require ('./tweetCleanup.js');
const nsfwEdits = require('./nsfwFilterEdits.js');
const Markov = require('markov-strings');

var T = new twit(config);
const data = [];
const options = {
  maxLength: 130,
  minWords: 3,
  minScore: 10, // How nonsensical tweet should be (higher = more nonsense)
};

getTweets(T).then(tweetIt);

var handle;
var regexes = cleanUp.cleanupArray;
// str.replace(regexp|substr, newSubstr|function)
function filterTweet(rawTweet) { // filters tweets with regex
  var tweetNew;
  for (let i = 0; i < regexes.length; i++) {
    rawTweet.text = rawTweet.text.replace(regexes[i], '');
  }
  tweetNew = rawTweet.text;
return tweetNew;
}

async function getTweets(T) { // collects tweets and edits

  var params = {
    screen_name: userAccounts.user,
    count: 200,
    max_id: undefined,
    include_rts: false,
    trim_user: true,
    exclude_replies: true
  };

  let sourceTweets = [];

  // while sourceTweets isn't full yet
  for (handle in userAccounts.user) {
    let counter = 0;
    let freshBatch;
    let uniqueTweets = [];
    let result;
    let emoji = userAccounts.emoji[handle];
    params.screen_name = userAccounts.user[handle];
    params.max_id = undefined;
    console.log(emoji + " Collecting tweets from \"" + userAccounts.user[handle] + "\" " + emoji);
    while (counter < 1000) {
      result = await T.get('statuses/user_timeline', params);
      freshBatch = result.data;

      if (freshBatch.length === 0 || freshBatch.length - 1 === 0) {
        console.log("> Less than goal collection; Breaking.");
        break;
      }
      else {
        try {
        params.max_id = freshBatch[freshBatch.length - 1].id - 1;
        counter += freshBatch.length;
        // filter out duplicate tweets in new batch
        uniqueTweets = freshBatch.map(filterTweet)
        // sanitize the new tweets, then append to the buffer
        sourceTweets = sourceTweets.concat(uniqueTweets);
        }
        catch(e){
          throw TypeError;
        }
      }
    }
    console.log(counter + " tweets gathered from account: " + userAccounts.user[handle]);
  }
  return sourceTweets;
}

function fillData(sourceTweets) {
  data.push.apply(data, sourceTweets);
  return data;
}

async function tweetIt(sourceTweets) {
  fillData(sourceTweets);
  const markov = new Markov(data, options);
  console.log('The length of the source:', sourceTweets.length);
  markov.buildCorpus()
    .then(() => {

      // Generate some tweets
      const tweets = [];
      for (let i = 0; i < 10; i++) {
        tweets.push(markov.generateSentence());
      }
      Promise.all(tweets).then(tweets => {
        for (let tweet of tweets) {
          console.log("> " + tweet.string);
        }
      });

      Promise.all(tweets)
        .then(results => {
          let actualTweet;
          let min = 1;
          let max = 11;
          let varRandom;
          let regexTest;
          actualTweet = results.pop().string;

          isSafe = nsfwEdits.isNsfw(actualTweet);
          if (isSafe == false){
            actualTweet = nsfwEdits.nsfwReplace(actualTweet);
          }
          console.log(actualTweet);

          // Random functions to add a little fun/randomness to the bot
          function dropWordMath(min, max) {
            varRandom = Math.floor(Math.random() * (max - min) + min);
            varRandom2 = Math.floor(Math.random() * (max - min) + min);
            regexTest = /(in|to|from|for|with|by|our|of|your|around|under|beyond)\s\w+$/;
            if ((varRandom <= 10 && varRandom > 7) && (regexTest.test(actualTweet) == true)) {
              dropWord();
            }
            if (varRandom <= 8 && varRandom > 7) {
              ALLTHECAPS();
            }
            if (varRandom2 <= 2 && varRandom2 >= 1) {
              shortNSweet();
            }
            if (varRandom <= 10 && varRandom > 5 && varRandom != 5) {
              beeTime();
            }
            if (varRandom <= 5 && varRandom >= 1 && varRandom != 5) {
              knifeTime();
            }
            if (varRandom === 5) {
              knifeTime();
              beeTime();
            }
          }

          // Randomly drops last word of sentence
          function dropWord() {
            actualTweet = actualTweet.replace(/\b(\w+)\W*$/, '');
            console.log("Dropping last word randomly");
            console.log("New tweet: " + actualTweet);
            return actualTweet;
          }

          // Randomly re-prints entire tweet in caps
          function ALLTHECAPS() {
            actualTweet = actualTweet.toUpperCase();
            console.log("ALL THE CAPS");
            console.log("New tweet: " + actualTweet);
            return actualTweet;
          }

          function shortNSweet() {
            String.prototype.trunc =
              function (n, useWordBoundary) {
                if (this.length <= n) { return this; }
                var subString = this.substr(0, n - 1);
                return (useWordBoundary
                  ? subString.substr(0, subString.lastIndexOf(' '))
                  : subString);
              };
            actualTweet = actualTweet.trunc(20, true);
            console.log("Short n' Sweet!");
            return actualTweet
          }

          function beeTime() {
            actualTweet = "🐝" + actualTweet;
            return actualTweet;
          }

          function knifeTime() {
            actualTweet = "🔪" + actualTweet;
            return actualTweet;
          }

          dropWordMath(min, max);
          console.log("Here's what tweeted: " + actualTweet);

          T.post('statuses/update', { status: actualTweet }, tweeted);

          function tweeted(err, data, response) {
            if (err) {
              console.log("Something went wrong!");
              console.log(err);
            }

          }
        });

    });
}



