import { Client, Message, TextChannel } from "discord.js";

const delay = (ms:any) => new Promise(res => setTimeout(res, ms));

export default {
    name: "messageCreate",
    execute: async (message: Message, client: Client) => {
        if(message.author.bot) return;
        if(message.channel.id !== '1313097404131573760' && message.channel.id !== '1318361517929926656') return;
        if(!(message.channel instanceof TextChannel)) return;
        if (message.member?.id === '1313385778860134400') return;
        if(!message.reference) {
            message.delete();
            let msg = await message.channel.send('<@' + message.member + '> You can only forward a message to this channel!')
            await delay(5000);
            msg.delete();
        }
    }
}

