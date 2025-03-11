import { ActionRowBuilder, ButtonBuilder, ComponentType, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import getHelpEmbed from "../functions/help/getHelpEmbed";

export default {
    name: "help",
    description: "Sends help message",
    execute: async (message: Message, args: string[]) => {

        if(!(message.channel instanceof TextChannel)) {
            return message.reply("❌ This command can only be used in text channels.")
        }

        let mainEmbedAndRow = getHelpEmbed("main");
        let channelsEmbedAndRow = getHelpEmbed("channels");
        let arenaEmbedAndRow = getHelpEmbed("arena");

        let sentMessage = await message.channel.send({ embeds: [mainEmbedAndRow[0] as EmbedBuilder], components: [mainEmbedAndRow[1] as ActionRowBuilder<StringSelectMenuBuilder>] })


        const collector = sentMessage.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

        collector.on("collect", async (interaction) => {
            if(message.author.id !== interaction.member.id) return interaction.deferUpdate();

            if(interaction.values[0] === 'channels') {
                sentMessage.edit({ embeds: [channelsEmbedAndRow[0] as EmbedBuilder], components: [channelsEmbedAndRow[1] as ActionRowBuilder<StringSelectMenuBuilder>] })
            } else if(interaction.values[0] === 'arena') {
                sentMessage.edit({ embeds: [arenaEmbedAndRow[0] as EmbedBuilder], components: [arenaEmbedAndRow[1] as ActionRowBuilder<StringSelectMenuBuilder>] })
            } else {
                sentMessage.edit({ embeds: [mainEmbedAndRow[0] as EmbedBuilder], components: [mainEmbedAndRow[1] as ActionRowBuilder<StringSelectMenuBuilder>] })
            }
            interaction.deferUpdate();
        });

        
        
    }
};