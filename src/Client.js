const Eris = require("eris");
const Command = require("./Command");
const Guild = require("./structures/Guild");

const Database = require("./Database");
const messageScoring = require("./scoring/messageScoring");

class Client {
    constructor(token, prefix, developer) {
        this._token = token;
        this._prefix = prefix;
        this.developer = developer;
        this.discordClient = new Eris(this._token);
        this.commandHandler = new Command(this._prefix, this);
        this.guilds = new Map();
    }

    connect() {
        this.setupEvents();
        this.discordClient.connect();
    }

    setupEvents() {
        this.discordClient.on("ready", this.onReady.bind(this));
        this.discordClient.on("messageCreate", this.onMessage.bind(this));
    }

    updateGuild(guild) {
        const existingGuild = this.guilds.get(guild.id);
        if(!existingGuild) {
            this.guilds.set(guild.id, new Guild(guild));
        }
    }

    onReady() {
        console.log("Kin Anti-Spam has readied!");
        for(const guild of this.discordClient.guilds.values()) {
            this.updateGuild(guild);
        }
    }

    async onMessage(message) {
        // Ignore DMs
        if(!message.channel.guild) return;
        
        // Filter handling here
        console.log(`Message Content: ${message.content}`);
        const memberDetails = await Database.updateMemberMessageCount(message.member);
        console.log(`Member Messages: ${memberDetails.message_count}`);
        const member = await this.guilds.get(message.channel.guild.id).getMember(message.member.id);
        console.log(`Member Score: ${member.score}`);
        const messageScore = await messageScoring.score(message);
        console.log(`Message Score: ${messageScore}`);
        //console.log(`[${messageScore.toPrecision(2)}]: ${message.content}`);

        member.messageCount++;
        console.log(`F: ${member.messageCount}`);

        // Ignore message if shard isn't ready
        if(!message.channel.guild.shard.ready) {
            return;
        }

        // Handle commands
        let commandResult = await this.commandHandler.process(message);
        if(commandResult) {
            message.channel.createMessage({ embed: commandResult });
        }
    }
}

module.exports = Client;
