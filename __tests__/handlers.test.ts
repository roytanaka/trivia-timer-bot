import { Message } from 'discord.js';
import { messageHandler } from '../src/handlers';

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

  it('should send message when role is TRIVIA MASTER', async () => {
    messageFromTMMock.content = '::scores';
    await messageHandler(messageFromTMMock);
    expect(messageFromTMMock.channel.send).toHaveBeenCalled();
  });
});
