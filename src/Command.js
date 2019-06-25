class Command {
    constructor(prefix, client) {
        this.prefix = prefix;
        this.client = client;
        this.commandMap = new Map();
        this.loadCommands();
    }

    loadCommands() {
        const fs = require("fs");
        const directory = fs.readdirSync(`${__dirname}/commands`);
        for(const file of directory) {
            if(file.endsWith(".js")) {
                try {
                    const command = require(`./commands/${file}`);
                    this.commandMap.set(file.toLowerCase().slice(0, -3), command);
                }
                catch(err) {
                    console.error(`Error loading command '${file}': ${err.toString()}`);
                }
            }
        }
    }

    async process(message) {
        if(!message.content.startsWith(this.prefix)) return false;
        const checkResult = this.check(message);
        if(!checkResult.shouldRun) {
            console.debug(checkResult.details, checkResult.meta);
            return false;
        }
        const context = {
            message,
            args: checkResult.details.args,
            client: this.client,
            discord: this.client.discordClient,
            commandHandler: this
        }
        let embed = {
            color: COMMAND_COLORS.OK
        }
        try {
            let result = await checkResult.details.command.run(context);
            if(typeof result === "object") {
                embed = result;
            }
            else {
                embed.description = result;
            }
        }
        catch(err) {
            embed.color = COMMAND_COLORS.ERROR;
            embed.description = err.message
            console.error(`Command failed to run. Error: ${err} Metadata: ${JSON.stringify(checkResult.meta, null, 4)}`);
        }
        return embed;
    }

    check(message) {
        const args = message.content.slice(this.prefix.length).split(" ");
        const commandName = args.splice(0, 1)[0].toLowerCase();
        const command = this.commandMap.get(commandName);
        const meta = {
            commandName,
            args,
            guildID: message.channel.guild.id,
            guildName: message.channel.guild.name,
            channelID: message.channel.id,
            channelName: message.channel.name,
            userID: message.author.id,
            username: message.author.username + "#" + message.author.discriminator
        };
        if(!command) {
            return { shouldRun: false, status: "NOT_FOUND", details: `Command '${commandName}' not found.`, meta };
        }
        let missingPermissions = [];
        for(const permission of command.permissions) {
            if(!message.member.permission.has(permission)) missingPermissions.push(permission);
        }
        if(missingPermissions.length) {
            return { shouldRun: false, status: "MISSING_PERMISSION", details: `Command '${commandName}' missing permissions: ${missingPermissions.join(", ")}`, meta };
        }
        return { shouldRun: true, details: { command, args }, meta };
    }
}

const COMMAND_COLORS = {
    OK: 0x00ff00,
    ERROR: 0xff0000
}

module.exports = Command;
