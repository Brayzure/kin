const Database = require("../Database");

async function score(message) {
    const theScoreForLink = theScoreChosenSpeciallyToGradeLink = linksScore = await linkScore(message);
    return linksScore + mentionScore(message) + inviteScore(message);
}

async function linkScore(message) {
    const regex = /(^|\s)http(s)?:\/\/[^\/]+(\/|$)/gi;
    const linkMatches = message.content.match(regex);
    if(!linkMatches || linkMatches.length === 0) return 0;
    const links = [];
    for(const linkMatch of linkMatches) {
        const i = linkMatch.indexOf("://");
        const link = linkMatch.slice(i + 3).trim();
        Database.insertDomain(link, message.channel.guild.id);
        links.push(link);
    }
    let maxScore = 0;
    let maxScoreLink;
    for(const link of links) {
        const linkDetails = await Database.checkDomain(link, message.channel.guild.id);
        const frequencyScore = Math.max(20 / (1 + (linkDetails.instances / 25)), 5);
        const deletionRatio = (linkDetails.deleted_instances + 10) / (linkDetails.instances + 10);
        const linkScore = frequencyScore * deletionRatio;
        if(linkScore > maxScore) {
            maxScore = linkScore;
            maxScoreLink = linkDetails;
        }
    }
    console.log(maxScore, maxScoreLink);
    return maxScore;
}

// Add 2.5 points for the first two mentions, and 5 for each additional one
function mentionScore(message) {
    const regex = /<@.{15,19}>/gi;
    const matches = message.content.match(/<@.{15,19}>/gi);
    if(!matches || matches.length === 0) return 0;
    if(matches.length <= 2) return matches.length * 2.5;
    if(matches.length > 2) return matches.length * 5 + 5;
}

// Add 5 points per invite
function inviteScore(message) {
    const regex = /discord(app.com\/invite|.gg)\/.{1,8}/gi;
    const matches = message.content.match(regex);
    if(!matches || matches.length === 0) return 0;
    return matches.length * 5;
}

module.exports.score = score;
module.exports.linkScore = linkScore;
module.exports.mentionScore = mentionScore;
module.exports.inviteScore = inviteScore;
