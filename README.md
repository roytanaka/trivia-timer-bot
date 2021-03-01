DISCORD TRIVIA TIMER BOT
========================
Host your own pub style trivia game on Discord Chat. As the Trivia Master you can submit quiz questions in the chat and trigger a 15 second timer. Mark correct answers with emojis and display scores. 

Table of Contents
-----------------
- [DISCORD TRIVIA TIMER BOT](#discord-trivia-timer-bot)
  - [Table of Contents](#table-of-contents)
  - [Discord Server Setup](#discord-server-setup)
  - [Commands](#commands)
  - [Message Reactions](#message-reactions)
  - [Development](#development)

Discord Server Setup
--------------------
Server requires a Discord role named **Trivia Master**. The trivia host will need to be assigned this role. Create a new Text Channel named with **trivia** in the name. Start a new game with the command `::newgame` in the trivia channel. Good luck, have fun!

Commands
-----------
|Command                   |Function |
|--------------------------|---------|
|`::newgame`               | Start a new game. Clears existing game if one exists.|
|`::q [Trivia question]`   | Starts the 15 sec trivia timer with your question|
|`::answer [Trivia answer]`| Automatically mark contestant’s correct answers|
|`::edit [@user <number>]` | Edit a user’s score.|
|`::score`                 | Output current game scores |
|`::final`                 | Outputs final game score with medals. Also ends current game.|

Message Reactions
-----------------
Mark contestant’s answers by reacting to their message with the following emojis. The scorekeeper uses these to tally scores. 

|Emoji (Discord name)                | Answer type        |Points |
|----------------------------|--------------------|-----------:|
|✅ `:white_check_mark:`     | Correct answer     | 1 |
|🔶 `:large_orange_diamond:` | Half Point answer  | 0.5 |
|⭐️ `:star:`                 | Bonus Point answer | 1 |
|⚖️ `:scales:`                | Tie Breaker answer | 0.1 |

Development
-----------

Clone this repo and host the bot on your development machine.
```bash
git clone https://github.com/roytanaka/trivia-timer-bot.git
```
Setup project with:
```bash
npm install
```
Compile and auto restart node after save for development:
```bash
npm run dev
```

Go to Discord [developer portal](https://discordapp.com/developers/applications/) to create an app and generate your bot `token`. Create a `.env` file in the root directory of your project and enter this line with your `token`:

```
DISCORD_TOKEN=your-bot-token
```

