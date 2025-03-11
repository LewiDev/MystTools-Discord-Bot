import { Message } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import editListMessage from "../../functions/lists/editListMessage";

export default {
    name: "removefromlist",
    description: "Remove a user from the list.",
    execute: async (message: Message, args: string[]) => {
        if(!(message instanceof Message)) return;
        if(!message.member) return;
        if(!message.guild) return;

        if(!message.member.roles.cache.some(r => r.id === '1311732675949756489')) {
            message.reply("You do not have permission to use this command.");
        }

        if(!message.mentions.members) return message.reply({ content: "You need to mention a user."});
        
        let member = message.mentions.members.first();

        if(!member) return message.reply({ content: "User not found."});
        
        const list = await apiHandler.getBoostedArena(message.guild.id);
        if(!list) return message.reply({ content: "No active arena list found."});
        
        let id = `${member.id}`
        if(!list.members.includes(id)) return message.reply({ content: "they are not in the list." });
                    
        list.members = await list.members.filter((member: any) => member !== id);

        await apiHandler.setBoostedArena(message.guild.id, list.messageId, list.members);
        
        await editListMessage(false, message.guild);
        
        await message.reply({ content: "User has been removed from the list."});
    }
};


