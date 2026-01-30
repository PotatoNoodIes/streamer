<script setup lang="ts">
import { ref } from 'vue';

const route = useRoute();
const isMenuOpen = ref(false);

const tabs = [
    { name: 'NBA', path: '/' },
    { name: 'Futbol', path: '/futbol' },
    { name: 'F1', path: '/f1' },
];

const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
};

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-40 bg-streamer-bg/95 backdrop-blur-sm border-b border-streamer-border">
        <div class="h-16 flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
            <!-- BRAND -->
            <div class="flex-shrink-0 z-50 relative">
                <NuxtLink to="/" class="text-2xl font-black tracking-tighter text-white"
                    style="letter-spacing: -0.05em;" @click="closeMenu">
                    STREAMER
                </NuxtLink>
            </div>

            <!-- DESKTOP NAVIGATION -->
            <nav class="hidden md:flex flex-1 justify-center">
                <div class="flex space-x-2 bg-streamer-card p-1 rounded-full border border-streamer-border">
                    <NuxtLink v-for="tab in tabs" :key="tab.name" :to="tab.path"
                        class="px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ease-out"
                        :class="isActive(tab.path) ? 'bg-streamer-accent text-black shadow-lg shadow-streamer-accent/20' : 'text-gray-400 hover:text-white hover:bg-white/5'">
                        {{ tab.name }}
                    </NuxtLink>
                </div>
            </nav>

            <!-- RIGHT - Placeholder (Desktop) / Hamburger (Mobile) -->
            <div class="flex-shrink-0 w-8 flex justify-end">
                <!-- Hamburger Button -->
                <button @click="toggleMenu" class="md:hidden text-white focus:outline-none z-[60] relative p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2.5">
                        <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                            d="M4 6h16M4 12h16M4 18h16" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- MOBILE MENU OVERLAY -->
        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-5"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-5">
            <div v-if="isMenuOpen"
                class="fixed inset-0 bg-[#0E0E10] z-50 flex flex-col pt-24 px-6 md:hidden shadow-2xl border-b border-streamer-border h-screen">
                <nav class="flex flex-col space-y-2">
                    <NuxtLink v-for="tab in tabs" :key="tab.name" :to="tab.path" @click="closeMenu"
                        class="text-lg font-bold py-3 w-full border-b border-streamer-border/50 text-left transition-colors duration-200"
                        :class="isActive(tab.path) ? 'text-streamer-accent pl-2 border-l-4 border-l-streamer-accent' : 'text-gray-400 hover:text-white'">
                        {{ tab.name }}
                    </NuxtLink>
                </nav>
            </div>
        </transition>
    </header>

    <div class="h-16"></div>
</template>
