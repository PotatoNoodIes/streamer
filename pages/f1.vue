<script setup lang="ts">
interface F1Session {
    fp1: string;
    fp2: string;
    fp3: string;
    qualifying: string;
    gp: string;
}

interface F1Race {
    name: string;
    location: string;
    round: number;
    slug: string;
    sessions: F1Session;
}

const { data, pending } = await useFetch(`https://raw.githubusercontent.com/sportstimes/f1/main/_db/f1/${new Date().getFullYear().toString()}.json`, {
    key: 'f1-schedule',
    server: true
});

const races = computed(() => {
    if (!data.value) return [];
    if (Array.isArray(data.value)) return data.value;
    if (data.value.races && Array.isArray(data.value.races)) return data.value.races;
    return [];
});

const streamUrl = ref('https://www.youtube.com/embed/kXk_qi-HJ5U?autoplay=1&mute=1&loop=1');
const selectedSessionKey = ref('gp');

const sessionLabels: Record<string, string> = {
    fp1: 'P1',
    fp2: 'P2',
    fp3: 'P3',
    qualifying: 'Q',
    gp: 'RACE'
};

const isRaceToday = (date: string) => {
    const today = new Date().toLocaleDateString('en-CA');
    return today === new Date(date).toLocaleDateString('en-CA');
};

const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const selectSession = (race: F1Race, sessionKey: string) => {
    selectedSessionKey.value = sessionKey;
    const suffix = sessionKey === 'gp' ? 'race' : sessionKey;
    streamUrl.value = `https://embedsports.top/embed/admin/ppv-${race.slug}-${suffix}/1`;
};

watchEffect(() => {
    if (races.value.length > 0) {
        const activeRace = races.value.find(r => isRaceToday(r.sessions.gp));
        if (activeRace) {
            selectSession(activeRace, 'gp');
        }
    }
});

const formatRaceDate = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short' }).format(d).toUpperCase();
};
</script>

<template>
    <div class="min-h-screen bg-streamer-bg font-sans text-white pb-20 relative overflow-hidden">

        <div class="fixed inset-0 pointer-events-none z-0">
            <div
                class="absolute inset-0 bg-[linear-gradient(transparent_40%,rgba(255,24,1,0.05)_50%,transparent_60%)] h-[200%] w-full animate-scan will-change-transform">
            </div>
        </div>

        <header class="relative z-10 flex justify-center py-8">
            <div class="select-none cursor-default">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="Formula 1"
                    class="h-10 md:h-14 w-auto transition-all duration-300 filter brightness-0 invert hover:filter-none hover:scale-105" />
            </div>
        </header>

        <section class="max-w-6xl mx-auto px-4 md:px-6 mb-12 relative z-20">
            <div
                class="aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,24,1,0.2)]">
                <iframe class="w-full h-full" :src="streamUrl" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                </iframe>
            </div>
        </section>

        <section class="max-w-4xl mx-auto px-4 md:px-6 relative z-20 space-y-4">
            <div v-if="pending" class="flex justify-center py-10">
                <span class="loading loading-spinner text-streamer-accent loading-lg"></span>
            </div>

            <div v-else v-for="race in races" :key="race.round"
                class="bg-white/5 backdrop-blur-md rounded-lg hover:bg-white/10 transition-all duration-200 group border border-white/5 overflow-hidden"
                :class="{
                    'ring-1 ring-streamer-accent': races.find(r => r.slug === race.slug && isRaceToday(r.sessions.gp))
                }">

                <div class="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 border-b border-white/5">

                    <div class="w-12 text-center text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">
                        R{{ race.round }}
                    </div>

                    <div class="flex-grow flex flex-col justify-center">
                        <span class="text-white font-black uppercase tracking-tighter text-xl md:text-2xl leading-none">
                            {{ race.name }}
                        </span>
                        <span class="text-sm font-bold text-gray-500 uppercase tracking-tight">
                            {{ race.location }}
                        </span>
                    </div>

                    <div class="text-right min-w-[80px] shrink-0">
                        <span class="block text-streamer-accent font-bold font-mono text-sm tracking-wider">
                            {{ formatRaceDate(race.sessions.gp) }}
                        </span>
                        <span class="block text-[10px] text-gray-500 uppercase">
                            {{ new Date(race.sessions.gp).toLocaleDateString('en-CA', { weekday: 'short' }) }}
                        </span>
                    </div>
                </div>

                <div class="p-3 bg-black/20 flex flex-wrap gap-2 items-center justify-center md:justify-start">
                    <button v-for="(time, key) in race.sessions" :key="key" @click="selectSession(race, key)"
                        class="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition-all duration-200 min-w-[60px] text-center"
                        :class="selectedSessionKey === key && race.slug === races.find(r => r.sessions[key] === time)?.slug
                            ? 'bg-streamer-accent text-black border-streamer-accent'
                            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/40 hover:text-white'">
                        <span class="block opacity-70 text-[10px] mb-0.5">{{ formatTime(time) }}</span>
                        {{ sessionLabels[key] || key }}
                    </button>
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

::-webkit-scrollbar {
    width: 6px;
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}
</style>