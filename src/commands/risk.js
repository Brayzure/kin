function classifyRisk(score) {
    if(score > 15) return "Very High";
    if(score > 10) return "High";
    if(score > 6) return "Moderate";
    if(score > 3) return "Low";
    return "Very Low";
}

const command = {
    description: "Retrieves a member's risk breakdown.",
    permissions: [ "manageMessages" ],
    run: async function({ args, client, message }) {
        const guild = client.guilds.get(message.channel.guild.id);
        const id = args.length ? args[0].replace(/\D/g, "") : message.author.id;
        const member = guild.getMember(id);

        if(!member) throw new Error("Could not find that user!");
        const embed = {
            title: `Risk breakdown for ${member.data.username}#${member.data.discriminator}`,
            description: `**Risk**: ${classifyRisk(member.score)}\n**Overall Score**: ${member.score.toPrecision(3)}`,
            color: 0x00ff00,
            fields: [
                {
                    name: "Raw Score",
                    value: (member.score * member.mitigatorFactor).toPrecision(3),
                    inline: true
                },
                {
                    name: "Mitigator Factor",
                    value: member.mitigatorFactor.toString(),
                    inline: true
                },
                {
                    name: "Account Creation Score",
                    value: member.newAccountScore.toPrecision(3),
                    inline: true
                },
                {
                    name: "Guild Join Score",
                    value: member.joinedScore.toPrecision(3),
                    inline: true
                },
                {
                    name: "Avatar Score",
                    value: member.avatarScore.toPrecision(3),
                    inline: true
                },
                {
                    name: "Message Count Score",
                    value: member.messageScore.toPrecision(3),
                    inline: true
                }
            ]
        }
        return embed;
    }
}

module.exports = command;
