import { config } from 'dotenv';
config();
export const token = process.env.DISCORD_TOKEN;
export const settings: object = {
  prefix: '::',
  scoreThreshold: 0.8,
  timerEmojis: [
    ':one::five:',
    ':one::four:',
    ':one::three:',
    ':one::two:',
    ':one::one:',
    ':one::zero:',
    ':nine:',
    ':eight:',
    ':seven:',
    ':six:',
    ':five:',
    ':four:',
    ':three:',
    ':two:',
    ':one:',
  ],
  scoreKeepers: [
    {
      name: 'correct',
      emoji: '✅',
      score: 1,
    },
    {
      name: 'half',
      emoji: '🔶',
      score: 0.5,
    },
    {
      name: 'bonus',
      emoji: '⭐',
      score: 1,
    },
    {
      name: 'tie breaker',
      emoji: '⚖️',
      score: 0.1,
    },
  ],
  ignore: '🚫',
};
