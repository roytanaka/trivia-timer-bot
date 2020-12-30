import { Message } from 'discord.js';
import { messageHandler } from '../src/handlers';

describe('Message handler', () => {
  const messageMock: Message = ({
    channel: {
      send: jest.fn(),
    },
    author: { bot: false },
  } as unknown) as Message;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not respond on messages without prefix', async () => {
    messageMock.content = 'normal message';
    await messageHandler(messageMock);
    expect(messageMock.channel.send).not.toHaveBeenCalled();
  });

  it('should not respond to users who are Trivia Master', async () => {
    messageMock.content = '::scores';
    await messageHandler(messageMock);
    expect(messageMock.channel.send).not.toHaveBeenCalled();
  });

  it('should not send if author is a bot', async () => {
    messageMock.content = 'ping';
    messageMock.author.bot = true;
    await messageHandler(messageMock);
    expect(messageMock.channel.send).not.toHaveBeenCalled();
  });
});
