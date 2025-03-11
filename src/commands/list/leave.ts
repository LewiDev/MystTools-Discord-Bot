import { Message } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import editListMessage from "../../functions/lists/editListMessage";

export default {
    name: "leave",
    description: "Leave the Boosted Arena List",
    execute: async (message: Message, args: string[]) => {
        try {
            const list = await apiHandler.getBoostedArena(message.guild!.id);
            if (!list) {
                return message.reply("❌ No active arena list found.");
            }

            if (!list.members.includes(message.author.id)) {
                return message.reply("⚠️ You are not in the list.");
            }

            // ✅ Remove user and update the list safely
            const updatedMembers = list.members.filter((id: string) => id !== message.author.id);
            const success = await apiHandler.setBoostedArena(message.guild!.id, list.messageId, updatedMembers);

            if (!success) {
                return message.reply("⚠️ Failed to leave the list. Try again later.");
            }

            // ✅ If the list is empty, clear it
            if (updatedMembers.length === 0) {
                await editListMessage(true, message.guild!);
            } else {
                await editListMessage(false, message.guild!);
            }

            message.reply("✅ You have left the list.");

        } catch (error) {
            console.error("❌ Error leaving the list:", error);
            message.reply("⚠️ There was an error leaving the list.");
        }
    }
};
