const { scoreKeepers, ignore } = require('../config.json');

module.exports = {
  name: 'correctReaction',
  description:
    'Prevent adding ⭐️, ✅ and 🔶 for anyone without Trivia Master role',
  async execute(reaction, user) {
    const reactedEmoji = reaction.emoji.name;

    const restrictedEmojis = scoreKeepers.map(keeper => keeper.emoji);
    restrictedEmojis.push(ignore);

    const isRestricted = restrictedEmojis.includes(reactedEmoji);

    if (!isRestricted) return;
    // get Trivia Master role ID
    const triviaRoleId = reaction.message.guild.roles.cache.find(role => {
      return role.name.includes('TRIVIA MASTER');
    }).id;
    // Members with Trivia Master Role
    const membersWithRole = reaction.message.guild.roles.cache.get(triviaRoleId)
      .members;
    if (reaction.count > 1) {
      // If already has reaction, remove user
      reaction.users.remove(user);
    } else if (!membersWithRole.some(member => member.id === user.id)) {
      // Remove if not Trivia Master
      await reaction.remove();
    }
  },
};
