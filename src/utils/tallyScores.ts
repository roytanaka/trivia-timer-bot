import { saveGame, getGame } from './gameControls';
import { settings } from '../config';
import { Message } from 'discord.js';
import { isTriviaMaster } from './utilFunctions';
const { scoreKeepers, ignore } = settings;

// get nicknames of all users on channel
const getNicknames = (message: Message) => {
  return message.guild!.members.cache.reduce(
    (acc: { [key: string]: string }, member) => {
      acc[member.user.id] = member.nickname ?? member.user.username;
      return acc;
    },
    {}
  );
};

export const tallyScores = async (message: Message) => {
  const triviaMaster = message.author;
  const nicknames = getNicknames(message);

  const gameData = getGame(triviaMaster.id);
  const { lastScoreId, currentScores } = gameData;
  gameData.lastScoreId = message.id;

  const fetched = await message.channel.messages.fetch({ after: lastScoreId });
  const messageAnswers = fetched.filter(
    msg =>
      !msg.author.bot && // Not a bot
      !isTriviaMaster(msg) &&
      !msg.reactions.cache.some(reaction => reaction.emoji.name === ignore) // does not include ignore emoji
  );
  console.log('🚀 ~ tallyScores ~ messageAnswers', messageAnswers);
  const contestants = new Map();
  // unique contestants list
  for (const messageId of messageAnswers.keys()) {
    contestants.set(
      messageAnswers.get(messageId)?.author.id,
      messageAnswers.get(messageId)?.author
    );
  }
  // Calculate score from answers
  for (const id of contestants.keys()) {
    const score = scoreKeepers.reduce((total, scoreKeeper) => {
      const filteredMessages = messageAnswers.filter(msg => {
        const emoji = msg.reactions.cache.find(reaction => {
          return reaction.emoji.name === scoreKeeper.emoji;
        });
        const author = msg.author.id === id;
        return !!emoji && author;
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
  const scoresArray = Object.values(currentScores).sort(
    (a, b) => b.score - a.score
  );
  return scoresArray;
};
