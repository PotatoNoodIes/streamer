<script setup lang="ts">
import { ref } from 'vue';

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
}

const games = ref<Game[]>([]);
const loading = ref(true);

const teamLogo = (abbr: string) =>
  `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;

const isLive = (status: string) => status.toLowerCase().includes('live');

const { data } = await useFetch<Game[]>('/api/games');
games.value = data.value ?? [];
loading.value = false;
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <!-- HEADER -->
    <header class="max-w-7xl mx-auto px-6 pt-14 pb-10">
      <h1 class="text-5xl font-extrabold tracking-tight">
        NBA Live Games
      </h1>
    </header>

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-32">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- GAMES -->
    <section
      v-else
      class="max-w-7xl mx-auto px-6 pb-20 grid gap-6"
    >
      <div
        v-for="game in games"
        :key="game.id"
        class="card bg-base-200 shadow-xl hover:shadow-2xl transition"
      >
        <div class="card-body px-8 py-6">
          <!-- STATUS BAR -->
          <div class="flex justify-between items-center mb-4">
            <div
              class="badge"
              :class="isLive(game.status) ? 'badge-error' : 'badge-outline'"
            >
              {{ game.status.toUpperCase() }}
            </div>

            <div v-if="isLive(game.status)" class="text-sm font-semibold">
              Q{{ game.period }} · {{ game.time }}
            </div>
          </div>

          <!-- TEAMS -->
          <div class="grid grid-cols-3 items-center">
            <!-- AWAY -->
            <div class="flex items-center gap-4">
              <img
                :src="teamLogo(game.visitor_team.abbreviation)"
                class="w-12 h-12"
              />
              <div>
                <p class="font-bold">
                  {{ game.visitor_team.abbreviation }}
                </p>
                <p class="text-2xl font-extrabold">
                  {{ game.visitor_team.score }}
                </p>
              </div>
            </div>

            <!-- VS -->
            <div class="text-center text-sm opacity-50 font-semibold">
              VS
            </div>

            <!-- HOME -->
            <div class="flex items-center gap-4 justify-end">
              <div class="text-right">
                <p class="font-bold">
                  {{ game.home_team.abbreviation }}
                </p>
                <p class="text-2xl font-extrabold">
                  {{ game.home_team.score }}
                </p>
              </div>
              <img
                :src="teamLogo(game.home_team.abbreviation)"
                class="w-12 h-12"
              />
            </div>
          </div>

          <!-- ACTION -->
          <NuxtLink
            :to="{
              path: `/game/${game.id}`,
              query: {
                home: game.home_team.abbreviation,
                away: game.visitor_team.abbreviation
              }
            }"
            class="btn btn-primary btn-wide mt-6 self-center"
          >
            Watch Stream
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
