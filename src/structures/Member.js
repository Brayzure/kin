const memberScoring = require("../scoring/memberScoring");
const Database = require("../Database");

class Member {
    constructor(memberObject) {
        this.data = memberObject;
        this.messageCount = 0;
        this.syncScore();
    }

    async syncScore() {
        const details = await Database.getMemberDetails(this.data);
        if(details) this.messageCount = details.message_count;
    }

    get score() {
        return memberScoring.score(this);
    }

    get newAccountScore() {
        return memberScoring.newAccountScore(this);
    }

    get joinedScore() {
        return memberScoring.joinedScore(this);
    }

    get avatarScore() {
        return memberScoring.avatarScore(this);
    }

    get messageScore() {
        return memberScoring.messageScore(this);
    }

    get mitigatorFactor() {
        return memberScoring.mitigatorFactor(this);
    }
}

const FLAGS = {
    EMPLOYEE: 1 << 0,
    PARTNER: 1 << 1,
    HS_EVENTS: 1 << 2,
    BUG_HUNTER: 1 << 3,
    HS_BRAVERY: 1 << 6,
    HS_BRILLIANCE: 1 << 7,
    HS_BALANCE: 1 << 8,
    EARLY_SUPPORTER: 1 << 9,
    TEAM_USER: 1 << 10
}

module.exports = Member;
