var cleanupArray = [
    /\b(RT|MT) .+/, // RTs
    /(^|\s)(#[a-z\d-]+)/gi, // Hashtags
    /\n/, // Extra lines
    /\"|\(|\)/, // Attribution
    /\s*((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, // Hyperlinks
    // /@\w{1,15}/gi, // @ Mentions
    /(^|\s)(_[a-z\d-]+)/gi, // Underscores
    /&gt;/gi, // Junky Unicode
    /\"\b/g // Extraneous quotation marks
];

module.exports = {
    cleanupArray: cleanupArray
}