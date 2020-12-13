const Discord = require('discord.js');
const JSONdb = require('simple-json-db');
const db = new JSONdb('utils/database.json');

const { scoreKeepers, ignore } = require('../config.json');

const getNicknames = message => {
  return message.guild.members.cache.reduce((acc, member) => {
    acc[member.user.id] = member.nickname;
    return acc;
  }, {});
};

const getScores = async message => {
  // get nicknames of all users on server
  const threeHoursAgo = new Date()
    .setHours(new Date().getHours() - 3)
    .toString();

  console.log(
    'log ~ file: tallyScores.js ~ line 19 ~ threeHoursAgo',
    threeHoursAgo
  );

  let triviaGame = db.get(message.author.id);
  console.log('log ~ file: tallyScores.js ~ line 24 ~ triviaGame', triviaGame);
  console.log('bool', parseInt(threeHoursAgo) < parseInt(triviaGame.time));
  if (triviaGame && parseInt(threeHoursAgo) < parseInt(triviaGame.time)) {
    console.log('game exists');
  } else {
    console.log('new game');
    db.set(message.author.id, { time: new Date().getTime().toString() });
  }

  const nicknames = getNicknames(message);

  // let allMessages = new Discord.Collection();

  // let lastId;

  // while (true) {
  //   const options = { limit: 50 };
  //   if (lastId) options.before = lastId;

  //   const fetchedMessages = await message.channel.messages.fetch(options);
  //   const olderMessages = fetchedMessages.some(
  //     msg => msg.createdTimestamp < threeHoursAgo
  //   );
  //   allMessages = allMessages.concat(fetchedMessages);
  //   lastId = fetchedMessages.last().id;
  //   if (fetchedMessages.size !== 50 || olderMessages) break;
  // }

  const fetchedMessages = await message.channel.messages.fetch();

  const messages = fetchedMessages.filter(
    msg =>
      !msg.author.bot &&
      !(
        msg.member !== null &&
        msg.member.roles.cache.some(role => role.name.includes('TRIVIA MASTER'))
      ) &&
      !msg.reactions.cache.some(reaction => reaction._emoji.name === ignore)
  );
  // console.log('log ~ file: tallyScores.js ~ line 50 ~ messages', messages);

  const contestants = new Map();
  // unique contestants list
  for (const messageId of messages.keys()) {
    contestants.set(
      messages.get(messageId).author.id,
      messages.get(messageId).author
    );
  }

  // console.log(
  //   'log ~ file: tallyScores.js ~ line 53 ~ contestants',
  //   contestants
  // );
  // for (const id of contestants.keys()) {
  //   const score = scoreKeepers.reduce((total, scoreKeeper) => {
  //     const filteredMessages = messages.filter(msg => {
  //       const emoji = msg.reactions.cache.find(reaction => {
  //         return reaction._emoji.name === scoreKeeper.emoji;
  //       });
  //       const author = msg.author.id === id;
  //       return emoji && author;
  //     });
  //     return total + filteredMessages.size * scoreKeeper.score;
  //   }, 0);

  //   const user = contestants.get(id);
  //   user.score = score;
  //   user.nickname = nicknames[id];
  //   contestants.set(id, user);
  // }

  const scores = [];

  // for (const id of contestants.keys()) {
  //   scores.push({
  //     score: contestants.get(id).score,
  //     user: contestants.get(id).nickname || contestants.get(id).username,
  //   });
  // }

  // scores.sort((a, b) => b.score - a.score);

  return scores;
};

module.exports = getScores;
