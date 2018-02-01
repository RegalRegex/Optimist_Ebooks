module.exports = {
    isNsfw: isNsfw,
    nsfwReplace: nsfwReplace
};

function nsfwReplace(tweetNew) {

    // TODO: regex for fuck that will ignore fuckers and fucking
    var nsfwFilterRegexes = [
        /cums?/ig,
        /whores?/ig,
        /ass(hole)?s?/ig,
        /piss/ig,
        /nsfw/ig,
        /cocks?/ig,
        /porns?/ig,
        /sluts?/ig,
        /dicks?/ig,
        /shits?/ig,
        /fuckers?/ig,
        /fucking/ig,
        /fucks?/ig,
        /(white|black) person/ig,
        /(white|black) people/ig,
        /jews?/ig,
        /nazis?/ig,
        /racists?/ig
    ];
    var sfwFilterReplace = [
        'slime',
        'honeysuckler',
        'butt',
        'juice',
        'not safe for worms',
        'thorax',
        'sauce',
        'bee-lover',
        'stinger',
        'bugger',
        'hecker',
        'hecking',
        'heck',
        'snake person',
        'snake people',
        'bee',
        'wasp',
        'jerk'
    ];

    var sfwFilterPluralReplace = [
        'slimes',
        'honeysucklers',
        'butts',
        'juice',
        'not safe for worms',
        'thoraxes',
        'sauces',
        'bee-lovers',
        'stingers',
        'buggers',
        'heckers',
        'hecking',
        'heckers',
        'snake people',
        'bees',
        'wasps',
        'jerks'
    ];

    for (let i = 0; i < nsfwFilterRegexes.length; i++) {
        if (nsfwFilterRegexes[i].test(tweetNew) == true) {
            while (nsfwFilterRegexes[i].test(tweetNew) == true) {
                let regPosition;
                regPosition = tweetNew.search(nsfwFilterRegexes[i]);
                if (/\w+s\b/.test(tweetNew[regPosition]) == true) {
                    tweetNew = tweetNew.replace(nsfwFilterRegexes[i], sfwFilterPluralReplace[i]);
                }
                else {
                    tweetNew = tweetNew.replace(nsfwFilterRegexes[i], sfwFilterReplace[i]);
                }
            }
        }
    }
    return tweetNew;
}

function isNsfw(actualTweet){
    var isSafe = true;
    this.actualTweet = actualTweet;
    if (nsfw.test(actualTweet) == true) {
        isSafe = false;
        // actualTweet = nsfwReplace(actualTweet);
        console.log(actualTweet);
    return isSafe;
  }
}

var nsfw = /(cums?|whores?|ass(hole)?s?|piss|nsfw|cocks?|dicks?|porns?|sluts?|shits?|fucks?|fucking|fuckers?|(white|black) person|(white|black) people|jews?|nazis?|racists?)/gi; //NAUGHTY FILTER