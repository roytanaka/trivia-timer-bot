const { scoreKeepers } = require('../config.json');
const { getGame, saveGame } = require('../utils/gameControls');
const FuzzySet = require('fuzzyset');
const correctScore = scoreKeepers.find(keeper => keeper.name === 'correct');

module.exports = {
  name: 'answer',
  description: 'Mark correct score with correct emoji',
  async execute(message, args) {
    const answers = args.join(' ').split(',');
    console.log('🚀 ~ execute ~ answers', answers);
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
      const result = fuz.get(message.content);
      console.log(message.content, 'result', result);
      if (result && result[0][0] > 0.8) {
        message.react(correctScore.emoji);
      }
    }
  },
};
