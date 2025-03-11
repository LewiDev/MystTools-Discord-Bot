import { EmbedBuilder, Message, TextChannel } from "discord.js";

export default {
    name: "advguild",
    description: "Sends the adventurers guild message",
    execute: async (message: Message, args: string[]) => {
        if(message.member?.id === '411267877103075338' || message.member?.id === '590575157718941708') {
            let emojis = {
                "Living Grimoir": "<:rxLivingGrimoir:1337204257367003158>",
                "Divine Mage": "<:rxDivineMage:1337204391614353418>",
                "Imperial Mage": "<:rxImperialMage:1337218065347252225>",
                "Demon Mage": "<:rxDemonMage:1337217435899527230>",
                "Holy Mage": "<:rxHolyMage:1337217645262405652>",
                "First-Class Mage": "<:rxFirstClassMage:1337217581756710933>",
                "Advanced Mage": "<:rxAdvancedMage:1337217204931924040>",
                "Intermediate Mage": "<:rxIntermediateMage:1337217823067344916>",
                "Rookie Mage": "<:rxRookieMage:1337217072979247174>",
                "Pureblood Knight": "<:rxPurebloodKnight:1337217015022354483>",
                "Veteran Knight": "<:rxVeteranKnight:1337218555191627806>",
                "Paladin Knight": "<:rxPaladinKnight:1337218525818781756>",
                "Landed Knight": "<:rxLandedKnight:1337218508274012172>",
                "Knight's Vanguard": "<:rxKnightsVanguard:1337218478381465734>",
                "Hedge Knight": "<:rxHedgeKnight:1337218449805676608>",
                "Advanced Knight": "<:rxAdvancedKnight:1337218413377884170>",
                "Novice Knight": "<:rxNoviceKnight:1337218381354373130>",
                "Eclipse Frost Monarch": "<:rxEclipseFrostMonarch:1342503747858989087>",
                "Phantom Void Lord": "<:rxPhantomVoidLord:1342503746499907604>",
                "Scorched Desolation": "<:rxScorchedDesolation:1342503745208062024>",
                "Abyssal Ruin King": "<:rxAbyssalRuinKing:1342503743328882718>",
                "Blazing Sun Tyrant": "<:rxBlazingSunTyrant:1342503740342538262>",
                "Frostborn Sovereign": "<:rxFrostbornSovereign:1342503738761547839>",
                "Crimson Tyrant": "<:rxCrimsonTyrant:1342503736421126236>",
                "Monarch of Infernal Flames": "<:rxMonatchofInfernalFlames:1342503734839607417>"
            };
        
        
            const embed = new EmbedBuilder()
                .setTitle("🧙‍♂️ HELLO, ADVENTURER!")
                .setDescription(`-# *here you can find all the information to help you on your journey.*\n\n🌿 **GENERAL INFORMATION**\n- Both classes have the **same XP metres**... so you won't have to worry about falling behind! Select whichever speeks to you the most!\n- You **cannot** have to classes active at once - *changing class* ***will not*** make you lose progress.\n- There are a **8 ranks** per class: 5 > 10 > 25 > 50 > 75 > 100 > 200 > 400\n- Ranks **do not** transfer over to the other class! However, progress **will not** be lost, as previously mentioned.\n\n🍀 **COMMANDS**\n- \`rx rank\` / \`rx rank @user\` - check the rank of yourself, or others.\n- \`rx lb\` / \`rx lb mage/knight\` - view the leaderboard of both classes.\n- \`rx class\` / \`rx class mage/knight\` - display the ranks of both classes.\n\n${emojis["Divine Mage"]} **MAGE CLASS RANKINGS**\n- Rookie Mage ${emojis["Living Grimoir"]} **Rank 5+**\n- Intermediate Mage ${emojis["Intermediate Mage"]} **Rank 10+**\n- Advanced Mage ${emojis["Advanced Mage"]} **Rank 25+**\n- First-Class Mage ${emojis["First-Class Mage"]} **Rank 50+**\n- Holy Mage ${emojis["Holy Mage"]} **Rank 75+**\n- Demon Mage ${emojis["Demon Mage"]} **Rank 100+**\n- Imperial Mage ${emojis["Imperial Mage"]} **Rank 200+**\n- Divine Mage ${emojis["Divine Mage"]} **Rank 400+**\n\n${emojis["Pureblood Knight"]} **KNIGHT CLASS RANKINGS**\n- Novice Knight ${emojis["Novice Knight"]} **Rank 5+**\n- Advanced Knight ${emojis["Advanced Knight"]} **Rank 10+**\n- Hedge Knight ${emojis["Hedge Knight"]} **Rank 25+**\n- Knight's Vanguard ${emojis["Knight's Vanguard"]} **Rank 50+**\n- Landed Knight ${emojis["Landed Knight"]} **Rank 75+**\n- Paladin Knight ${emojis["Paladin Knight"]} **Rank 100+**\n- Veteran Knight ${emojis["Veteran Knight"]} **Rank 200+**\n- Pureblood Knight ${emojis["Pureblood Knight"]} **Rank 400+**\n\n${emojis["Living Grimoir"]} **LIVING GRIMOIR**\n- Living Grimoir ${emojis["Living Grimoir"]} **Rank 400+** *across both classes*\n- This rank unlocks the *Voidborn Tyrant* class - *coming soon...*`);
                
            if(message.channel && message.channel.isTextBased()) await (message.channel as TextChannel).send({ embeds: [embed] });
        }
    }
};
