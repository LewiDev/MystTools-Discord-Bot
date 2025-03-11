import { Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "grant",
    description: "Grant a member access to view and type in your channel",
    execute: async (message: Message, args: string[]) => {
        if (!args[0]) return message.reply("❌ Please mention a user or provide a valid user ID.");

        const target = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (!target) return message.reply("❌ Invalid user. Please mention a user or provide a valid user ID.");

        if (!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.");
        }

        try {
            // ✅ Fetch channel data
            const channelData = await apiHandler.getChannel(message.author.id);

            if (!channelData || channelData.channelId !== message.channel.id) {
                return message.reply("❌ You are not the owner of this channel.");
            }


            // ✅ Grant access
            await message.channel.permissionOverwrites.create(target, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });

            return message.reply(`✅ Successfully granted access to <@${target.id}>.`);
        } catch (error) {
            console.error("❌ Error granting access:", error);
            return message.reply("⚠️ There was an error granting access. Please try again later.");
        }
    }
};
