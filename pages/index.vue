<script setup lang="ts">
import { onUnmounted, onMounted } from 'vue';
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

const games = useState<Game[]>('cached-nba-games', () => []);
const loading = ref(games.value.length === 0);

const refreshGames = async () => {
  try {
    const today = new Date().toLocaleDateString('en-CA');
    const data = await $fetch<Game[]>('/api/games', {
      query: { date: today }
    });
    games.value = data;
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    loading.value = false;
  }
};

const teamLogo = (abbr: string) =>
  `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;

const isLive = (status: string) => status.toLowerCase().includes('live');

const normalizeAbbr = (abbr: string) => {
  if (abbr === 'UTA') return 'UTAH';
  return abbr;
};

onMounted(() => {
  refreshGames();

  const timer = setInterval(() => {
    refreshGames();
  }, 60000);

  onUnmounted(() => {
    clearInterval(timer);
  });
});
</script>

<template>
  <div class="min-h-screen bg-streamer-bg font-sans text-white pb-20">
    <!-- HEADER -->
    <header class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
        NBA Live Games
      </h1>
      <p class="text-gray-400 text-sm md:text-base">Catch the action live.</p>
    </header>

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-32">
      <span class="loading loading-spinner loading-lg text-streamer-accent"></span>
    </div>

    <!-- GAMES -->
    <section v-else class="max-w-7xl mx-auto px-4 md:px-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="game in games" :key="game.id" class="h-full">
        <div
          class="card bg-streamer-card shadow-xl hover:shadow-2xl transition duration-300 border border-streamer-border hover:border-streamer-accent group h-full">
          <div class="card-body px-4 md:px-6 py-6 flex flex-col h-full">

            <!-- HEADER: DATE & STATUS -->
            <div class="flex justify-between items-center mb-6">
              <div class="text-[0.65rem] md:text-xs font-bold text-gray-500 uppercase tracking-widest truncate mr-2">
                {{ formatGameDate(game.date) }}
              </div>

              <div v-if="!game.status.includes(':')" class="badge font-bold shrink-0"
                :class="isLive(game.status) ? 'bg-red-600 text-white border-none animate-pulse' : 'badge-ghost text-gray-400'">
                {{ game.status.toUpperCase() }}
              </div>
            </div>

            <!-- SCOREBOARD -->
            <div class="flex items-center justify-between mb-8 flex-1">
              <!-- AWAY TEAM -->
              <div class="flex flex-col items-center gap-3 flex-1">
                <div
                  class="w-16 h-16 md:w-20 md:h-20 aspect-square flex items-center justify-center p-2 bg-black/20 rounded-xl">
                  <img :src="teamLogo(normalizeAbbr(game.visitor_team.abbreviation))"
                    class="w-full h-full object-contain drop-shadow-2xl" loading="lazy" />
                </div>
                <div class="text-center">
                  <div class="font-bold text-lg md:text-xl tracking-tight leading-none mb-1">{{
                    game.visitor_team.abbreviation }}</div>
                  <div class="text-2xl md:text-4xl font-black text-white tabular-nums">{{ game.visitor_team.score }}
                  </div>
                </div>
              </div>

              <!-- VS -->
              <div class="flex flex-col items-center justify-center px-2">
                <span class="text-streamer-accent/40 text-2xl md:text-4xl font-black italic">VS</span>
                <span v-if="isLive(game.status)"
                  class="text-[0.6rem] text-red-500 font-bold mt-1 uppercase tracking-wider text-center">
                  Q{{ game.period }}<br>{{ game.time }}
                </span>
              </div>

              <!-- HOME TEAM -->
              <div class="flex flex-col items-center gap-3 flex-1">
                <div
                  class="w-16 h-16 md:w-20 md:h-20 aspect-square flex items-center justify-center p-2 bg-black/20 rounded-xl">
                  <img :src="teamLogo(normalizeAbbr(game.home_team.abbreviation))"
                    class="w-full h-full object-contain drop-shadow-2xl" loading="lazy" />
                </div>
                <div class="text-center">
                  <div class="font-bold text-lg md:text-xl tracking-tight leading-none mb-1">{{
                    game.home_team.abbreviation }}</div>
                  <div class="text-2xl md:text-4xl font-black text-white tabular-nums">{{ game.home_team.score }}</div>
                </div>
              </div>
            </div>

            <!-- ACTION -->
            <div class="mt-auto">
              <NuxtLink :to="{
                path: `/game/${game.id}`,
                query: {
                  home: game.home_team.abbreviation,
                  away: game.visitor_team.abbreviation,
                  date: game.date,
                  status: game.status
                }
              }"
                class="btn bg-streamer-accent hover:bg-green-400 text-black font-bold w-full border-none h-12 uppercase tracking-wide text-base shadow-lg shadow-streamer-accent/20">
                Watch Stream
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>
