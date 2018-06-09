# Bee Squad Bot

### *Personal Node.js adventure to amuse friends on Twitter*

---

#### Newest (significant) Updates

##### Jun 8, 2018

* Created README
* Fixed NSFW filter
* Removed NSFW filter word source from repo
* Moved REGEX cleanups to external file
* Deleted defunct Markov file

---

### Big TODOs

* Improve error handling
* Export more of bot.js to external modules
* **Documentation**

---

## Repo Contents

##### bot.js

Main body of code. Performs tweet collection, regex & nsfw filtering, markov randomization, and actually sends tweet.

* Single active function call = `getTweets(T).then(tweetIt);` - Everything else cascades down from that.
* Function **filterTweet** uses regex (`tweetCleanup.js`) to clean up punctuation and extraneous links etc. from the tweets themselves
* Function **getTweets** uses *Twit* package to interface w/ Twitter's API, and collect tweets from (in this case) multiple accounts
* Function **tweetIt** rolls helper function **fillData** in to utilize the *Markov* package and actually build the eBooks tweets (using a promise chain), before ultimately tweeting it out through the bot's twitter
* Function **dropWordMath** is a (messy) silly function that randomly adds emoji to the tweet, cuts words or length off of the tweet, or capitalizes the whole thing

##### config.js

Config file with tokens & keys. Kept off the repo for obvious reasons

##### nsfwFilterEdits.js

Filter module specifically for removing NSFW words, and replacing them with SFW alternatives. NSFW list is an external module kept off of the repo.

##### tweetCleanup.js

External module containing regular expressions for twitter-junk filtering

##### user_accounts.js

Simple list of contributing twitter accounts + associated emoji for debug message purposes. Eventually hope to expand bot capabilities to randomly tweet 100% from a single source, and that will weigh into it.

---

Feel free to contact with questions. Cheers!

[![BeeSquadPic](https://pbs.twimg.com/profile_images/906985663718756352/xw2aF-v0_400x400.jpg)](https://twitter.com/BeeSquadBot)
*\*art by [@SharpiBees](https://twitter.com/sharpibees)*