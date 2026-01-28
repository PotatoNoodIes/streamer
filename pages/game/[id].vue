<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const home = ref<string>('');
const away = ref<string>('');
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

onMounted(() => {
  home.value = route.query.home as string;
  away.value = route.query.away as string;

  if (!home.value || !away.value) return;

  const homeSlug = TEAM_MAP[home.value];
  const awaySlug = TEAM_MAP[away.value];

  iframeUrl.value =
    `https://embedsports.top/embed/admin/ppv-${awaySlug}-vs-${homeSlug}/1`;
});

</script>

<template>
  <div class="min-h-screen bg-base-100">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- TOP BAR -->
      <div class="flex items-center justify-between mb-6">
        <NuxtLink to="/" class="btn btn-ghost">← Back</NuxtLink>
        <span class="badge badge-error">LIVE</span>
      </div>

      <!-- SCORE HEADER -->
      <div class="card bg-base-200 shadow-xl mb-6">
        <div class="card-body">
          <div class="grid grid-cols-3 items-center">
            <!-- AWAY -->
            <div class="flex items-center gap-4">
              <img :src="teamLogo(away)" class="w-14 h-14" />
              <h2 class="text-3xl font-bold">{{ away }}</h2>
            </div>

            <!-- CENTER (empty for now, real data later) -->
            <div class="text-center opacity-50">
              VS
            </div>

            <!-- HOME -->
            <div class="flex items-center gap-4 justify-end">
              <h2 class="text-3xl font-bold">{{ home }}</h2>
              <img :src="teamLogo(home)" class="w-14 h-14" />
            </div>
          </div>
        </div>
      </div>

      <!-- ADBLOCK NOTICE -->
      <div class="alert alert-warning mb-6">
        <span>
          Install
          <a href="https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh"
            target="_blank" class="font-bold underline">
            uBlock Origin Lite
          </a>
          for a clean, ad-free stream.
        </span>
      </div>

      <!-- PLAYER -->
      <div class="rounded-2xl overflow-hidden shadow-2xl bg-black">
        <iframe v-if="iframeUrl" :src="iframeUrl" class="w-full aspect-video" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>
