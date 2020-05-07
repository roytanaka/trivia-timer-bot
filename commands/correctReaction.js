module.exports = {
  name: 'correctReaction',
  description: 'Prevent adding ✅ for anyone without Trivia Master role',
  execute(reaction, user) {
    // get Trivia Master role ID
    const triviaRoleId = reaction.message.guild.roles.cache.find((role) => {
      return role.name.includes('Trivia Master');
    }).id;
    // Members with Trivia Master Role
    const membersWithRole = reaction.message.guild.roles.cache.get(triviaRoleId)
      .members;
    // Remove ✅ if not Trivia Master
    if (!membersWithRole.some((member) => member.id === user.id)) {
      reaction.remove(user);
    }
  },
};
