const { scoreThreshold, scoreKeepers } = require('../config.json');
const { getGame } = require('../utils/gameControls');
const FuzzySet = require('fuzzyset');
const correctMarker = scoreKeepers.find(keeper => keeper.name === 'correct');

module.exports = {
  name: 'answer',
  description: 'Mark correct score with correct emoji',
  async execute(message, args) {
    const answers = args.join(' ').split(',');
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

    for (const messageId of messageAnswers.keys()) {
      const message = messageAnswers.get(messageId);
      const unspoilerAnswer = message.content.replace(/\|+/g, '');
      const [[score = 0]] = fuz.get(unspoilerAnswer) || [[]];
      console.log('answer:', unspoilerAnswer, 'result:', score);
      if (score > scoreThreshold) {
        message.react(correctMarker.emoji);
      }
    }
  },
};
