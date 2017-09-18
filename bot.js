//bot.js
var twit = require('twit');
var config = require('./config.js');
var userAccounts = require('./user_accounts.js');
const Markov = require('markov-strings');
//var markovRequire = require('./markov.js');
var T = new twit(config);
const data = [];
const options = {
  maxLength: 130,
  minWords: 3,
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
var handle;

/* REGULAR EXPRESSIONS HERE */
var re1 = /\b(RT|MT) .+/; // RTs
var re2 = /(^|\s)(#[a-z\d-]+)/gi; // Hashtags
var re3 = /\n/; // Extra lines
var re4 = /\"|\(|\)/; // Attribution
var re5 = /\s*((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi // Removes hyperlinks
var re6 = /@\w{1,15}/gi // Removes @ mentions
var re7 = /(^|\s)(_[a-z\d-]+)/gi // Removes underscores

var re8 = /&gt;/gi // Removing weird junky unicode that sometimes sticks
var re9 = /\"\b/g // Removing extraneous random quotation marks
// /@\w{1,15}/g alternative @ regex from Shep

var nsfw = /(cum|whores?|piss|nsfw|cocks?|dicks?|porns?|sluts?|shits?|fucks?|fucking|fuckers?|(white|black) people|jews?|nazis?)/gi //NAUGHTY FILTER

var regexes = [re1, re2, re3, re4, re5, re6, re7, re8, re9];
// str.replace(regexp|substr, newSubstr|function)
function filterTweet(rawTweet) { // filters tweets with regex
  let tmp;
  var tweetNew;
  for (let i = 0; i < regexes.length; i++) {
    rawTweet.text = rawTweet.text.replace(regexes[i], '');
  }
  tweetNew = rawTweet.text;
  if (nsfw.test(tweetNew) == true) {
    nsfwReplace(tweetNew);
  }
  return tweetNew;
}

function nsfwReplace(tweetNew) {

  // TODO: regex for fuck that will ignore fuckers and fucking
if (/cum/i.test(tweetNew) == true){ test = true; tweetNew = tweetNew.replace(/cum/gi, 'slime'); }
else if (/whores?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/whore/gi, 'honeysuckler'); tweetNew = tweetNew.replace(/whores/gi, 'honeysucklers'); }
else if (/piss/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/piss/gi, 'juice'); }
else if (/nsfw/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/nsfw/gi, 'not safe for worms'); }
else if (/cocks?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/cock/gi, 'thorax'); tweetNew = tweetNew.replace(/cocks/gi, 'thoraxes'); } 
else if (/porns?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/porn/gi, 'sauce'); tweetNew = tweetNew.replace(/porns/gi, 'sauces'); } 
else if (/sluts?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/slut/gi, 'bee-lover'); tweetNew = tweetNew.replace(/sluts/gi, 'bee-lovers'); } 
else if (/dicks?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/dick/gi, 'stinger'); tweetNew = tweetNew.replace(/dicks/gi, 'stingers'); }
else if (/shits?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/shit/gi, 'bugger'); tweetNew = tweetNew.replace(/shits/gi, 'buggers'); } 
else if (/fuckers?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/fucker/gi, 'hecker'); tweetNew = tweetNew.replace(/fuckers/gi, 'heckers'); } 
else if (/fucking/i.test(tweetNew) == true) { tweetNew = tweetNew = tweetNew.replace(/fucking/gi, 'hecking'); } 
else if (/fucks?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/fuck/gi, 'heck'); tweetNew = tweetNew.replace(/fucks/gi, 'heckers'); }
else if (/(white|black) people/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/(white|black) people/gi, 'snake people'); }
else if (/jews?/i.test(tweetNew) == true) {  tweetNew = tweetNew.replace(/jew/gi, 'bee'); tweetNew = tweetNew.replace(/jews/gi, 'bees'); } 
else if (/nazis?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/nazi/gi, 'wasp'); tweetNew = tweetNew.replace(/nazis/gi, 'wasps'); } 
else {tweetNew = tweetNew;}

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
    let tempMaxId;
    params.screen_name = userAccounts.user[handle];
    params.max_id = undefined;
    console.log("!!! Collecting tweets from \"" + userAccounts.user[handle] + "\" !!!");
    while (counter < 1000) {
      result = await T.get('statuses/user_timeline', params);
      freshBatch = result.data;

      // BELOW: code to check array lenght and max ID
      //console.log("Array Length: " + freshBatch.length + " | max_id: " + params.max_id);
      // get oldest ID, and set params.max_id
      if (freshBatch.length === 0 || freshBatch.length - 1 === 0) {
        console.log("> Less than goal collection; Breaking.");
        break;
      }
      else {
        params.max_id = freshBatch[freshBatch.length - 1].id - 1;
        //tempMaxId = freshBatch[freshBatch.length - 5].id - 1;
        counter += freshBatch.length;
        // filter out duplicate tweets in new batch
        uniqueTweets = freshBatch.map(filterTweet)
        //.filter(tweet => tweet.length > 0);
        // sanitise the new tweets, then append to the buffer
        sourceTweets = sourceTweets.concat(uniqueTweets);
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



