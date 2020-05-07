module.exports = {
  name: 'scores',
  description: 'Tally score of every contestant, sort and post results',
  async execute(message) {
    // get nicknames of all users on server
    const nicknames = {};
    message.guild.members.cache.forEach((member) => {
      nicknames[member.user.id] = member.nickname;
    });
    const yesterday = new Date().setDate(new Date().getDate() - 1);
    const messages = message.channel.messages.cache
      .array()
      //filter out bots and messages earlier than today
      .filter((msg) => !msg.author.bot && msg.createdTimestamp > yesterday);

    const contestants = new Map();
    // unique contestants list
    for (const message of messages) {
      contestants.set(message.author.id, message.author);
    }

    // filter for correct answers i.e. msg with ✅ reaction
    const correctMessages = messages.filter((msg) =>
      msg.reactions.cache.find((reaction) => reaction._emoji.name === '✅')
    );
    for (const id of contestants.keys()) {
      const score = correctMessages.filter((msg) => msg.author.id === id);
      const user = contestants.get(id);
      user.score = score.length;
      user.nickname = nicknames[id];
      contestants.set(id, user);
    }

    const scores = [];
    contestants.forEach((contestant) => {
      scores.push({
        score: contestant.score,
        user: contestant.nickname || contestant.username,
      });
    });

    scores.sort((a, b) => b.score - a.score);

    let currentScores = 'Current scores:\n';
    scores.forEach((score) => {
      currentScores += `*${score.user}* - **${score.score}**\n`;
    });
    console.log(currentScores);

    await message.channel.send(currentScores.trim());
    // message.delete();
  },
};
