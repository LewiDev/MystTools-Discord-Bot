import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ChannelType, 
    codeBlock, 
    ComponentType, 
    Guild, 
    GuildMember, 
    ButtonInteraction, 
    ThreadAutoArchiveDuration, 
    TextChannel
} from "discord.js";
import { apiHandler } from "../../handlers/apiHandler";
import editListMessage from "./editListMessage";

export default async (channel: TextChannel, oldMembers: string[], guild: Guild) => {
    // ✅ Fetch Arena List Data
    const listData = await apiHandler.getBoostedArena(guild.id);

    await apiHandler.setBoostedArena(guild.id, listData.messageId, []);
    await editListMessage(true, guild);
    if (!listData) {
        console.error(`❌ Failed to fetch arena list for guild: ${guild.id}`);
        return;
    }

    // ✅ Create a private thread
    const thread = await channel.threads.create({
        name: "active arena list",
        autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
        type: ChannelType.PrivateThread,
        reason: "Arena List Channel",
    });

    // ✅ Add specific members to the thread
    const memberIds = ["1313385778860134400", "555955826880413696", ...oldMembers];
    for (const memberId of memberIds) {
        await thread.members.add(memberId).catch((err: any) => console.warn(`⚠️ Could not add member ${memberId}:`, err));
    }

    // ✅ Construct the mention message dynamically
    const mentionedMembers = oldMembers.map(id => `<@${id}>`).join(" ");
    const mentionMessage = `Arena List has started! <@555955826880413696> ${mentionedMembers}\n\nClick the button below to generate the command!`;

    // ✅ Create the button
    const copyButton = new ButtonBuilder()
        .setLabel("Generate Command")
        .setCustomId("genCmd")
        .setStyle(2);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(copyButton);

    // ✅ Send the initial message
    const startMessage = await thread.send({ content: mentionMessage, components: [row] });

    // ✅ Set up button interaction collector
    const collector = startMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 600000, // 10 minutes
    });

    collector.on("collect", async (interaction: ButtonInteraction) => {
        if (!(interaction.member instanceof GuildMember)) return;

        const userMention = `<@${interaction.member.id}>`;

        // ✅ Remove the user who clicked from the mention list
        const filteredMentions = oldMembers.filter(id => `<@${id}>` !== userMention).map(id => `<@${id}>`).join(" ");
        const commandMessage = codeBlock(`rpg arena ${filteredMentions}`);

        await interaction.reply({ content: commandMessage, ephemeral: true });
    });

    // ✅ Auto-delete thread after 5 minutes
    setTimeout(async () => {
        try {
            await thread.delete();
        } catch (err) {
            console.warn("⚠️ Failed to delete the thread:", err);
        }
    }, 300000);
};
