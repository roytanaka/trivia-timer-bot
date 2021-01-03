import { Message } from 'discord.js';

export interface TriviaCommand {
  name: string;
  trigger: string;
  aliases: string[];
  execute: (message: Message) => void;
}
