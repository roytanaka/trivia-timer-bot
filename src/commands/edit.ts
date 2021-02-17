import { Client, Message, User } from 'discord.js';
import { TriviaCommand } from '../utils/commandInterface';
import { saveGame, getGame } from '../utils/gameControls';

const calculateScore = (scoreUpdate: string, score: number) => {
  const re = /^([-+]?)(.+)/;
  const [, operator, value] = re.exec(scoreUpdate)!;
  const numValue = +value;

  const operations: { [key: string]: () => number } = {
    '': (): number => numValue,
    '-': (): number => (score -= numValue),
    '+': (): number => (score += numValue),
  };
  return operations[operator]();
};

const editCommand: TriviaCommand = {
  name: 'Edit score command',
  description: 'Edit a user’s score.',
  trigger: 'edit',
  arguments: ['@user', '<number>'],
  aliases: ['edits', 'correct', 'correction'],
  async execute(message, args) {
    if (
      args?.length !== 2 ||
      !/^<@[^>]+>/.test(args[0]) ||
      isNaN(args[1] as any)
    ) {
      throw (
        'The edit command should include a tagged user and a number. ' +
        "Enter a `+` or `-` before ' the number and I'll calculate the " +
        'score for you. Meep morp. Zeep.\n e.g. `::edit @user +2`'
      );
    }
    const [userTag, scoreUpdate] = args;
    const user = await message.client.users.fetch(
      userTag.replace(/[<@!>]/gi, '')
    );
    if (user.bot) {
      throw "Silly Trivia Master, bots can't play trivia :rolling_eyes:";
    }
    const triviaMaster = message.author;
    const gameData = getGame(triviaMaster.id);
    const { currentScores } = gameData;

    if (!(user.id in currentScores)) {
      return message.channel.send(
        `:robot: Oops, can't find the user **${user}** in this game :person_shrugging:`
      );
    }

    const newScore = calculateScore(scoreUpdate, currentScores[user.id].score);
    currentScores[user.id].score = newScore;
    gameData.currentScores = currentScores;
    saveGame(triviaMaster.id, gameData);
    message.channel.send(
      `:mega: The score for **${user}** has been updated to **${
        currentScores[user.id].score
      }**`
    );
  },
};

module.exports = editCommand;
