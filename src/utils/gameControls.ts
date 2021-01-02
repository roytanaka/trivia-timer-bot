import { Message } from 'discord.js';
import JSONdb from 'simple-json-db';
const db = new JSONdb('./database.json');

interface GameData {
  time: Date;
  lastScoreId: string;
  lastQuestionId: string;
  master: string;
  currentScores: { [key: string]: { score: number; user: string } };
}

export const gameExists = (id: string) => {
  return db.has(id);
};

export const getGame = (id: string): GameData => {
  return db.get(id);
};

export const saveGame = (id: string, gameData: GameData) => {
  const scores = gameData.currentScores;
  for (const key in scores) {
    scores[key].score = Math.round(scores[key].score * 100) / 100;
  }
  return db.set(id, gameData);
};

export const newGame = (message: Message): GameData => {
  const gameData: GameData = {
    time: new Date(),
    lastScoreId: message.id,
    lastQuestionId: message.id,
    master: message.author.username,
    currentScores: {},
  };
  saveGame(message.author.id, gameData);
  return gameData;
};

export const deleteGame = (id: string) => {
  db.delete(id);
};
