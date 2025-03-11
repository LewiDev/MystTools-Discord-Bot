import { Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "public",
    description: "Set your channel status to public",
    execute: async (message: Message) => {
        if (!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.");
        }

        try {
            // ✅ Fetch channel data
            const channelData = await apiHandler.getChannel(message.author.id);

            if (!channelData || channelData.channelId !== message.channel.id) {
                return message.reply("❌ You are not the owner of this channel.");
            }

            // ✅ Check existing permissions before updating
            const currentPerms = message.channel.permissionOverwrites.cache.get('1225872594440294450');
            if (currentPerms?.allow.has(PermissionFlagsBits.ViewChannel) && currentPerms?.deny.has(PermissionFlagsBits.SendMessages)) {
                return message.reply("✅ Your channel is already public.");
            }

            // ✅ Update permissions & send confirmation in parallel
            await Promise.all([
                message.channel.permissionOverwrites.create('1225872594440294450', {
                    ViewChannel: true,
                    SendMessages: false,
                    ReadMessageHistory: true
                }),
                message.channel.send({ content: "🔓 Your channel is now public." })
            ]);

        } catch (error) {
            console.error("❌ Error making channel public:", error);
            return message.reply("⚠️ There was an error making your channel public. Please try again later.");
        }
    }
};
