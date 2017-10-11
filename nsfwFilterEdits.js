function nsfwReplace(tweetNew) {

    // TODO: regex for fuck that will ignore fuckers and fucking
    if (/cum/i.test(tweetNew) == true) { test = true; tweetNew = tweetNew.replace(/cum/gi, 'slime'); }
    else if (/whores?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/whore/gi, 'honeysuckler'); tweetNew = tweetNew.replace(/whores/gi, 'honeysucklers'); }
    else if (/ass(hole)?s?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/ass(hole)?e?s/gi, 'butts'); tweetNew = tweetNew.replace(/ass(hole)?/gi, 'butt'); }
    else if (/piss/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/piss/gi, 'juice'); }
    else if (/nsfw/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/nsfw/gi, 'not safe for worms'); }
    else if (/cocks?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/cocks/gi, 'thoraxes'); tweetNew = tweetNew.replace(/cock/gi, 'thorax'); }
    else if (/porns?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/porns/gi, 'sauces'); tweetNew = tweetNew.replace(/porn/gi, 'sauce'); }
    else if (/sluts?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/sluts/gi, 'bee-lovers'); tweetNew = tweetNew.replace(/slut/gi, 'bee-lover'); }
    else if (/dicks?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/dicks/gi, 'stingers'); tweetNew = tweetNew.replace(/dick/gi, 'stinger'); }
    else if (/shits?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/shits/gi, 'buggers'); tweetNew = tweetNew.replace(/shit/gi, 'bugger'); }
    else if (/fuckers?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/fuckers/gi, 'heckers'); tweetNew = tweetNew.replace(/fucker/gi, 'hecker'); }
    else if (/fucking/i.test(tweetNew) == true) { tweetNew = tweetNew = tweetNew.replace(/fucking/gi, 'hecking'); }
    else if (/fucks?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/fucks/gi, 'heckers'); tweetNew = tweetNew.replace(/fuck/gi, 'heck'); }
    else if (/(white|black) people/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/(white|black) people/gi, 'snake people'); }
    else if (/jews?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/jews/gi, 'bees'); tweetNew = tweetNew.replace(/jew/gi, 'bee'); }
    else if (/nazis?/i.test(tweetNew) == true) { tweetNew = tweetNew.replace(/nazis/gi, 'wasps'); tweetNew = tweetNew.replace(/nazi/gi, 'wasp'); }
    else { tweetNew = tweetNew; }

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

var nsfw = /(cum|whores?|piss|nsfw|cocks?|dicks?|porns?|sluts?|shits?|fucks?|fucking|fuckers?|(white|black) people|jews?|nazis?)/gi; //NAUGHTY FILTER