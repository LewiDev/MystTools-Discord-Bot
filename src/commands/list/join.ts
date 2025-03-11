import { Message } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import editListMessage from "../../functions/lists/editListMessage";

export default {
    name: "join",
    description: "Join the Boosted Arena List",
    execute: async (message: Message, args: string[]) => {
        try {
            const list = await apiHandler.getBoostedArena(message.guild!.id);
            if (!list) {
                return message.reply("❌ No active arena list found.");
            }

            if (list.members.includes(message.author.id)) {
                return message.reply("⚠️ You are already in the list.");
            }

            // ✅ Update the list safely
            const updatedMembers = [...list.members, message.author.id];
            const success = await apiHandler.setBoostedArena(message.guild!.id, list.messageId, updatedMembers);

            if (!success) {
                return message.reply("⚠️ Failed to join the list. Try again later.");
            }

            // ✅ Update the displayed list
            await editListMessage(false, message.guild!);
            message.reply("✅ You have joined the list.");

        } catch (error) {
            console.error("❌ Error joining the list:", error);
            message.reply("⚠️ There was an error joining the list.");
        }
    }
};
