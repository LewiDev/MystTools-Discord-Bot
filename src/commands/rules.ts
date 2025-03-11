import { Collection, EmbedBuilder, Message } from "discord.js";

export default {
    name: "rules",
    description: "Display the server rules",
    execute: async (message: Message, args: string[]) => {
        if(args[0] !== null) {
            let rules = new Collection();
        
            rules.set("1", "1. **Be Respectful** – Treat everyone with kindness. No harassment, bullying, or personal attacks. Disagreements are fine, but keep discussions civil.");
            rules.set("2", "2. **No NSFW Content** – This includes images, videos, text, usernames, and links. Keep the server appropriate for all members.");
            rules.set("3", "3. **English Only** – To ensure clear communication, please use English in public channels.");
            rules.set("4", "4. **No Hate Speech or Discrimination** – Absolutely no racism, sexism, homophobia, or any form of discrimination.");
            rules.set("5", "5. **No Spamming or Flooding** – Avoid excessive messages, caps, emojis, or repeated pings. Keep conversations meaningful.");
            rules.set("6", "6. **No Self-Promotion or Unapproved Advertising** – No posting of personal Discord servers, social media, or other advertisements without permission from staff.");
            rules.set("7", "7. **No Unapproved Bots or Scripts** – Do not use unauthorized bots, macros, or scripts that disrupt the server.");
            rules.set("8", "8. **No Doxxing or Sharing Personal Information** – Protect your privacy and others'. Never share personal details such as addresses, phone numbers, or passwords.");
            rules.set("9", "9. **Listen to Staff & Moderators** – If a moderator gives a warning or makes a decision, respect it. If you disagree, handle it privately and respectfully.");
            rules.set("10", "10. **Use Channels Appropriately** – Keep discussions relevant to each channel’s purpose.");
            rules.set("11", "11. **Have fun** - Be friendly, and help make this server an enjoyable place for everyone.");
        
            const embed = new EmbedBuilder()
            .setDescription(rules.has(args[0]) ? "**SERVER RULES** 📜\n-# *Breaking these rules may result in warnings, timeouts, or bans. Follow them to keep our community safe and fun!*\n\n" + rules.get(args[0]) : "Invalid rule selected!");
            return await message.reply({ embeds: [embed] });
        
        
        }
        
        const embed = new EmbedBuilder()
        .setDescription("**SERVER RULES** 📜\n-# *Breaking this rule may result in warnings, timeouts, or bans. Follow them to keep our community safe and fun!*\n\n1. **Be Respectful** – Treat everyone with kindness. No harassment, bullying, or personal attacks. Disagreements are fine, but keep discussions civil.\n\n2. **No NSFW Content** – This includes images, videos, text, usernames, and links. Keep the server appropriate for all members.\n\n3. **English Only** – To ensure clear communication, please use English in public channels.\n\n4. **No Hate Speech or Discrimination** – Absolutely no racism, sexism, homophobia, or any form of discrimination.\n\n5. **No Spamming or Flooding** – Avoid excessive messages, caps, emojis, or repeated pings. Keep conversations meaningful.\n\n6. **No Self-Promotion or Unapproved Advertising** – No posting of personal Discord servers, social media, or other advertisements without permission from staff.\n\n7. **No Unapproved Bots or Scripts** – Do not use unauthorized bots, macros, or scripts that disrupt the server.\n\n8. **No Doxxing or Sharing Personal Information** – Protect your privacy and others'. Never share personal details such as addresses, phone numbers, or passwords.\n\n9. **Listen to Staff & Moderators** – If a moderator gives a warning or makes a decision, respect it. If you disagree, handle it privately and respectfully.\n\n10. **Use Channels Appropriately** – Keep discussions relevant to each channel’s purpose.\n\n11. **Have fun** - Be friendly, and help make this server an enjoyable place for everyone!");
        
        
        await message.reply({ embeds: [embed] });
    }
};


