const { newGame, saveGame, getGame } = require('./gameControls');
const { scoreKeepers, ignore } = require('../config.json');

// get nicknames of all users on channel
const getNicknames = message => {
  return message.guild.members.cache.reduce((acc, member) => {
    acc[member.user.id] = member.nickname;
    return acc;
  }, {});
};

const getScores = async message => {
  const oneHourAgo = new Date(new Date().setHours(new Date().getHours() - 1));
  const triviaMaster = message.author;
  const nicknames = getNicknames(message);

  let gameData = getGame(triviaMaster.id);
  if (!gameData) {
    console.log('New Game!');
    gameData = newGame(message);
  } else if (oneHourAgo > new Date(gameData.time)) {
    gameData = newGame(message);
  }
  const { lastScoreId, currentScores } = gameData;
  gameData.lastScoreId = message.id;

  const options = { limit: 50 };
  if (lastScoreId) options.after = lastScoreId;
  const fetchedMessages = await message.channel.messages.fetch(options);
  const messageAnswers = fetchedMessages.filter(
    msg =>
      !msg.author.bot && // Not a bot
      new Date(msg.createdTimestamp) > oneHourAgo &&
      !(
        (
          msg.member !== null && // Has member object
          msg.member.roles.cache.some(role =>
            role.name.includes('TRIVIA MASTER')
          )
        ) // and is not TRIVIA MASTER
      ) &&
      !msg.reactions.cache.some(reaction => reaction._emoji.name === ignore) // does not include ignore emoji
  );
  const contestants = new Map();
  // unique contestants list
  for (const messageId of messageAnswers.keys()) {
    contestants.set(
      messageAnswers.get(messageId).author.id,
      messageAnswers.get(messageId).author
    );
  }

  // Calculate score from answers
  for (const id of contestants.keys()) {
    const score = scoreKeepers.reduce((total, scoreKeeper) => {
      const filteredMessages = messageAnswers.filter(msg => {
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
    user.name = nicknames[id] || user.username;
    contestants.set(id, user);
  }
  // Sum answer scores with db
  for (const id of contestants.keys()) {
    if (id in currentScores) {
      currentScores[id].score += contestants.get(id).score;
      currentScores[id].user = contestants.get(id).name;
    } else {
      currentScores[id] = {
        score: contestants.get(id).score,
        user: contestants.get(id).name,
      };
    }
  }

  gameData.currentScores = currentScores;

  saveGame(triviaMaster.id, gameData);

  const scoresArray = Object.values(currentScores);

  scoresArray.sort((a, b) => b.score - a.score);

  return scoresArray;
};

module.exports = getScores;
