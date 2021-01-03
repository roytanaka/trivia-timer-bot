import { Message } from 'discord.js';
const newGameCommand = require('../src/commands/newGame');
import { deleteGame, newGame } from '../src/utils/gameControls';

jest.mock('../src/utils/gameControls', () => {
  return {
    __esModule: true,
    deleteGame: jest.fn(),
    newGame: jest.fn(),
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

  it('should create a new game and send a message', async () => {
    newGameCommand.execute(messageFromTMMock);
    expect(deleteGame).toHaveBeenCalled();
    expect(newGame).toHaveBeenCalledWith(messageFromTMMock);
    expect(messageFromTMMock.channel.send).toHaveBeenCalledWith(
      ':mega: Trivia Time! Good luck, have fun!'
    );
  });
});
