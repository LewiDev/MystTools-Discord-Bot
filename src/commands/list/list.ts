import { Message, EmbedBuilder } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import getListMentions from "../../functions/lists/getListMentions";
import getOccupiedList from "../../functions/lists/getOccupiedList";

export default {
    name: "list",
    description: "Show the current Boosted Arena List",
    execute: async (message: Message, args: string[]) => {
        try {
            const list = await apiHandler.getBoostedArena(message.guild!.id);
            if (!list || !list.members.length) {
                return message.reply("❌ No active arena list found.");
            }

            const memberMentions = getListMentions(list);
            const membersFilled = memberMentions.filter((m: any) => m !== " ").length;

            const occupiedListEmbed = await getOccupiedList(message, list);
            const embed = new EmbedBuilder()
                .setTitle(`🍪 BOOSTED ARENA LIST [${membersFilled}/10] 🍪`)
                .setDescription(
                    memberMentions.map((mention: any, index: any) => `\n${index + 1}️⃣ ${mention}`).join("")
                )
                .setColor("#FFD700");

            message.reply({ embeds: [occupiedListEmbed] });

        } catch (error) {
            console.error("❌ Error retrieving the arena list:", error);
            message.reply("⚠️ There was an error fetching the list.");
        }
    }
};
