import { Client, Message } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "messageCreate",
    execute: async (message: Message, client: Client) => {
        if(message.author.bot) return;
        if(message.channel.id !== '1298937946774306876') return;

        if(!message.content.toLowerCase().startsWith('rpg')) return;
        
        let mtUserData = await apiHandler.getMTUser(message.author.id);
        if(!mtUserData) mtUserData = { rpgMessages: 0 };
        mtUserData.rpgMessages += 1;
        await apiHandler.updateMTUser(message.author.id, mtUserData);

        message.reply("<@" + message.author.id + "> has tried to run a command in erpg-general: " + mtUserData.rpgMessages + " **time(s)** <a:a_haha:1337413790563696754>");
    }
}