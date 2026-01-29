import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios';

interface Game {
  id: number;
  home_team: { full_name: string; abbreviation: string; score: number };
  visitor_team: { full_name: string; abbreviation: string; score: number };
  status: string;
  time: string;
  date: string;
}

const transformGame = (game: any): Game => ({
  id: game.id,
  home_team: {
    full_name: game.home_team.full_name,
    abbreviation: game.home_team.abbreviation,
    score: game.home_team_score ?? 0,
  },
  visitor_team: {
    full_name: game.visitor_team.full_name,
    abbreviation: game.visitor_team.abbreviation,
    score: game.visitor_team_score ?? 0,
  },
  status: game.status,
  time: game.time || '',
  date: game.datetime || game.date,
});

function getLocalDateISO() {
  const now = new Date();
  const local = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  return local.toISOString().split('T')[0];
}

const today = getLocalDateISO();

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const apiKey = config.balldontlieApiKey;
    const todayDate = today;

    const response = await axios.get('https://api.balldontlie.io/v1/games', {
      params: { 'dates[]': todayDate },
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const games = response.data.data.map(transformGame);
    return games;
  } catch (err: any) {
    console.error('Error fetching games:', err.message);
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch games' });
  }
});
