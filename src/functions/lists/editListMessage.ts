import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import getOccupiedList from "./getOccupiedList";

export default async (empty: boolean, guild: Guild) => {
    try {
        // ✅ Fetch Arena List Data
        const list = await apiHandler.getBoostedArena(guild.id);
        if (!list) {
            console.error(`❌ Failed to fetch arena list for guild: ${guild.id}`);
            return;
        }

        // ✅ Fetch the channel where the message is located
        //const channel = await guild.channels.fetch("1335704955037810748") as TextChannel;
        const channel = await guild.channels.fetch("1335704955037810748") as TextChannel;
        
        if (!channel) {
            console.error(`❌ Failed to fetch list channel for guild: ${guild.id}`);
            return;
        }

        // ✅ Fetch the specific message that needs updating
        
        const message = await channel.messages.fetch(list.messageId);
        if (!message) {
            console.error(`❌ Failed to fetch list message for guild: ${guild.id}`);
            return;
        }

        let messageEmbed = new EmbedBuilder()
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

        // ✅ If the list is empty, use `getOccupiedList()`
        if (!empty) {
            const occupiedListEmbed = await getOccupiedList(message, list);
            if (occupiedListEmbed) {
                messageEmbed = occupiedListEmbed;
            }
        }

        // ✅ Default embed when list is not empty
        await message.edit({ embeds: [messageEmbed] });


    } catch (error) {
        console.error(`❌ Error updating list message for guild: ${guild.id}`, error);
    }
};
