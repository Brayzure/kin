class Member {
    constructor(memberObject) {
        this.data = memberObject;
    }

    get score() {
        return (this.newAccountScore + this.joinedScore + this.avatarScore) / this.mitigatorFactor;
    }

    get newAccountScore() {
        const timeSinceAccountCreation = Date.now() - this.data.createdAt;
        return timeSinceAccountCreation > 784000000 ? 0 : 10 / ((timeSinceAccountCreation / (784000000 / 4)) + 1);
    }

    get joinedScore() {
        const timeSinceAccountJoin = Date.now() - this.data.joinedAt;
        return timeSinceAccountJoin > 262800000 ? 0 : 10 / ((timeSinceAccountJoin / (262800000 / 4)) + 1);
    }

    get avatarScore() {
        return !!this.data.avatar ? 0 : 5;
    }

    get mitigatorFactor() {
        let factor = 1;
        if(this.data.roles.length) factor *= Math.min(2, (this.data.roles.length / 2) + 1);
        /*
        if(this.data.flags | FLAGS.EMPLOYEE
            || this.data.flags | FLAGS.PARTNER
            || this.data.flags | FLAGS.BUG_HUNTER)
        {
            factor *= 16;
        }
        if(this.data.flags | FLAGS.HS_EVENTS)
        {
            factor *= 2;
        }
        else if(this.data.flags | FLAGS.HS_BRAVERY
            || this.data.flags | FLAGS.HS_BRILLIANCE
            || this.data.flags | FLAGS.HS_BALANCE)
        {
            factor *= 1.5;
        }
        */
        return factor;
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
