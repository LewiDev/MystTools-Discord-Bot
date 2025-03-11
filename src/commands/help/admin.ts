import { ActionRowBuilder, ButtonBuilder, ComponentType, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import getHelpEmbed from "../../functions/help/getHelpEmbed";

export default {
    name: "admin",
    description: "Sends admin help message",
    execute: async (message: Message, args: string[]) => {
        let adminEmbed = getHelpEmbed("admin");

        if(!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.")
        }

        if(!(message.member?.roles.cache.some(r => r.id === '1311732675949756489'))) {
            return message.reply("❌ You do not have permission to use this command.")
        }

        await message.channel.send({ embeds: [adminEmbed[0] as EmbedBuilder] })
    }
};