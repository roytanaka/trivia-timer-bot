const Discord = require('discord.js');
const { scoreKeepers, ignore } = require('../config.json');

const getScores = async message => {
  // get nicknames of all users on server
  const nicknames = {};
  message.guild.members.cache.forEach(member => {
    nicknames[member.user.id] = member.nickname;
  });
  const threeHoursAgo = new Date(
    new Date().setHours(new Date().getHours() - 3)
  );

  let allMessages = new Discord.Collection();

  let lastId;

  while (true) {
    const options = { limit: 50 };
    if (lastId) options.before = lastId;

    const fetchedMessages = await message.channel.messages.fetch(options);
    const olderMessages = fetchedMessages.some(
      msg => msg.createdTimestamp < threeHoursAgo
    );
    allMessages = allMessages.concat(fetchedMessages);
    lastId = fetchedMessages.last().id;
    if (fetchedMessages.size !== 50 || olderMessages) break;
  }

  const messages = allMessages.filter(
    msg =>
      !msg.author.bot &&
      msg.createdTimestamp > threeHoursAgo &&
      !(
        msg.member !== null &&
        msg.member.roles.cache.some(role => role.name.includes('TRIVIA MASTER'))
      ) &&
      !msg.reactions.cache.some(reaction => reaction._emoji.name === ignore)
  );

  const contestants = new Map();
  // unique contestants list
  for (const messageId of messages.keys()) {
    contestants.set(
      messages.get(messageId).author.id,
      messages.get(messageId).author
    );
  }

  for (const id of contestants.keys()) {
    const score = scoreKeepers.reduce((total, scoreKeeper) => {
      const filteredMessages = messages.filter(msg => {
        const emoji = msg.reactions.cache.find(reaction => {
          return reaction._emoji.name === scoreKeeper.emoji;
        });
        const author = msg.author.id === id;
        return emoji && author;
      });
      return total + filteredMessages.size * scoreKeeper.score;
    }, 0);

    const user = contestants.get(id);
    user.score = score;
    user.nickname = nicknames[id];
    contestants.set(id, user);
  }

  const scores = [];

  for (const id of contestants.keys()) {
    scores.push({
      score: contestants.get(id).score,
      user: contestants.get(id).nickname || contestants.get(id).username,
    });
  }

  scores.sort((a, b) => b.score - a.score);

  return scores;
};

module.exports = getScores;
