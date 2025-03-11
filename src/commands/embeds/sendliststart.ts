import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "sendliststart",
    description: "Sends the Boosted Arena List message",
    execute: async (message: any, args: any) => {
        if (!message.member.roles.cache.some((r: { id: string }) => r.id === "1311732675949756489")) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        let channel = message.channel;

        let embed = new EmbedBuilder()
            .setTitle("🍪 ARENA [0/10] 🍪")
            .setDescription(
                `\nSelect buttons below to join/leave the arena list.
                \n1️⃣
                \n2️⃣
                \n3️⃣
                \n4️⃣
                \n5️⃣
                \n6️⃣
                \n7️⃣
                \n8️⃣
                \n9️⃣
                \n🔟`
            );

        const join = new ButtonBuilder().setLabel("Join").setCustomId("joinList").setStyle(3);
        const leave = new ButtonBuilder().setLabel("Leave").setCustomId("leaveList").setStyle(4);
        const force = new ButtonBuilder().setLabel("Force Start").setCustomId("forceStart").setStyle(2);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(join, leave, force);

        const embed1 = new EmbedBuilder()
            .setTitle("INSTRUCTIONS 🍪")
            .setDescription(
                "Click the buttons to **join** or **leave** the arena list!\n" +
                "*There is an option to **force start** the list in case there are not 10 people who have joined, but enough people to have a good arena.*\n\n" +
                "**OUTSIDE COMMANDS** ⚒️\n\n" +
                "`myst arena list` - *see the current list of players*\n" +
                "`myst arena join` - *join the list from any channel*\n" +
                "`myst arena leave` - *leave the list from any channel*\n\n" +
                "*You will be pinged when the list starts*"
            );

        await channel.send({ embeds: [embed1] });
        const sentMessage = await channel.send({ embeds: [embed], components: [row] });

        await apiHandler.setBoostedArena(message.guild.id, sentMessage.id, []);
    }
};
