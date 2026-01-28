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
    <header class="fixed top-0 left-0 right-0 z-40 glass-header border-b border-white/10">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <!-- BRAND -->
            <div class="flex-shrink-0">
                <NuxtLink to="/" class="text-2xl font-black tracking-tighter text-primary"
                    style="letter-spacing: -0.05em;">
                    STREAMER
                </NuxtLink>
            </div>

            <!-- NAVIGATION -->
            <nav class="flex-1 flex justify-center">
                <div class="bg-gray-100/10 p-1 rounded-xl flex space-x-1 backdrop-blur-sm">
                    <NuxtLink v-for="tab in tabs" :key="tab.name" :to="tab.path"
                        class="relative px-6 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        :class="isActive(tab.path) ? 'text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-900'">
                        <!-- Active Background -->
                        <span v-if="isActive(tab.path)" class="absolute inset-0 bg-white rounded-lg shadow-sm"
                            style="z-index: -1;"></span>

                        {{ tab.name }}
                    </NuxtLink>
                </div>
            </nav>

            <!-- RIGHT - Placeholder for profile/search -->
            <div class="flex-shrink-0 w-8">
                <!-- Maintain balance -->
            </div>
        </div>
    </header>

    <!-- Spacer to prevent content from hiding behind fixed header -->
    <div class="h-16"></div>
</template>

<style scoped>
.glass-header {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
    .glass-header {
        background: rgba(0, 0, 0, 0.7);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
}
</style>
