export default (list: any) => {
    if (!list?.members || !Array.isArray(list.members)) {
        console.error("❌ Invalid list data provided to getListMentions.");
        return [];
    }

    // ✅ Generate mentions for existing members
    let memberMentions = list.members.map((member: string) => `<@${member}>`);

    // ✅ Fill remaining slots up to 10 with empty placeholders
    const emptySlots = 10 - memberMentions.length;
    memberMentions.push(...Array(emptySlots).fill(" "));

    return memberMentions;
};
