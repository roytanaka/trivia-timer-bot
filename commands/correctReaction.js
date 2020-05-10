const { correctMoji, halfMoji, bonusMoji } = require('../config.json');

module.exports = {
  name: 'correctReaction',
  description:
    'Prevent adding ⭐️, ✅ and 🔶 for anyone without Trivia Master role',
  async execute(reaction, user) {
    const emoji = reaction.emoji.name;
    if (emoji !== correctMoji && emoji !== halfMoji && emoji !== bonusMoji)
      return;
    // get Trivia Master role ID
    const triviaRoleId = reaction.message.guild.roles.cache.find((role) => {
      return role.name.includes('TRIVIA MASTER');
    }).id;
    // Members with Trivia Master Role
    const membersWithRole = reaction.message.guild.roles.cache.get(triviaRoleId)
      .members;
    if (reaction.count > 1) {
      // reaction.remove() removes all reactions including the Trivia Masters. Ignore if already has a reaction
      return;
    } else if (!membersWithRole.some((member) => member.id === user.id)) {
      // Remove if not Trivia Master
      await reaction.remove();
    }
  },
};
