const command = {
    description: "Pings the bot and returns latency.",
    permissions: [ "manageMessages" ],
    run: async function({ message }) {
        const shard = message.channel.guild.shard;
        return `Pong! (Shard: ${shard.id} | ${shard.latency}ms)`;
    }
}

module.exports = command;
