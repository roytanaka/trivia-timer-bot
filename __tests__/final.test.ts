import { Message } from 'discord.js';
const finalCommand = require('../src/commands/final');
import { deleteGame } from '../src/utils/gameControls';
import { tallyScores } from '../src/utils/tallyScores';

jest.mock('../src/utils/gameControls', () => {
  return {
    __esModule: true,
    deleteGame: jest.fn(),
    newGame: jest.fn(),
  };
});

jest.mock('../src/utils/tallyScores', () => {
  return {
    __esModule: true,
    tallyScores: jest.fn(async () => [{ user: 'astro', score: 10 }]),
  };
});

describe('newGame command', () => {
  const messageFromTMMock: Message = ({
    channel: {
      send: jest.fn(),
    },
    author: { bot: false },
    content: '',
    member: { roles: { cache: [{ name: 'TRIVIA MASTER' }] } },
  } as unknown) as Message;

  it('should send final scores', async () => {
    finalCommand.execute(messageFromTMMock);
    expect(tallyScores).toHaveBeenCalledWith(messageFromTMMock);
    expect(messageFromTMMock.channel.send).toHaveBeenCalled();
    expect(deleteGame).not.toHaveBeenCalled();
  });
});
