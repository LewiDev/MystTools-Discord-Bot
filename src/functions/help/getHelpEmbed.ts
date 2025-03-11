import { ActionRowBuilder, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default (type: string) => {
    const select = new StringSelectMenuBuilder()
    .setCustomId('mysthelp')
    .setPlaceholder('Get help with...')
    .addOptions(
        new StringSelectMenuOptionBuilder()
                .setLabel('🍀 Home')
                .setDescription('Return to the home help page.')
                .setValue('main'),
        new StringSelectMenuOptionBuilder()
            .setLabel('🌿 Channels')
                .setDescription('Get help with managing your channel.')
            .setValue('channels'),
        new StringSelectMenuOptionBuilder()
            .setLabel('🌴 Arena')
            .setDescription('Get help with navigating the arena list.')
            .setValue('arena'),
            
    );


    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(select);

    const mainEmbed =  new EmbedBuilder()
    .setTitle("MYSTOOLS HELP")
    .setDescription("-# *Choose the category you would like help with.*\n\n🍀 **CHANNELS**\n- Manage user's perms in **personal ERPG channels**, Add and remove users. as well as privating, and hiding your channel.\n\n🍀 **ARENA**\n- See the various commands to join, leave, and view the **boosted arena**.")
    .setFooter({ text: "prefix: myst | created by: mmusou & techlewi"})
    
    let channelsEmbed = new EmbedBuilder()
    .setTitle("CHANNELS HELP")
    .setDescription("-# *Manage your channels to secure your privacy, or grant others access.*\n\n🌿 **USER MANAGEMENT**\n- `myst channel grant @user` - ***grant** user perms to **send messages** in your channel*\n- `myst channel remove @user` - ***removes** user perms to **send messages** in your channel*\n\n🌿 **CHANNEL MANAGEMENT**\n- `myst channel public` - ***opens** your channel to see **but not type***\n- `myst channel hide` - ***only you** can see the channel (can still grant users)*\n- `myst channel lock` - ***only you** can send messages*\n\n🌿 **CHANNEL NAME**\n- `myst channel emoji <emoji>` - *changes the emoji in your channel name*\n- `myst channel name <name>` - *changes the name of your channel*\n")
    .setFooter({ text: "prefix: myst | created by: mmusou & techlewi"})

    let arenaEmbed = new EmbedBuilder()
    .setTitle("ARENA HELP")
    .setDescription("-# *See the various commands to join, leave, and view the boosted arena.*\n\n🌴 **ARENA COMMANDS**\n- `myst arena list` - *displays the current list of players*\n- `myst arena join` - *join the list from any channel*\n- `myst arena leave` - *leave the list from any channel*")
    .setFooter({ text: "prefix: myst | created by: mmusou & techlewi"})

    let adminEmbed = new EmbedBuilder()
    .setTitle("ADMIN HELP")
    .setDescription("-# *See the various commands to moderate the server.*\n\n⛔ **EMBED COMMANDS**\n- `myst embeds sls` - *sends the boosted arena list embed!*\n- `myst embeds scc` - *sends the channel request embed!*\n- `myst embeds advguild` - *sends the adventurers guild embed!*")
    .setFooter({ text: "prefix: myst | created by: mmusou & techlewi"})

    if(type === 'channels') {
        return [channelsEmbed, row];
    } else if(type === 'arena') {
        return [arenaEmbed, row];
    } else if (type === 'admin') {
        return [adminEmbed]
    } else {
        return [mainEmbed, row];
    } 

};
