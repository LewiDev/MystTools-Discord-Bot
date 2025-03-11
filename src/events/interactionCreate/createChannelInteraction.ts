import { Interaction, Client, GuildMember, channelLink } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import createCustomChannel from "../../functions/customchannel/createCustomChannel";
import name from "../../commands/channel/name";

export default {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        console.log("createChannelInteraction");
        if (!interaction.isButton() || interaction.customId !== "createChannel") return;

        if (!interaction.member || !(interaction.member instanceof GuildMember)) {
            console.error("❌ interaction.member is not a GuildMember.");
            await interaction.reply({ content: "⚠️ An error occurred while processing your channel create request.", ephemeral: true });
            return;
        }

        try {
            // ✅ Fetch User Data & Check Roles
            const [rxUserData, channelData] = await Promise.all([
                apiHandler.getRXUser(interaction.user.id),
                apiHandler.getChannel(interaction.member.id)
            ]);

            const guildRolesBoolean = interaction.member.roles.cache.has("1295677073582719007") ||
                                      interaction.member.roles.cache.has("1310609072483078205");

            if (channelData?.channelId) {
                return await interaction.reply({ content: "❌ You already have a custom channel.", ephemeral: true });
            }

            // ✅ Check if user meets requirements
            if (rxUserData.mageRank >= 50 || rxUserData.rogueRank >= 50 || guildRolesBoolean) {
                await createCustomChannel(interaction);
                return;
            }

            return await interaction.reply({
                content: `❌ You do not meet the requirements to create a channel.\nPlease refer to ${channelLink("1341624871628836925")}`,
                ephemeral: true
            });

        } catch (error) {
            console.error("❌ Error in createChannelHandler:", error);
            return await interaction.reply({ content: "⚠️ An error occurred while processing your channel create request.", ephemeral: true });
        }
    }
};
