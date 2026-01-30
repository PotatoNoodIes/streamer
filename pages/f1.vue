<script setup lang="ts">
import type { F1Season, F1Race } from '~/types/f1';

const streamUrl = ref('https://www.youtube.com/embed/uH8t8t0j5ms?autoplay=1&mute=1&controls=0&loop=1');

const { data, pending, error } = await useFetch<F1Season>('https://ergast.com/api/f1/current.json', {
    key: 'f1-schedule',
    lazy: true,
    server: true
});

const races = computed(() => {
    return data.value?.MRData.RaceTable.Races || [];
});

const countryCodeMap: Record<string, string> = {
    'Bahrain': 'bh',
    'Saudi Arabia': 'sa',
    'Australia': 'au',
    'Azerbaijan': 'az',
    'USA': 'us',
    'United States': 'us',
    'Monaco': 'mc',
    'Spain': 'es',
    'Canada': 'ca',
    'Austria': 'at',
    'UK': 'gb',
    'Great Britain': 'gb',
    'Hungary': 'hu',
    'Belgium': 'be',
    'Netherlands': 'nl',
    'Italy': 'it',
    'Singapore': 'sg',
    'Japan': 'jp',
    'Qatar': 'qa',
    'Mexico': 'mx',
    'Brazil': 'br',
    'UAE': 'ae',
    'Abu Dhabi': 'ae',
    'China': 'cn',
    'Portugal': 'pt',
    'Turkey': 'tr',
    'France': 'fr',
    'Germany': 'de',
    'Russia': 'ru',
    'Malaysia': 'my'
};

const getFlagUrl = (country: string) => {
    const code = countryCodeMap[country] || 'xx';
    return `https://flagcdn.com/w40/${code}.png`;
};

const formatRaceDate = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short' }).format(d).toUpperCase();
};
</script>

<template>
    <div class="min-h-screen bg-streamer-bg font-sans text-white pb-20 relative overflow-hidden">

        <!-- SCANNING BACKGROUND ANIMATION -->
        <div class="fixed inset-0 pointer-events-none z-0">
            <div
                class="absolute inset-0 bg-[linear-gradient(transparent_40%,rgba(255,24,1,0.05)_50%,transparent_60%)] h-[200%] w-full animate-scan will-change-transform">
            </div>
        </div>

        <!-- HEADER (LOGO ONLY) -->
        <header class="relative z-10 flex justify-center py-8">
            <div class="select-none cursor-default">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="Formula 1"
                    class="h-10 md:h-14 w-auto transition-all duration-300 filter brightness-0 invert hover:filter-none hover:scale-105" />
            </div>
        </header>

        <!-- STREAM PLAYER (CENTERPIECE) -->
        <section class="max-w-6xl mx-auto px-4 md:px-6 mb-12 relative z-20">
            <div
                class="aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,24,1,0.2)]">
                <iframe class="w-full h-full" :src="streamUrl" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        </section>

        <!-- SCHEDULE (GLASS STRIPS) -->
        <section class="max-w-4xl mx-auto px-4 md:px-6 relative z-20 space-y-3">
            <div v-if="pending" class="flex justify-center py-10">
                <span class="loading loading-spinner text-streamer-accent loading-lg"></span>
            </div>

            <div v-else v-for="race in races" :key="race.round"
                class="flex items-center p-4 bg-white/5 backdrop-blur-md rounded-md hover:bg-white/10 hover:border-l-4 hover:border-l-streamer-accent transition-all duration-200 group border border-transparent border-l-4 border-l-transparent">

                <!-- ROUND -->
                <div class="w-12 text-center text-xs font-bold text-gray-500 group-hover:text-streamer-accent">
                    R{{ race.round }}
                </div>

                <!-- FLAG -->
                <div class="w-12 flex-shrink-0 flex justify-center">
                    <img :src="getFlagUrl(race.Circuit.Location.country)" :alt="race.Circuit.Location.country"
                        class="w-6 h-auto rounded-sm opacity-80 group-hover:opacity-100" />
                </div>

                <!-- DETAILS -->
                <div class="flex-grow flex flex-col md:flex-row md:items-center px-4 gap-1 md:gap-4">
                    <span class="text-white font-black uppercase tracking-tighter text-2xl md:text-3xl leading-none">
                        {{ race.Circuit.Location.country }}
                    </span>
                    <span class="hidden md:block w-px h-4 bg-white/20"></span>
                    <span class="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-tight truncate">
                        {{ race.Circuit.circuitName }}
                    </span>
                </div>

                <!-- DATE -->
                <div class="text-right min-w-[80px]">
                    <span class="block text-streamer-accent font-bold font-mono text-sm tracking-wider">
                        {{ formatRaceDate(race.date) }}
                    </span>
                    <span class="block text-[10px] text-gray-500">
                        {{ race.time ? race.time.slice(0, 5) : '--:--' }}
                    </span>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.animate-scan {
    animation: scan 4s linear infinite;
}

@keyframes scan {
    0% {
        transform: translateY(-50%);
    }

    100% {
        transform: translateY(0%);
    }
}

/* Ensure no scrollbar flicker */
::-webkit-scrollbar {
    width: 6px;
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}
</style>
