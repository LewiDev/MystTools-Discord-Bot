import { Client, Message, TextChannel } from "discord.js";

const delay = (ms:any) => new Promise(res => setTimeout(res, ms));


export default {
    name: "messageCreate",
    execute: async (message: Message, client: Client) => {
        if (message.member?.id === '1313385778860134400') return; //myst
        if(message.member?.id === '1213487623688167494') return; //navi
        if(message.member?.id === client.user?.id) return;

        if(message.channel.id !== '1335994385334140968') return
        
        if(!(message.channel instanceof TextChannel)) return;

        if (message.attachments.size > 0) {
            message.delete();
            let msg = await message.channel.send('<@' + message.member + '> You can only send `rpg miniboss` to this channel!')
            await delay(5000);
            msg.delete();
            return;
        }


        if(!message.content) { // is an embed
            if(!message.embeds) {
                message.delete();
                return;
            }
            if(message.embeds[0].footer != null && (message.embeds[0].footer.text === 'Check the short version of this command with "rd"' || message.embeds[0].footer.text === 'Check the long version of this command with "cd"')) {
                message.delete();
                return;
            }
            if(!message.embeds[0].description && !message.embeds[0].fields) {
                message.delete();
                return;
            }
            if((message.embeds[0].fields[0] != null && message.embeds[0].fields[0].name === "Type `fight` to help and get a reward!") || (message.embeds[0].fields[1] != null && message.embeds[0].fields[1].name === "Miniboss boost") || (message.embeds[0].description && message.embeds[0].description.includes('nobody won anything')) || (message.embeds[0].description && message.embeds[0].description.includes('If you don\'t want to wait this much,'))) {
                return
            }
            message.delete();
        } else {
            if(message.content.toLowerCase().includes('rpg miniboss') || message.content.toLowerCase().includes('fight')) {
                return
            } else {
                message.delete();
                let msg = await message.channel.send('<@' + message.member + '> You can only send `rpg miniboss` to this channel!')
                await delay(5000);
                msg.delete();
            }  
        }        
    }
}
