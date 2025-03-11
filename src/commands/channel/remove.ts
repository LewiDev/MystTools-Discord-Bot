import { Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "remove",
    description: "Remove a member's access to view and type in your channel",
    execute: async (message: Message, args: string[]) => {
        if (!args[0]) return message.reply("❌ Please mention a user or provide a valid user ID.");

        const target = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (!target) return message.reply("❌ Invalid user. Please mention a user or provide a valid user ID.");

        if (!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.");
        }

        if(target.roles.cache.has("1311732675949756489")) {
            return message.reply("❌ You cannot remove access from this user.");
        }

        try {
            // ✅ Fetch channel data
            const channelData = await apiHandler.getChannel(message.author.id);

            if (!channelData || channelData.channelId !== message.channel.id) {
                return message.reply("❌ You are not the owner of this channel.");
            }

            // ✅ Check if the user already has no access
            const currentPerms = message.channel.permissionsFor(target);
            if (!currentPerms?.has(PermissionFlagsBits.SendMessages)) {
                return message.reply(`✅ <@${target.id}> already does not have access to this channel.`);
            }

            // ✅ Remove access
            await message.channel.permissionOverwrites.create(target, {
                ViewChannel: true,
                SendMessages: false
            });

            return message.reply(`✅ Successfully removed <@${target.id}>'s access.`);
        } catch (error) {
            console.error("❌ Error removing access:", error);
            return message.reply("⚠️ There was an error removing access. Please try again later.");
        }
    }
};
