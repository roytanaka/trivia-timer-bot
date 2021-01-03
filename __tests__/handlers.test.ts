import { Message } from 'discord.js';
import { messageHandler } from '../src/handlers';
import { gameExists, newGame } from '../src/utils/gameControls';
jest.mock('../src/utils/gameControls', () => {
  return {
    __esModule: true,
    gameExists: jest.fn(() => false),
    newGame: jest.fn(),
  };
});

jest.mock('../src/commands/scores');

describe('Message handler', () => {
  const messageMock: Message = ({
    channel: {
      send: jest.fn(),
    },
    author: { bot: false },
    content: '',
  } as unknown) as Message;

  const messageFromTMMock: Message = ({
    channel: {
      send: jest.fn(),
    },
    author: { bot: false },
    content: '',
    member: { roles: { cache: [{ name: 'TRIVIA MASTER' }] } },
  } as unknown) as Message;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not respond on messages without prefix', async () => {
    messageMock.content = 'normal message';
    await messageHandler(messageMock);
    expect(messageMock.channel.send).not.toHaveBeenCalled();
  });

  it('should not respond on channels that dont start with "Trivia"', async () => {
    messageMock.content = 'normal message';
    if (messageMock.channel.type === 'text') {
      messageMock.channel.name = 'trivia-channel';
    }
    await messageHandler(messageMock);
    expect(messageMock.channel.send).not.toHaveBeenCalled();
  });

  it('should not respond to users who are not Trivia Master', async () => {
    messageMock.content = '::scores';
    await messageHandler(messageMock);
    expect(messageMock.channel.send).not.toHaveBeenCalled();
  });

  it('should not send if author is a bot', async () => {
    messageMock.content = '::scores';
    messageMock.author.bot = true;
    await messageHandler(messageMock);
    expect(messageMock.channel.send).not.toHaveBeenCalled();
  });

  it('should create a new game when non exists', async () => {
    messageFromTMMock.content = '::score';
    await messageHandler(messageFromTMMock);
    expect(gameExists).toHaveBeenCalled();
    expect(newGame).toHaveBeenCalledWith(messageFromTMMock);
  });
});
