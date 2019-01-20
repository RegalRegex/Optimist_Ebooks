var userAccounts = require('./user_accounts.js');
module.exports = {
  dropWord: dropWord,
  allTheCaps: ALLTHECAPS,
  shortNSweet: shortNSweet,
  beeTime: beeTime,
  knifeTime: knifeTime
};

// Randomly drops last word of sentence
function dropWord(tweet) {
  tweet = tweet.replace(/\b(\w+)\W*$/, "");
  console.log("Dropping last word randomly");
  console.log("New tweet: " + tweet);
  return tweet;
}

// Randomly re-prints entire tweet in caps
function ALLTHECAPS(tweet) {
  tweet = tweet.toUpperCase();
  console.log("ALL THE CAPS");
  console.log("New tweet: " + tweet);
  return tweet;
}

function shortNSweet(tweet) {
  String.prototype.trunc = function(n, useWordBoundary) {
    if (this.length <= n) {
      return this;
    }
    var subString = this.substr(0, n - 1);
    return useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString;
  };
  tweet = tweet.trunc(20, true);
  console.log("Short n' Sweet!");
  return tweet;
}

function emojiTime(tweet) {
  let random = Math.floor(Math.random() * (userAccounts.user.length - 1) + 1);
  tweet = userAccounts.emoji[random] + tweet;
  console.log('%c'+userAccounts.emoji[random], 'color: blue; font-weight: bold;');
  return tweet;
}

function beeTime(tweet) {
  tweet = "🐝" + tweet;
  return tweet;
}

function knifeTime(tweet) {
  tweet = "🔪" + tweet;
  return tweet;
}
