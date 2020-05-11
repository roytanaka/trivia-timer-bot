const { scoreKeepers } = require('../config.json');

const getScores = (message) => {
  // get nicknames of all users on server
  const nicknames = {};
  message.guild.members.cache.forEach((member) => {
    nicknames[member.user.id] = member.nickname;
  });
  const threeHoursAgo = new Date(
    new Date().setHours(new Date().getHours() - 3)
  );
  const messages = message.channel.messages.cache
    .array()
    //filter out bots and messages earlier 3 hours
    .filter(
      (msg) =>
        !msg.author.bot &&
        msg.createdTimestamp > threeHoursAgo &&
        !msg.member.roles.cache.some((role) =>
          role.name.includes('TRIVIA MASTER')
        )
    );

  const contestants = new Map();
  // unique contestants list
  for (const message of messages) {
    contestants.set(message.author.id, message.author);
  }

  for (const id of contestants.keys()) {
    const score = scoreKeepers.reduce((total, scoreKeeper) => {
      const filteredMessages = messages.filter((msg) => {
        const emoji = msg.reactions.cache.find((reaction) => {
          return reaction._emoji.name === scoreKeeper.emoji;
        });
        const author = msg.author.id === id;
        return emoji && author;
      });
      return total + filteredMessages.length * scoreKeeper.score;
    }, 0);

    const user = contestants.get(id);
    user.score = score;
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
  return scores;
};

module.exports = getScores;
