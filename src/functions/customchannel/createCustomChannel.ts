import { channelMention, ChannelType, GuildMember, Interaction, PermissionsBitField } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";

const createCustomChannel = async (interaction: Interaction) => {
    if (!interaction.isButton() || interaction.customId !== "createChannel") return;

    await interaction.deferReply({ ephemeral: true });

    const channelName = `💬︱${interaction.user.username}`;

    try {
        const channel = await interaction.guild?.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: "1293195173400018985",
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ManageMessages
                    ],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: "1225872594440294450",
                    allow: [PermissionsBitField.Flags.ViewChannel],
                    deny: [PermissionsBitField.Flags.SendMessages],
                },
                {
                    id: "1311732675949756489",
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ManageMessages
                    ],
                },
                {
                    id: "1268695331487485984",
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ],
                }
            ],
        });

        if (!channel) throw new Error("Channel creation failed.");

        if (interaction.member instanceof GuildMember) {
            await apiHandler.setChannel(interaction.member.id, channel.id);
            await interaction.editReply({ content: `✅ Your channel has been created! ${channelMention(channel.id)}` });
        }

    } catch (error) {
        console.error("❌ Error creating channel:", error);
        await interaction.editReply({ content: "⚠️ There was an error creating your channel. Please try again later." });
    }
};

export default createCustomChannel;
