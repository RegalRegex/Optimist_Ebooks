module.exports = {
    isNsfw: isNsfw,
    nsfwReplace: nsfwReplace
};

const nsfwExternal = require('./nsfwList.js');

function nsfwReplace(tweetNew) {

    var nsfwFilterRegexes = nsfwExternal.nsfwArray;
    var sfwFilterReplace = nsfwExternal.sfwArray_S;
    // Plurals currently does not work
    var sfwFilterPluralReplace = nsfwExternal.sfwArray_P;

    for (let i = 0; i < nsfwFilterRegexes.length; i++) {
        if (nsfwFilterRegexes[i].test(tweetNew) == true) {
            //let regPosition;
            //regPosition = tweetNew.search(nsfwFilterRegexes[i]);
            //if (/\w+s\b/.test(tweetNew[regPosition]) == true) {
            //    tweetNew = tweetNew.replace(nsfwFilterRegexes[i], sfwFilterPluralReplace[i]);
            //}
            //else {
            tweetNew = tweetNew.replace(nsfwFilterRegexes[i], sfwFilterReplace[i]);
            //}
            console.log("UPDATED: " + tweetNew);
        }
    }
    return tweetNew;
}

function isNsfw(actualTweet){
    let isSafe = true;
    console.log(isSafe);
    //this.actualTweet = actualTweet;
    if (nsfwExternal.nsfw.test(actualTweet) == true) {
        isSafe = false;
        console.log(isSafe);
        // actualTweet = nsfwReplace(actualTweet);
        console.log(actualTweet);
  }
  return isSafe;
}

