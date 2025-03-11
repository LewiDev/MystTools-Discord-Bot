
  
import { GuildMember, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "lock",
    description: "Lock your channel to prevent others from sending messages",
    execute: async (message: Message) => {
        if (!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.");
        }

        if (!(message.member instanceof GuildMember)) {
            return message.reply("❌ Unable to fetch member permissions.");
        }

        try {
            // ✅ Fetch channel data
            const channelData = await apiHandler.getChannel(message.author.id);
            if (!channelData || channelData.channelId !== message.channel.id) {
                return message.reply("❌ You are not the owner of this channel.");
            }

            // ✅ Check if the channel is already locked (everyone denied SendMessages)
            const everyonePerms = message.channel.permissionOverwrites.cache.get(message.guild!.roles.everyone.id);
            if (everyonePerms?.deny.has(PermissionFlagsBits.SendMessages)) {
                return message.reply("✅ This channel is already locked.");
            }

            // ✅ Remove SendMessages from all users except owner and specific roles
            const overwrites = message.channel.permissionOverwrites.cache.map(overwrite => ({
                id: overwrite.id,
                allow: overwrite.allow.remove(PermissionFlagsBits.SendMessages),
                deny: overwrite.deny.add(PermissionFlagsBits.SendMessages)
            }));

            await Promise.all([
                // Apply new permission overwrites
                message.channel.permissionOverwrites.set([
                    ...overwrites, // Retain existing permission structure while denying SendMessages
                    { id: message.guild!.roles.everyone.id, deny: [PermissionFlagsBits.SendMessages] },
                    { id: message.member.id, allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel] }, // Allow owner
                    { id: "1311732675949756489", allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel] }, // Allow specific role 1
                    { id: "1268695331487485984", allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel] }  // Allow specific role 2
                ]),
                message.channel.send({ content: `🔒 This channel is now locked. Only the owner can send messages.` })
            ]);

        } catch (error) {
            console.error("❌ Error locking channel:", error);
            return message.reply("⚠️ There was an error locking your channel. Please try again later.");
        }
    }
};



