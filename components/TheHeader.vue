<script setup lang="ts">
const route = useRoute();

const tabs = [
    { name: 'NBA', path: '/' },
    { name: 'Futbol', path: '/futbol' },
    { name: 'F1', path: '/f1' },
];

const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
};
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-40 bg-streamer-bg/95 backdrop-blur-sm border-b border-streamer-border">
        <div class="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
            <!-- BRAND -->
            <div class="flex-shrink-0">
                <NuxtLink to="/" class="text-2xl font-black tracking-tighter text-white"
                    style="letter-spacing: -0.05em;">
                    STREAMER
                </NuxtLink>
            </div>

            <!-- NAVIGATION -->
            <nav class="flex-1 flex justify-center">
                <div class="flex space-x-2 bg-streamer-card p-1 rounded-full border border-streamer-border">
                    <NuxtLink v-for="tab in tabs" :key="tab.name" :to="tab.path"
                        class="px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ease-out"
                        :class="isActive(tab.path) ? 'bg-streamer-accent text-black shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'">
                        {{ tab.name }}
                    </NuxtLink>
                </div>
            </nav>

            <!-- RIGHT - Placeholder -->
            <div class="flex-shrink-0 w-8"></div>
        </div>
    </header>

    <div class="h-16"></div>
</template>
