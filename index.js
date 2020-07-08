require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

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

  client.commands.get('correctReaction').execute(reaction, user);
});

client.on('message', async (message) => {
  // Check for prefix
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // Check if role includes Trivia Master
  const roles = message.member.roles.cache;
  if (!roles.some((role) => role.name.includes('TRIVIA MASTER'))) return;
  // Check if Channel names starts with 'trivia'
  if (!message.channel.name.startsWith('trivia')) return;

  const command = message.content
    .slice(prefix.length) // remove prefix
    .split(/ +/) // split by space
    .shift() // return first value of array
    .toLowerCase(); // case insensitive

  switch (command) {
    case 'q':
      client.commands.get('question').execute(message);
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
