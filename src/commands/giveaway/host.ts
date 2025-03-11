import { 
    Message, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    Interaction, 
    TextChannel,
    GuildManager,
    GuildMember
} from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

export default {
    name: "host",
    description: "Host a new giveaway",
    execute: async (message: Message) => {
        if (!message.member?.permissions.has("ManageGuild")) {
            return message.reply("❌ You don't have permission to host giveaways.");
        }

        // ✅ Step 1: Ask user to select eligible roles
        const allowedRoleIds = ["1319256610786508820", "1319256584706064394"];

        // ✅ Ensure only valid roles are included
        const roleOptions = allowedRoleIds
            .map(roleId => {
                const role = message.guild!.roles.cache.get(roleId);
                return role ? { label: role.name, value: role.id } : null;
            })
            .filter((option): option is { label: string; value: string } => option !== null); // TypeScript type guard

        const roleSelect = new StringSelectMenuBuilder()
            .setCustomId("giveaway_role_select")
            .setPlaceholder("Select roles allowed to join")
            .setMinValues(1)
            .setMaxValues(roleOptions.length) // Allow selecting up to available roles
            .addOptions(roleOptions); // ✅ Now properly typed

        const roleRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(roleSelect);

        const embed = new EmbedBuilder()
            .setTitle("🎉 Giveaway Setup")
            .setDescription("Select who can enter the giveaway by choosing from the allowed roles.")
            .setColor("#FFD700");

        const setupMessage = await message.reply({ embeds: [embed], components: [roleRow] });

        // ✅ Step 2: Handle role selection
        const roleCollector = setupMessage.createMessageComponentCollector({ time: 60000 });

        roleCollector.on("collect", async (interaction) => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: "❌ Only the command sender can interact with this.", ephemeral: true });
            }

            if (!interaction.isStringSelectMenu()) return;
            const selectedRoles = interaction.values;
            roleCollector.stop();

            // ✅ Step 3: Show a modal for giveaway details
            const modal = new ModalBuilder()
                .setCustomId("giveaway_modal")
                .setTitle("🎉 Giveaway Details");

            const rewardInput = new TextInputBuilder()
                .setCustomId("giveaway_reward")
                .setLabel("Giveaway Reward")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("e.g., Discord Nitro");

            const requirementInput = new TextInputBuilder()
                .setCustomId("giveaway_requirement")
                .setLabel("Entry Requirement (Optional)")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("e.g., Level 10+");

            const endTimeInput = new TextInputBuilder()
                .setCustomId("giveaway_end")
                .setLabel("End Time (e.g., 1h, 10m, March 10 5PM UTC)")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Enter duration or date");

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(rewardInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(requirementInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(endTimeInput)
            );

            await interaction.showModal(modal);

            // ✅ Step 4: Handle modal submission
            const modalCollector = message.channel?.createMessageComponentCollector({ time: 60000 });

            modalCollector?.on("collect", async (modalInteraction: Interaction) => {
                if (!modalInteraction.isModalSubmit()) return;
                if (modalInteraction.customId !== "giveaway_modal") return;

                const reward = modalInteraction.fields.getTextInputValue("giveaway_reward");
                const requirement = modalInteraction.fields.getTextInputValue("giveaway_requirement");
                const endDate = modalInteraction.fields.getTextInputValue("giveaway_end");

                await modalInteraction.deferReply({ ephemeral: true });

                // ✅ Convert end time input into Date format
                let parsedDate: Date;
                try {
                    if (!isNaN(Number(endDate))) {
                        parsedDate = new Date(Date.now() + Number(endDate) * 1000);
                    } else {
                        parsedDate = new Date(Date.parse(endDate));
                    }
                } catch (error) {
                    return modalInteraction.followUp("❌ Invalid end time format. Please use `10m`, `1h`, or `March 10 5PM UTC`.");
                }

                // ✅ Send data to API
                const response = await apiHandler.createGiveaway(
                    message.author.id,
                    message.guild!.id,
                    reward,
                    requirement || "No requirements",
                    selectedRoles,
                    parsedDate.toISOString()
                );

                if (!response) {
                    return modalInteraction.followUp("❌ Failed to create giveaway. Try again.");
                }

                // ✅ Step 5: Send Giveaway Embed
                const giveawayId = response.giveawayId;
                const participantTotal = response.participants.length || 0;
                const mentionedRoles = selectedRoles.map((roleId: string) => `<@&${roleId}>`).join(", ");

                // Convert End Time to Unix Timestamp
                const unixTimestamp = Math.floor(parsedDate.getTime() / 1000);

                const giveawayEmbed = new EmbedBuilder()
                    .setTitle("🎉 New Giveaway!")
                    .setDescription(`Join the giveaway for **${reward}**!\n\n`
                        + `📜 **Requirement:** ${requirement || "None"}\n`
                        + `⏳ **Ends:** <t:${unixTimestamp}:R> (<t:${unixTimestamp}:F>)\n`
                        + `🎟️ **Giveaway ID:** \`${giveawayId}\``)
                    .addFields(
                        { name: "🎟️ Participants", value: `${participantTotal}`, inline: true },
                        { name: "📜 Allowed Roles", value: mentionedRoles || "Everyone", inline: true }
                    )
                    .setColor("#FFD700");

                // ✅ Join & Leave Buttons
                const joinButton = new ButtonBuilder()
                    .setCustomId(`join_giveaway_${giveawayId}`)
                    .setLabel("Join Giveaway 🎟️")
                    .setStyle(ButtonStyle.Success);

                const leaveButton = new ButtonBuilder()
                    .setCustomId(`leave_giveaway_${giveawayId}`)
                    .setLabel("Leave Giveaway ❌")
                    .setStyle(ButtonStyle.Danger);

                const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton, leaveButton);

                // ✅ Send Embed with Buttons
                if(!(message.channel instanceof TextChannel)) return;
                let channel = message.guild?.channels.cache.get('1319256755749916692') as TextChannel;
                await channel.send({ content: mentionedRoles, embeds: [giveawayEmbed], components: [buttonRow] });

                if(!(message.member instanceof GuildMember)) return;
                
                await apiHandler.createGiveaway(message.member.id, message.guild!.id, reward, requirement || "No requirements", selectedRoles, parsedDate.toISOString());


                modalInteraction.followUp("✅ Giveaway created successfully!");

            });
        });
    }
};
