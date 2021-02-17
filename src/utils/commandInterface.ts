import { Message } from 'discord.js';

export interface TriviaCommand {
  name: string;
  description: string;
  trigger: string;
  arguments?: string[];
  aliases: string[];
  execute: (message: Message, args?: string[]) => void;
}
