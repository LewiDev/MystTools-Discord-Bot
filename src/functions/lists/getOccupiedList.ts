import { EmbedBuilder, Message } from "discord.js";
import getListMentions from "./getListMentions";

export default async (message: Message, list: any) => {
    const mentionArray: string[] = getListMentions(list);
    const membersFilled = mentionArray.filter(m => m.trim() !== "").length;


    const newEmbed = new EmbedBuilder()
        .setTitle(`🍪 ARENA [${membersFilled}/10] 🍪`)
        .setDescription(`\nSelect buttons below to join/leave the arena list.
            \n1️⃣${mentionArray[0] || " "}
            \n2️⃣${mentionArray[1] || " "}
            \n3️⃣${mentionArray[2] || " "}
            \n4️⃣${mentionArray[3] || " "}
            \n5️⃣${mentionArray[4] || " "}
            \n6️⃣${mentionArray[5] || " "}
            \n7️⃣${mentionArray[6] || " "}
            \n8️⃣${mentionArray[7] || " "}
            \n9️⃣${mentionArray[8] || " "}
            \n🔟${mentionArray[9] || " "}`);

    return newEmbed;
};
