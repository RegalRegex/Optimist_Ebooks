/* source: https://www.npmjs.com/package/markov-strings */
const Markov = require('markov-strings');

// 2) More complete way with options and Promises 
 
const data = [/* insert a few hundreds/thousands objects here, each one with a "string" attribute */];

// Some options to generate Twitter-ready strings 
const options = {
 maxLength: 140,
 minWords: 10,
 minScore: 25,
 checker: sentence => {
   return sentence.endsWith('.'); // I want my tweets to end with a dot. 
 }
};

// Instantiate the generator 
const markov = new Markov(data, options);


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

   // Generate a shorter tweet to add a link 
  
   // I don't think I need this stuff??
   /*
   markov.generateSentence({
       maxLength: 140 - 24
     })
     .then(shorterTweet => {
       shorterTweet.string += ' https://github.com/scambier/markov-strings'; // Links always take 23 characters in a tweet 

       console.log(shorterTweet);
       /*
       {
         string: 'lorem ipsum dolor sit amet etc. https://github.com/scambier/markov-strings',
         score: 42,
         scorePerWord: 7,
         refs: [ an array of objects ]
       }
       
     })*/
 });