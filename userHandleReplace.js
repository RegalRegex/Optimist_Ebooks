module.exports = {
    handleReplace: handleReplace
};

function handleReplace(tweetNew) {
    const max = replaceArray.length + 1;
    const min = 1;
    const handleRegex = /@\w{1,15}/gi;

        if (handleRegex.test(tweetNew) == true) {
            varRandom = Math.floor(Math.random() * (max - min) + 1)
            tweetNew = tweetNew.replace(handleRegex, replaceArray[varRandom]);
            console.log("UPDATED: " + tweetNew);
        }
    return tweetNew;
}

replaceArray = [
    'beep',
    '[REDACTED]',
    'a lonely snail',
    'the entire state of nevada',
    'wibble',
    'me',
    'worm on a string',
    'a single atom'
];