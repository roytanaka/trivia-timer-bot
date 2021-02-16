require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const gameReactions = require('./utils/gameReactions');
const { newGame, gameExists } = require('./utils/gameControls');

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageReactionAdd', (reaction, user) => {
  // Check if Channel names starts with 'trivia'
  const channel = reaction.message.channel.name;
  if (!channel.startsWith('trivia')) return;

  gameReactions.execute(reaction, user);
});

client.on('message', async message => {
  // Check for prefix
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // Check if role includes Trivia Master
  const roles = message.member.roles.cache;
  if (!roles.some(role => role.name.includes('TRIVIA MASTER'))) return;
  // Check if Channel names starts with 'trivia'
  if (!message.channel.name.startsWith('trivia')) return;
  // Check if a Game exits for Trivia Master
  if (!gameExists(message.author.id)) {
    newGame(message);
  }

  const fullCommand = message.content
    .slice(prefix.length) // remove prefix
    .split(/ +|(?<=^q)\d/i); // split by space or digit
  const args = fullCommand.slice(1);
  const command = fullCommand[0].toLowerCase(); // case insensitive

  // command can only be letters. No numbers
  switch (command) {
    case 'q':
      client.commands.get('question').execute(message);
      break;
    case 'newgame':
    case 'new-game':
      client.commands.get('newGame').execute(message);
      break;
    case 'correct':
    case 'edit':
      if (!message.mentions.users.size || isNaN(args[1])) {
        return message.channel.send(
          ':robot: Dose not compute. The edit command should include ' +
            'a tagged user and a number. Enter a `+` or `-` before ' +
            "the number and I'll calculate the score for you. " +
            'Meep morp. Zeep.\n e.g. `::edit @user +2`'
        );
      }
      client.commands.get('correct').execute(message, args);
      break;
    case 'a':
    case 'answer':
      client.commands.get('answer').execute(message, args);
      break;
    case 'score':
    case 'scores':
      client.commands.get('scores').execute(message);
      break;
    case 'final':
      client.commands.get('final').execute(message);
      break;
    default:
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
