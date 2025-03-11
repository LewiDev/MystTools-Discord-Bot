import { Message } from "discord.js";

export default {
    name: "ping",
    description: "basic ping command",
    execute: async (message: Message, args: string[]) => {
        message.reply("Pong!");
    }
};
