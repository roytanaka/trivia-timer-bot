const { scoreThreshold, scoreKeepers } = require('../config.json');
const { getGame } = require('../utils/gameControls');
const FuzzySet = require('fuzzyset');
const correctMarker = scoreKeepers.find(keeper => keeper.name === 'correct');

module.exports = {
  name: 'answer',
  description: 'Mark correct score with correct emoji',
  async execute(message, args) {
    const answers = args.join(' ').split(/\s*,\s*/);
    const fuz = FuzzySet(answers);
    const gameData = getGame(message.author.id);
    const fetched = await message.channel.messages.fetch({
      after: gameData.lastQuestionId,
    });

    const messageAnswers = fetched.filter(
      msg =>
        !msg.author.bot && // Not a bot
        !(
          msg.member !== null && // Has member object
          // Not Trivia Master
          msg.member.roles.cache.some(role =>
            role.name.includes('TRIVIA MASTER')
          )
        )
    );

    const firstAnswerByContestant = new Map();

    for (const messageId of messageAnswers.keys()) {
      firstAnswerByContestant.set(
        messageAnswers.get(messageId).author.id,
        messageAnswers.get(messageId)
      );
    }

    for (const userId of firstAnswerByContestant.keys()) {
      const message = firstAnswerByContestant.get(userId);
      const unSpoilerAnswer = message.content.replace(/\|+/g, '');
      const [[score = 0]] = fuz.get(unSpoilerAnswer) || [[]];
      console.log('🚀 ~ answer:', unSpoilerAnswer, 'score', score);
      if (score > scoreThreshold) {
        await message.react(correctMarker.emoji);
      }
    }
  },
};
