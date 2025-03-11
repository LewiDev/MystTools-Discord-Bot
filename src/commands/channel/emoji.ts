import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

const msToTime = (ms: number) => {
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}m ${seconds}s`;
};

// ✅ Function to clean emoji input (prevents `:emoji_name:` format)
const sanitizeEmoji = (emoji: string): string => {
    return emoji.match(/^(\p{Extended_Pictographic}|\p{Emoji_Component})$/u) ? emoji : "";
};

// ✅ Function to update the channel name with the emoji
const replaceEmoji = (channelName: string, emoji: string): string => {
    return channelName.replace(/^\p{Extended_Pictographic}|\p{Emoji_Component}/u, "").trimStart().replace(/^︱/, "") // Remove previous emoji if exists
        .replace(/^/, `${emoji}︱`); // Add new emoji
};

export default {
    name: "emoji",
    description: "Change the emoji in your channel name",
    execute: async (message: Message, args: string[]) => {
        if (!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.");
        }

        let emoji = args[0];
        if (!emoji) return message.reply("❌ You need to provide an emoji.");

        // ✅ Sanitize emoji to prevent `:emoji_name:` format
        emoji = sanitizeEmoji(emoji);
        if (!emoji) return message.reply("❌ Invalid emoji format. Please provide a valid emoji.");

        try {
            // ✅ Fetch channel data
            const channelData = await apiHandler.getChannel("", message.channel.id);
            if (!channelData || channelData.channelId !== message.channel.id) {
                return message.reply("❌ You are not the owner of this channel.");
            }

            // ✅ Check cooldown from API
            const cooldownData = await apiHandler.getCooldown(message.channel.id);
            const emojiCooldownTimestamp = cooldownData.emojiExpiresAt ? new Date(cooldownData.emojiExpiresAt).getTime() : 0;
            if (emojiCooldownTimestamp > Date.now()) {  // ✅ Check if cooldown is still active
                const remainingTime = msToTime(emojiCooldownTimestamp - Date.now());
                const embed = new EmbedBuilder()
                    .setTitle("⏰ On Cooldown")
                    .setDescription(`\`${remainingTime}\``);
                return message.reply({ embeds: [embed] });
            }

            // ✅ Prevent unnecessary API calls
            const newChannelName = replaceEmoji(message.channel.name, emoji);
            if (message.channel.name === newChannelName) {
                return message.reply("✅ Your channel already has this emoji.");
            }

            // ✅ Update the channel name
            await message.channel.setName(newChannelName);
            await message.reply(`✅ Channel emoji has been changed to ${emoji}`);

            // ✅ Set cooldown in API
            await apiHandler.setCooldown(message.channel.id, "emoji");
            setTimeout(async () => await apiHandler.removeCooldown(message.channel.id, 'emoji'), 3600000); // 1 hr cooldown

        } catch (error) {
            console.error("❌ Error changing channel emoji:", error);
            return message.reply("⚠️ There was an error changing the channel emoji. Please try again later.");
        }
    }
};
