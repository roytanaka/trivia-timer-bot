require('dotenv').config();
const Discord = require('discord.js');
const { prefix, emojis } = require('./config.json');
const client = new Discord.Client();

let triviaRoleId;

client.once('ready', () => {
  console.log('Ready!');
  // get Trivia Master role ID for use later
  triviaRoleId = client.guilds.cache.first().roles.cache.find((role) => {
    return role.name.includes('Trivia Master');
  }).id;
});

// Only Trivia Master Role can add ✅
client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.emoji.name !== '✅') return;
  // Members with Trivia Master Role
  const membersWithRole = reaction.message.guild.roles.cache.get(triviaRoleId)
    .members;
  // Remove ✅ if not Trivia Master
  if (!membersWithRole.some((member) => member.id === user.id)) {
    reaction.remove(user);
  }
});

client.on('message', async (message) => {
  // Check if role includes Trivia Master
  const roles = message.member.roles.cache;
  if (!roles.some((role) => role.name.includes('Trivia Master'))) return;
  // Only start timer on Channel names that start with 'trivia'
  if (!message.channel.name.startsWith('trivia')) return;
  // Start timer with ::Q prefix
  if (message.content.startsWith(`${prefix}Q`)) {
    const msg = await message.channel.send(`:mega: Timer Starting!`);
    let i = 0;
    const interval = setInterval(() => {
      if (i === 15) {
        // Time's up stop interval
        msg.edit(':mega: TIME’S UP :alarm_clock: Submit your answer!');
        clearInterval(interval);
      } else if (i % 5 === 0 || (i >= 12 && i <= 14)) {
        // Update timer at 15, 10, 5, 3, 2, 1
        msg.edit(`:mega: Submit your answer in ${emojis[i]} seconds!`);
      }
      i++;
    }, 1000);
  }

  // Display scores with::scores command
  if (message.content.startsWith(`${prefix}scores`)) {
    const today = Number(new Date().setHours(0, 0, 0, 0));
    const messages = message.channel.messages.cache
      .array()
      //filter out bots and messages earlier than today
      .filter((msg) => !msg.author.bot && msg.createdTimestamp > today);
    console.log('log: messages', messages);
    // filter for correct answers i.e. msg with ✅ reaction
    const correct = messages.filter((msg) =>
      msg.reactions.cache.find((reaction) => reaction._emoji.name === '✅')
    );

    const msg = await message.channel.send(`Total correct: ${correct.length}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
