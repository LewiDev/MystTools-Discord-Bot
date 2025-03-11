import { Message, EmbedBuilder, TextChannel, PermissionFlagsBits } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

const msToTime = (ms: number) => {
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}m ${seconds}s`;
};

// ✅ Function to sanitize channel names (prevents invalid formatting)
const sanitizeName = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "-").toLowerCase();
};

// ✅ Function to replace username in channel name
const replaceUsername = (channelName: string, newName: string): string => {
    return channelName.replace(/︱.*/, `︱${newName}`);
};

export default {
    name: "name",
    description: "Change the name of your channel",
    execute: async (message: Message, args: string[]) => {
        if (!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.");
        }

        if (!args[0]) {
            return message.reply("❌ You need to provide a new channel name.");
        }

        let newName = sanitizeName(args[0]);
        if (!newName) return message.reply("❌ Invalid channel name. Use letters, numbers, and `-` only.");

        try {
            // ✅ Fetch channel data
            const channelData = await apiHandler.getChannel("", message.channel.id);
            if (!channelData || channelData.channelId !== message.channel.id) {
                return message.reply("❌ You are not the owner of this channel.");
            }

            // ✅ Check cooldown from API
            const cooldownData = await apiHandler.getCooldown(message.channel.id);
            if (cooldownData.emojiActive) { 
                const remainingTime = await msToTime(new Date(cooldownData.nameExpiresAt).getTime() - Date.now());
                const embed = new EmbedBuilder()
                    .setTitle("⏰ On Cooldown")
                    .setDescription(`\`${remainingTime}\``);

                return message.reply({ embeds: [embed] });
            }

            // ✅ Prevent unnecessary API calls
            const updatedChannelName = replaceUsername(message.channel.name, newName);
            if (message.channel.name === updatedChannelName) {
                return message.reply("✅ Your channel already has this name.");
            }

            // ✅ Update the channel name
            await message.channel.setName(updatedChannelName);
            await message.reply(`✅ Channel name has been changed to **${newName}**`);

            // ✅ Set cooldown in API
            await apiHandler.setCooldown(message.channel.id, "name");
            setTimeout(async () => await apiHandler.removeCooldown(message.channel.id, 'name'), 3600000); // 1 hr cooldown

        } catch (error) {
            console.error("❌ Error changing channel name:", error);
            return message.reply("⚠️ There was an error changing the channel name. Please try again later.");
        }
    }
};
