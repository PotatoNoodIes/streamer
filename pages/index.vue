```
<script setup lang="ts">
import { computed } from 'vue';
import { formatGameDate } from '~/utils/date';

interface Team {
  id: number;
  full_name: string;
  abbreviation: string;
  score: number;
}

interface Game {
  id: number;
  home_team: Team;
  visitor_team: Team;
  status: string;
  period: number;
  time: string;
  date: string;
}

// PERFORMANCE FIX: Lazy fetch to prevent navigation blocking
const { data, status } = await useFetch<Game[]>('/api/games', { lazy: true, server: false });

const games = computed(() => data.value ?? []);
const loading = computed(() => status.value === 'pending');

const teamLogo = (abbr: string) =>
  `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;

const isLive = (status: string) => status.toLowerCase().includes('live');

const normalizeAbbr = (abbr: string) => {
  if (abbr === 'UTA') return 'UTAH';
  return abbr;
};

</script>

<template>
  <div class="min-h-screen bg-streamer-bg">
    <!-- HEADER -->
    <header class="max-w-7xl mx-auto px-6 py-10">
      <h1 class="text-4xl font-extrabold tracking-tight text-white mb-2">
        NBA Live Games
      </h1>
      <p class="text-gray-400">Catch the action live.</p>
    </header>

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-32">
      <span class="loading loading-spinner loading-lg text-streamer-accent"></span>
    </div>

    <!-- GAMES -->
    <section v-else class="max-w-7xl mx-auto px-6 pb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="game in games" :key="game.id"
        class="card bg-streamer-card shadow-xl hover:shadow-2xl transition border border-streamer-border hover:border-streamer-accent group">
        <div class="card-body px-6 py-5">
          <!-- DATE & STATUS -->
          <!-- DATE LEAK FIX: Strictly using formatGameDate. No raw interpolation. -->
          <div class="flex justify-between items-start mb-6">
            <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ formatGameDate(game.date) }}
            </div>
          </div>

          <!-- TEAMS -->
          <div class="flex items-center justify-between mb-6">
            <!-- AWAY -->
            <div class="flex flex-col items-center gap-2 w-1/3">
              <img :src="teamLogo(normalizeAbbr(game.visitor_team.abbreviation))"
                class="w-16 h-16 object-contain drop-shadow-lg" />
              <span class="font-bold text-xl text-white">{{ game.visitor_team.abbreviation }}</span>
              <span class="text-3xl font-black text-gray-200">{{ game.visitor_team.score }}</span>
            </div>

            <!-- VS -->
            <div class="flex flex-col items-center justify-center w-1/3">
              <span class="text-streamer-accent opacity-20 text-4xl font-black italic">VS</span>
              <span v-if="isLive(game.status)" class="text-xs text-red-500 font-bold mt-1 animate-pulse">
                Q{{ game.period }} · {{ game.time }}
              </span>
            </div>

            <!-- HOME -->
            <div class="flex flex-col items-center gap-2 w-1/3">
              <img :src="teamLogo(normalizeAbbr(game.home_team.abbreviation))"
                class="w-16 h-16 object-contain drop-shadow-lg" />
              <span class="font-bold text-xl text-white">{{ game.home_team.abbreviation }}</span>
              <span class="text-3xl font-black text-gray-200">{{ game.home_team.score }}</span>
            </div>
          </div>

          <!-- ACTION -->
          <NuxtLink :to="{
            path: `/game/${game.id}`,
            query: {
              home: game.home_team.abbreviation,
              away: game.visitor_team.abbreviation,
              date: game.date,
              status: game.status
            }
          }" class="btn bg-streamer-accent hover:bg-green-400 text-black font-bold w-full border-none">
            Watch Stream
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
```
