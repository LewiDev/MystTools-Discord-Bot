import { ChannelManager, Client, ClientOptions, Collection, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import { handleEvents } from "./handlers/eventHandler";
import { handleCommands } from "./handlers/commandHandler";

export class CustomClient extends Client<true> {
    public channelEmoji: Collection<string, Date>;
    public channelName: Collection<string, Date>;

    constructor(options: ClientOptions) {
        super(options);
        this.channelEmoji = new Collection(); // Initialize the Collection
        this.channelName = new Collection(); // Initialize the Collection
    }
}


const client = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});


client.once("ready", () => {
    console.log(`✅ Bot is online as: ${client.user?.tag}`);
});

// Load commands and events **before** logging into Discord
(async () => {
    await handleCommands(client); // Fix: Ensure commands load before login
    handleEvents(client);

    client.login("MTMxMzM4NTc3ODg2MDEzNDQwMA.GlaWlU.AZQJleLOcDmsnK8pXsOtDOHnDjVIKUreXv-qrM");
})();
