import { TriviaCommand } from '../utils/commandInterface';
import { getGame } from '../utils/gameControls';
import FuzzySet from 'fuzzyset';
import { checkTriviaMaster } from '../utils/utilFunctions';
import { settings } from '../config';
const correctMarker = settings.scoreKeepers.find(
  keeper => keeper.name === 'correct'
)!;

const editCommand: TriviaCommand = {
  name: 'Answers command',
  description: 'Automatically mark contestant’s correct answers',
  trigger: 'answer',
  arguments: ['Trivia answer'],
  aliases: ['a', 'answers'],
  async execute(message, args) {
    if (args?.length === 0) {
      throw 'No answers in command';
    }
    const answers = args?.join(' ').split(/\s*;\s*/);
    const fuz = FuzzySet(answers);
    const gameData = getGame(message.author.id);
    const fetched = await message.channel.messages.fetch({
      after: gameData.lastQuestionId,
    });

    const messageAnswers = fetched.filter(
      msg =>
        !msg.author.bot && // Not a bot
        !checkTriviaMaster(msg.author)
    );
    const firstAnswerByContestant = new Map();
    for (const messageId of messageAnswers.keys()) {
      const message = messageAnswers.get(messageId)!;
      firstAnswerByContestant.set(message.author.id, message);
    }

    for (const userId of firstAnswerByContestant.keys()) {
      const message = firstAnswerByContestant.get(userId);
      const unSpoilerAnswer = message.content.replace(/\|+/g, '');
      const [[score = 0]] = fuz.get(unSpoilerAnswer) || [[]];
      console.log('🚀 ~ answer:', unSpoilerAnswer, 'score', score);
      if (score > settings.scoreThreshold) {
        await message.react(correctMarker.emoji);
      }
    }
  },
};

module.exports = editCommand;
