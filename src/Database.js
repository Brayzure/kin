const Postgres = require("pg");
const client = new Postgres.Client();

init(client);

async function init(client) {
    await client.connect();
    console.log("Connected to Postgres database!");
}

module.exports = {
    checkDomain: async (domain, guildID) => {
        const result = await client.query({
            text: "SELECT * FROM domains WHERE $1 ILIKE domain || '%' AND guild_id = $2",
            values: [ domain, guildID ]
        });
        return result.rows[0];
    },
    insertDomain: async (domain, guildID) => {
        const result = await client.query({
            text: "INSERT INTO domains (domain, guild_id, instances, deleted_instances) VALUES ($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT domain_key DO UPDATE SET instances = domains.instances + 1",
            values: [ domain, guildID, 1, 0 ]
        });
    },
    updateMemberMessageCount: async (member) => {
        const result = await client.query({
            text: "INSERT INTO members (id, guild_id, message_count) VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT member_key DO UPDATE SET message_count = members.message_count + 1 RETURNING *",
            values: [ member.id, member.guild.id, 1 ]
        });
        return result.rows[0];
    },
    getMemberDetails: async (member) => {
        const result = await client.query({
            text: "SELECT * FROM members WHERE id = $1 AND guild_id = $2",
            values: [ member.id, member.guild.id ]
        });
        return result.rows[0];
    }
}
