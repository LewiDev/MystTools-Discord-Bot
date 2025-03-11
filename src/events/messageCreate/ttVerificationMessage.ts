import { Interaction, EmbedBuilder, Message, Client, TextChannel, GuildMember } from "discord.js";
import manageStickyMessage from "../../functions/stickyMessages/manageStickyMessage";
import { apiHandler } from "../../handlers/apiHandler";


export default {
    name: "messageCreate",
    execute: async (message: Message, client: Client) => {

        const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

        // Verification channel ID
        const VERIFICATION_CHANNEL_ID = '1342148013522686103';
        // RPG Bot ID
        const RPG_BOT_ID = '555955826880413696';
        // Admin ID who can start verification
        const ADMIN_ID = '590575157718941708';
        // Role IDs for time travel levels
        const TT_ROLES = {
        low: '1319256584706064394',  // 1-24 time travels
        high: '1319256610786508820'  // 25+ time travels
        };


        if (message.channel.id !== VERIFICATION_CHANNEL_ID) return;

        if (message.author.id === ADMIN_ID && message.content.toLowerCase() === 'start verification') {
            await manageStickyMessage(client, message.channel.id);
            return;
        }

        if (!message.author.bot) {
            if (message.content.toLowerCase() === 'rpg p') {
            // Store username -> member ID mapping
                await apiHandler.setTTLog(message.author.username, message.author.id);
                return;
            } else {
            // Delete invalid messages and warn user
                const reply = await message.reply("This channel is for verifying your TT. You can only send `rpg p` to this channel!");
                await delay(5000);
                await message.delete().catch(err => console.log('Error deleting message:', err));
                await reply.delete().catch(err => console.log('Error deleting reply:', err));
                await manageStickyMessage(client, message.channel.id);
            }
            
            // Refresh sticky message
            
            return;
        }
        
        if (message.author.id === RPG_BOT_ID && message.embeds.length > 0) {
            const embed = message.embeds[0];
            
            // Verify this is a profile embed
            if (!embed.author?.name) return;
            
            try {
            // Extract username from the author field
                //const embedAuthorMatch = embed.author.name.match(/(?<!— profile\s)\b\w+\b/g);
                //sconst embedAuthorMatch = embed.author.name.match(/^(.*?)\s—\sprofile$/i);
                //const embedAuthorMatch = embed.author.name.match(/^(.+?)\s—\sprofile$/i);
                const embedAuthorMatch = [ (embed.author.name).slice(0, -10) ];
                console.log(embedAuthorMatch);
                if (!embedAuthorMatch?.[0]) return;
                
                const username = embedAuthorMatch[0].toLowerCase();
                const memberId = (await apiHandler.getTTLog(username)).userId;
                
                if (!memberId) {
                    console.log(`No member ID found for username: ${username}`);
                    return;
                }
                
                console.log(memberId);
                // Fetch the member
                const member = await message.guild?.members.fetch(memberId) as GuildMember;
                if (!member) {
                    console.log(`Member not found for ID: ${memberId}`);
                    return;
                }
                
                // Extract time travels from the embed
                if (!embed.fields?.[0]?.value) {
                    console.log('No fields found in the embed');
                    return;
                }
                
                const embedField = embed.fields[0].value;
                const timeTravelsMatch = embedField.match(/\*\*Time travels\*\*: (\d+)/);
                

                let skip;
                if (!timeTravelsMatch || !timeTravelsMatch[1]) {
                    console.log('Time travels data not found in embed');
                    skip = true;
                }
                
                
                let timeTravels;
                let roleId;
                if(!skip && timeTravelsMatch) {
                    timeTravels = parseInt(timeTravelsMatch[1], 10);

                    if (timeTravels >= 25) {
                        roleId = TT_ROLES.high;
                    } else if (timeTravels >= 1) {
                        roleId = TT_ROLES.low;
                    } 
                }
                // Determine role to assign
                
                
                // Prepare success message
                let messageContent = `<@${member.id}> You don't have enough time travels for a role.`;

                if (roleId !== undefined) {
                    const role = await message.guild?.roles.cache.get(roleId);
                    if (role) {
                    await (member as GuildMember).roles.add(role);
                    messageContent = `<@${member.id}> Your TT has been verified!\nYou have been given the **${role.name}** role.`;
                    }
                } 
                
                // Remove from tracking collection and send confirmation
                await apiHandler.deleteTTLog(username);
                if(!(message.channel instanceof TextChannel)) return; 
                await message.channel.send(messageContent)
                await manageStickyMessage(client, message.channel.id);
                // Refresh sticky message
                
                
            } catch (error) {
                console.error('Error processing verification:', error);
            }
        }
    }
};

