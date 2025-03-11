

import { Message, PermissionsBitField, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "hide",
    description: "Hide your channel from everyone except allowed roles",
    execute: async (message: Message) => {
        if (!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.");
        }

        try {
            // ✅ Fetch channel data from API
            const channelData = await apiHandler.getChannel(message.author.id);
            if (!channelData || channelData.channelId !== message.channel.id) {
                return message.reply("❌ You are not the owner of this channel.");
            }

            // ✅ Update permissions (Hide from @everyone, allow owner & specific roles)
            await Promise.all([
                message.channel.permissionOverwrites.set([
                    { id: message.guild!.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: message.member!.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages] },
                    { id: "1311732675949756489", allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages] },
                    { id: "1268695331487485984", allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ]),
                message.channel.send({ content: "🔒 This channel is now hidden." })
            ]);

            console.log(`✅ Channel ${message.channel.id} is now hidden.`);
        } catch (error) {
            console.error("❌ Error hiding channel:", error);
            return message.reply("⚠️ There was an error hiding this channel. Please try again later.");
        }
    }
};


