function score(member) {
    return (newAccountScore(member) + joinedScore(member) + avatarScore(member) + messageScore(member)) / mitigatorFactor(member);
}

function newAccountScore(member) {
    const timeSinceAccountCreation = Date.now() - member.data.createdAt;
    return timeSinceAccountCreation > 784000000 ? 0 : 10 / ((timeSinceAccountCreation / (784000000 / 4)) + 1);
}

function joinedScore(member) {
    const timeSinceAccountJoin = Date.now() - member.data.joinedAt;
    return timeSinceAccountJoin > 262800000 ? 0 : 10 / ((timeSinceAccountJoin / (262800000 / 4)) + 1);
}

function avatarScore(member) {
    return !!member.data.avatar ? 0 : 5;
}

function messageScore(member) {
    return 10 / (1 + (member.messageCount / 50));
}

function mitigatorFactor(member) {
    let factor = 1;
    if(member.data.roles.length) factor *= Math.min(2, (member.data.roles.length / 2) + 1);
    return factor;
}

module.exports.score = score;
module.exports.newAccountScore = newAccountScore;
module.exports.joinedScore = joinedScore;
module.exports.avatarScore = avatarScore;
module.exports.messageScore = messageScore;
module.exports.mitigatorFactor = mitigatorFactor;

