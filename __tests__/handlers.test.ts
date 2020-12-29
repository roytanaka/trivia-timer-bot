import { Client, Message, TextChannel } from 'discord.js';
import { messageHandler } from '../src/handlers';
import { MockMessage, MockUser } from 'jest-discordjs-mocks';

const client = new Client();

describe('Message handler', () => {
  const message: Message = new MockMessage();
  const channel = ({
    send: jest.fn(),
  } as unknown) as TextChannel;
  message.channel = channel;
  message.author = new MockUser(client, { id: 123 });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    client.destroy();
  });

  it('should not send a message for normal messages', async () => {
    message.content = 'normal message';
    await messageHandler(message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });

  it('should send "pong" as a message', async () => {
    message.content = 'ping';
    await messageHandler(message);
    expect(message.channel.send).toHaveBeenCalledWith('pong');
  });

  it('should not send if author is a bot', async () => {
    message.content = 'ping';
    message.author.bot = true;
    await messageHandler(message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });
});
