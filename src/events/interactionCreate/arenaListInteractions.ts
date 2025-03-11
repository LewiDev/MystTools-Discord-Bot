import { Interaction, TextBasedChannel, TextChannel } from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import editListMessage from "../../functions/lists/editListMessage";
import createListChannel from "../../functions/lists/createListChannel";

export default {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === "joinList" && interaction.channel) {
            joinList(interaction, interaction.channel);
        }

        if (interaction.customId === "leaveList" && interaction.channel) {
            leaveList(interaction, interaction.channel);
        }

        if (interaction.customId === "forceStart" && interaction.channel) {
            forceStart(interaction, interaction.channel);
        }
    }
};

const joinList = async (interaction: any, channel: TextBasedChannel) => {
    try {
        let list = await apiHandler.getBoostedArena(interaction.guild.id);
        if (!list) {
            console.error(`❌ Failed to fetch arena list for guild: ${interaction.guild.id}`);
            return;
        }

        if (list.members.includes(interaction.member.id)) {
            return interaction.reply({ content: "❌ You are already in the list.", ephemeral: true });
        }

        const updatedMembers = [...list.members, interaction.member.id];
        await apiHandler.setBoostedArena(interaction.guild.id, list.messageId, updatedMembers);

        if (updatedMembers.length === 10) {
            let list = await apiHandler.getBoostedArena(interaction.guild.id);
            if (!list) {
                return interaction.reply({ content: "❌ The arena list is not active.", ephemeral: true });
            }

            if (!list.members.includes(interaction.member.id)) {
                return interaction.reply({ content: "❌ You are not in the list and cannot start the list.", ephemeral: true });
            }

            const oldMembers = [...list.members];
            await apiHandler.setBoostedArena(interaction.guild.id, list.messageId, []);

            await editListMessage(true, interaction.guild);

            createListChannel(channel as TextChannel, oldMembers, interaction.guild);
        } else {
            await editListMessage(false, interaction.guild);
        }

        interaction.reply({ content: "✅ You have joined the list.", ephemeral: true });

    } catch (error) {
        console.error("❌ Error adding user to arena list:", error);
        interaction.reply({ content: "⚠️ There was an error joining the list.", ephemeral: true });
    }
};

const leaveList = async (interaction: any, channel: TextBasedChannel) => {
    try {
        let list = await apiHandler.getBoostedArena(interaction.guild.id);
        if (!list) {
            return interaction.reply({ content: "❌ The arena list is not active.", ephemeral: true });
        }

        if (!list.members.includes(interaction.member.id)) {
            return interaction.reply({ content: "❌ You are not in the list.", ephemeral: true });
        }

        const updatedMembers = list.members.filter((member: string) => member !== interaction.member.id);
        await apiHandler.setBoostedArena(interaction.guild.id, list.messageId, updatedMembers);

        interaction.reply({ content: "✅ You have left the list.", ephemeral: true });
        if(updatedMembers.length === 0) {
            await editListMessage(true, interaction.guild);
            return;
        }
        await editListMessage(false, interaction.guild);
        

    } catch (error) {
        console.error("❌ Error removing user from arena list:", error);
        interaction.reply({ content: "⚠️ There was an error leaving the list.", ephemeral: true });
    }
};

const forceStart = async (interaction: any, channel: TextBasedChannel) => {
    if (!interaction.member.roles.cache.some((r: { id: string }) => r.id === "1225872594440294450")) {
        return interaction.reply({ content: "❌ You do not have permission to force start the list.", ephemeral: true });
    }

    try {
        let list = await apiHandler.getBoostedArena(interaction.guild.id);
        if (!list) {
            return interaction.reply({ content: "❌ The arena list is not active.", ephemeral: true });
        }

        if (!list.members.includes(interaction.member.id)) {
            return interaction.reply({ content: "❌ You are not in the list and cannot start the list.", ephemeral: true });
        }

        const oldMembers = [...list.members];
        await apiHandler.setBoostedArena(interaction.guild.id, list.messageId, []);

        await editListMessage(false, interaction.guild);

        interaction.reply({ content: "✅ The list has been force-started.", ephemeral: true });

        await createListChannel(channel as TextChannel, oldMembers, interaction.guild);

    } catch (error) {
        console.error("❌ Error force-starting the arena list:", error);
        interaction.reply({ content: "⚠️ There was an error force-starting the list.", ephemeral: true });
    }
};
