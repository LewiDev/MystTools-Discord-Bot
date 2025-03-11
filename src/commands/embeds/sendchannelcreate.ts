import { ActionRow, ActionRowBuilder, ButtonBuilder, ComponentType, EmbedBuilder, Message, TextChannel } from "discord.js";

export default {
    name: "sendchannelcreate",
    description: "Sends the channel create message",
    execute: async (message: Message, args: string[]) => {
        if(message.member?.id === '411267877103075338' || message.member?.id === '590575157718941708') {
            const create = new ButtonBuilder()
                .setLabel("Create Channel")
                .setCustomId("createChannel")
                .setStyle(2);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(create);

            const embed = new EmbedBuilder()
                .setTitle("CUSTOM CHANNELS ✨")
                .setDescription("-# *these are the requirements for creating a custom channel*\n\n**NOTE:** 📝\nmembers of the following guilds: <@&1295677073582719007> / <@&1310609072483078205>, are able to create a custom channel without meeting any of the requirements\n\n**REQUIREMENTS:** 📋\nreach level 50 on either <@&1268131583777439825> or <@&1268229387149643827>\n\n**PERKS:** 🎉\n- level 50+ grants you a private channel in which, only you can type, and manage messages\n- add / remove people from typing in your channel\n\n**ADDITIONAL INFORMANTION:** 📝\n- if you are yet to pick a class, head over to <id:customize> to select a class\n- `myst h channels` to see all channel commands");

          
            let content = "**CUSTOM CHANNELS** ✨\n*-# these are the requirements for creating a custom channel*\n> **NOTE:** 📝\n> members of the following guilds: <@&1295677073582719007> / <@&1310609072483078205>, are able to create a custom channel without meeting any of these requirements\n> \n> **REQUIREMENTS:** 📋\n> reach level 50 on either <@&1268131583777439825> or <@&1268229387149643827>\n> \n> **PERKS:** 🎉\n> level 50+ grands you a private channel in which, only you can type, and manage messages in\n> add / remove people from typing in your channel\n\n**ADDITIONAL INFORMANTION:** 📝\n*- if you are yet to pick a class, head over to <id:customize> to select a class\n- `myst h channels` to see all channel commands*"

            if (message.channel instanceof TextChannel) {
                await message.channel.send({embeds: [embed], components: [row]});
            }

        }
    }
};
