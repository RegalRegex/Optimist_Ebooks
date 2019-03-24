// Imports
var twit = require('twit');
var config = require('./config.js');
var userAccounts = require('./user_accounts.js');
const cleanUp = require ('./tweetCleanup.js');
const nsfwEdits = require('./nsfwFilterEdits.js');
const Markov = require('markov-strings');
const fun = require('./funEffects.js');

// Parameters for Twit
var T = new twit(config);
let data = [];

main();

//Should I use  Promise.all for all the parts of this? I think so yeah
function main() {
  getTweets(T)
  .then(tweetIt(result))


  var initializeGetTweets = getTweets(T);
  initializeGetTweets.then(tweetIt(results))
                     .then((results) => {
                      T.post('statuses/update', { status: results }, tweeted);
                      function tweeted(err) {
                        if (err) { console.log(err); }
                      }
                     });
                    }

// NOW this should only return up to 1000 raw tweets from each account
function getTweets(T) { // collects tweets and edits

  var params = {
    screen_name: userAccounts.user,
    count: 200, // Twitter API only allows for 200 tweets per request
    max_id: undefined,
    include_rts: false,
    trim_user: true,
    exclude_replies: true
  };

  let sourceTweets = [];

  // while sourceTweets isn't full yet
  return new Promise((resolve, reject) => {
  for (handle in userAccounts.user) {
    let counter = 0;
    let freshBatch;
    let uniqueTweets = [];
    let emoji = userAccounts.emoji[handle];
    params.screen_name = userAccounts.user[handle];
    params.max_id = undefined;
    console.log(emoji + " Collecting tweets from \"" + userAccounts.user[handle] + "\" " + emoji);
    while (counter < 1000) {
      //FIXME: this MAY not work -- if so, remove .data
      freshBatch = await (T.get('statuses/user_timeline', params, function(err, data, response){
        if (err) {reject(err);}
        else {return data;}
      })).data;

        try {
        // This keeps Twit from grabbing the same 200 tweets over and over
        params.max_id = freshBatch[freshBatch.length - 1].id - 1;
        counter = freshBatch.length;
        // filter out duplicate tweets in new batch
        uniqueTweets = freshBatch.map(filterTweet)
        // sanitize the new tweets, then append to the buffer
        sourceTweets = sourceTweets.concat(uniqueTweets);
        }
        catch(e){
          reject(TypeError);
        }
      
    }
    console.log(counter + " tweets gathered from account: " + userAccounts.user[handle]);
  }
  resolve(concat(freshBatch));
});
}

function filterTweet(rawTweets) { // filters tweets with regex
let regexes = cleanUp.cleanupArray;

for (tw in rawTweets) {
  for (ex in regexes) {
    rawTweets[tw] = rawTweets[tw].replace(regexes[ex], ''); 
  }
}
// for (let q = 0; q < rawTweets.length; q++){
//   for (let i = 0; i < regexes.length; i++) {
//     rawTweets[q] = rawTweets[q].replace(regexes[i], '');
//   }
// }
return tweetNew;
}

function tweetIt(sourceTweets) { // STEP 1: take junk-filtered tweets
  const options = {
    maxLength: 130,
    minWords: 3,
    minScore: 10, // How nonsensical tweet should be (higher = more nonsense)
  };
  const markov = new Markov(data.push(sourceTweets), options);
  markov.buildCorpus() // buildCorpus() returns a promise. Promise = buildCorpusSync() which returns a corpus object
        
        .then(() => { // Returns the tweets array w/ Markov'd tweets
          const tweets = [];
          try {
            for (let i = 0; i < 10; i++) {
              tweets.push(markov.generateSentence(options));
            }
            tweets.forEach((element) => {
              console.log("> " + element + "\n");
            })
          return tweets;
          } catch (err) { console.log(err); }
        })

        //TODO: Add HTML escape here
        .then((results) => { // Takes tweet and does NSFW filter
          return nsfwEdits.nsfwReplace(results.pop().string);
        })

        //FIXME: This is a horrid mess but low priority since it works
        .then((results) => {
          let min = 1;
          let max = 11;
          let varRandom;
          let regexTest;
          let finalTweet = results;
          // Random functions to add a little fun/randomness to the bot
          dropWordMath(min, max);
          function dropWordMath(min, max) {
            varRandom = Math.floor(Math.random() * (max - min) + min);
            varRandom2 = Math.floor(Math.random() * (max - min) + min);
            regexTest = /(in|to|from|for|with|by|our|of|your|around|under|beyond)\s\w+$/;
            if ((varRandom <= 10 && varRandom > 7) && (regexTest.test(actualTweet) == true)) {
              finalTweet = fun.dropWord(results);
            }
            if (varRandom <= 8 && varRandom > 7) {
              finalTweet = fun.allTheCaps(results);
            }
            if (varRandom2 <= 2 && varRandom2 >= 1) {
              finalTweet = fun.shortNSweet(results);
            }
            if (varRandom <= 10 && varRandom > 5 && varRandom != 5) {
              finalTweet = fun.beeTime(results);
            }
            if (varRandom <= 5 && varRandom >= 1 && varRandom != 5) {
              finalTweet = fun.knifeTime(results);
            }
            return finalTweet;
          }
        });}