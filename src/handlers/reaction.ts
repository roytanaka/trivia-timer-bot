import { MessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import { settings } from '../config';
import { checkTriviaMaster } from '../utils/utilFunctions';

export const reactionHandler = async (
  reaction: MessageReaction,
  user: User | PartialUser
) => {
  if (!(user instanceof User)) return;
  const channel = reaction.message.channel;
  if (!(channel instanceof TextChannel)) return;
  if (!channel.name.startsWith('trivia')) return;

  const reactedEmoji = reaction.emoji.name;
  const scoreKeeperEmojis = settings.scoreKeepers.map(keeper => keeper.emoji);
  const restrictedEmojis = scoreKeeperEmojis.concat(settings.ignore);

  const isRestricted = restrictedEmojis.includes(reactedEmoji);

  if (!isRestricted) return;

  const isTriviaMaster = checkTriviaMaster(user);

  if (reaction.count && reaction.count > 1) {
    if (isTriviaMaster) {
      // Remove bot score reaction
      await reaction.remove();
    } else {
      // If already has reaction, remove user
      await reaction.users.remove(user);
    }
  } else if (!isTriviaMaster && !user.bot) {
    // Remove if not Trivia Master
    await reaction.remove();
  }
};
