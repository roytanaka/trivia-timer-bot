import { MessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import { settings } from '../config';

export const reactionHandler = async (
  reaction: MessageReaction,
  user: User | PartialUser
) => {
  if (!(user instanceof User)) {
    return;
  }
  const channel = reaction.message.channel as TextChannel;
  if (!channel.name.startsWith('trivia')) return;

  const reactedEmoji = reaction.emoji.name;
  const scoreKeeperEmojis = settings.scoreKeepers.map(keeper => keeper.emoji);
  const restrictedEmojis = scoreKeeperEmojis.concat(settings.ignore);

  const isRestricted = restrictedEmojis.includes(reactedEmoji);

  if (!isRestricted) return;
  // get Trivia Master role ID
  const guildRoles = reaction.message.guild?.roles.cache!;
  const triviaRole = guildRoles.find(role => {
    return role.name.includes('TRIVIA MASTER');
  })!;
  // Members with Trivia Master Role
  const membersWithTriviaRole = guildRoles.get(triviaRole.id)?.members!;
  const isTriviaMaster = membersWithTriviaRole.some(
    member => member.id === user.id
  );

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
