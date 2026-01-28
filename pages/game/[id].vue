<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { formatGameDate } from '~/utils/date';

const route = useRoute();

const home = ref<string>('');
const away = ref<string>('');
const gameDate = ref<string>(''); // For formatted date string
const iframeUrl = ref('');

const TEAM_MAP: Record<string, string> = {
  ATL: 'atlanta-hawks',
  BOS: 'boston-celtics',
  BKN: 'brooklyn-nets',
  CHA: 'charlotte-hornets',
  CHI: 'chicago-bulls',
  CLE: 'cleveland-cavaliers',
  DAL: 'dallas-mavericks',
  DEN: 'denver-nuggets',
  DET: 'detroit-pistons',
  GS: 'golden-state-warriors',
  HOU: 'houston-rockets',
  IND: 'indiana-pacers',
  LAC: 'los-angeles-clippers',
  LAL: 'los-angeles-lakers',
  MEM: 'memphis-grizzlies',
  MIA: 'miami-heat',
  MIL: 'milwaukee-bucks',
  MIN: 'minnesota-timberwolves',
  NO: 'new-orleans-pelicans',
  NY: 'new-york-knicks',
  OKC: 'oklahoma-city-thunder',
  ORL: 'orlando-magic',
  PHI: 'philadelphia-76-ers',
  PHX: 'phoenix-suns',
  POR: 'portland-trail-blazers',
  SAC: 'sacramento-kings',
  SA: 'san-antonio-spurs',
  TOR: 'toronto-raptors',
  UTAH: 'utah-jazz',
  WAS: 'washington-wizards'
};


const teamLogo = (abbr: string) =>
  `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;

const gameStatus = ref<string>('');

const isLive = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('final') || (s.includes('t') && s.includes('z')) || s.includes('pm')) return false;
  return s.includes('qtr') || s.includes('half') || s.includes('live') || s.includes('period');
};


onMounted(() => {
  const rawHome = route.query.home as string;
  const rawAway = route.query.away as string;
  const rawDate = route.query.date as string;

  home.value = rawHome === 'UTA' ? 'UTAH' : rawHome;
  away.value = rawAway === 'UTA' ? 'UTAH' : rawAway;

  if (rawDate) {
    gameDate.value = formatGameDate(rawDate);
  }

  if (!home.value || !away.value) return;

  const homeSlug = TEAM_MAP[home.value];
  const awaySlug = TEAM_MAP[away.value];
  gameStatus.value = route.query.status as string || '';

  iframeUrl.value =
    `https://embedsports.top/embed/admin/ppv-${awaySlug}-vs-${homeSlug}/1`;
});

</script>

<template>
  <div class="min-h-screen bg-streamer-bg">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- TOP BAR -->
      <div class="flex items-center justify-between mb-6">
        <NuxtLink to="/" class="btn btn-circle btn-ghost text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </NuxtLink>
        <div v-if="gameStatus">
          <span v-if="isLive(gameStatus)" class="badge bg-red-600 text-white border-none font-bold animate-pulse">
            LIVE
          </span>
          <span v-else-if="gameStatus.toLowerCase().includes('final')"
            class="badge badge-ghost text-gray-500 font-bold">
            FINAL
          </span>
          <span v-else class="badge badge-outline text-gray-400 font-bold">
            SCHEDULED
          </span>
        </div>
      </div>

      <!-- SCORE HEADER -->
      <div class="card bg-streamer-card shadow-xl mb-6 border border-streamer-border">
        <div class="card-body">
          <div class="grid grid-cols-3 items-center">
            <!-- AWAY -->
            <div class="flex items-center gap-4">
              <img :src="teamLogo(away)" class="w-16 h-16 object-contain" />
              <h2 class="text-3xl font-black text-white tracking-tight">{{ away }}</h2>
            </div>

            <!-- CENTER -->
            <div class="text-center">
              <div class="text-streamer-accent font-black text-2xl italic opacity-30">VS</div>
              <div v-if="gameDate" class="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest">
                {{ gameDate }}
              </div>
            </div>

            <!-- HOME -->
            <div class="flex items-center gap-4 justify-end">
              <h2 class="text-3xl font-black text-white tracking-tight">{{ home }}</h2>
              <img :src="teamLogo(home)" class="w-16 h-16 object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- ADBLOCK NOTICE -->
      <div class="alert bg-streamer-card border-streamer-accent text-white mb-6 shadow-lg shadow-green-900/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-streamer-accent shrink-0 h-6 w-6" fill="none"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>
          Install
          <a href="https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh"
            target="_blank" class="font-bold text-streamer-accent hover:underline">
            uBlock Origin Lite
          </a>
          for a clean, ad-free stream.
        </span>
      </div>

      <!-- PLAYER -->
      <div class="rounded-2xl overflow-hidden shadow-2xl bg-black border border-streamer-border relative group">
        <!-- Glow effect -->
        <div
          class="absolute -inset-1 bg-gradient-to-r from-streamer-accent to-blue-600 opacity-20 blur group-hover:opacity-40 transition duration-1000">
        </div>
        <iframe v-if="iframeUrl" :src="iframeUrl" class="w-full aspect-video relative z-10" frameborder="0"
          allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>
