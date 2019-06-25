const Member = require("./Member");

class Guild {
    constructor(guild) {
        this.data = guild;
        this.members = new Map();
    }

    getMember(id) {
        let member = this.members.get(id);
        if(!member) {
            let cachedMember = this.data.members.get(id);
            if(!cachedMember) return undefined;
            member = new Member(cachedMember);
            this.members.set(id, member);
        }
        return member;
    }
}

module.exports = Guild;
