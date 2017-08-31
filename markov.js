// 2) More complete way with options and Promises
const Markov = require('markov-strings');

const data = [/* insert a few hundreds/thousands objects here, each one with a "string" attribute */];

// Some options to generate Twitter-ready strings
const options = {
  maxLength: 140,
  minWords: 10,
  minScore: 25,
  checker: sentence => {
    return sentence.endsWith(''); // I want my tweets to end with a dot.
  }
};

// Instantiate the generator
const markov = new Markov(data, options);

function tweetIt() {
  // Build the corpus
  markov.buildCorpus()
    .then(() => {

      // Generate some tweets
      const tweets = [];
      for (let i = 0; i < 10; i++) {
        markov.generateSentence()
          .then(result => {
            tweets.push(result);
          });
      }
      console.log(tweets);
    })
}