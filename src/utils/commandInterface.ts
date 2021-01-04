import { Message, User } from 'discord.js';

export interface TriviaCommand {
  name: string;
  description: string;
  trigger: string;
  aliases: string[];
  execute: (message: Message, args?: string[]) => void;
}
