<script setup lang="ts">
import { useAdBlocker } from '~/composables/useAdBlocker';

const { isBlocked } = useAdBlocker();
const isVisible = ref(false);

const DISMISSAL_KEY = 'adblock-prompt-dismissed';

onMounted(() => {
    const dismissed = localStorage.getItem(DISMISSAL_KEY);

    if (dismissed) {
        const { timestamp, expiry } = JSON.parse(dismissed);
        const now = new Date().getTime();

        if (now > timestamp + expiry) {
            localStorage.removeItem(DISMISSAL_KEY);
        } else {
            return;
        }
    }

    // If NOT blocked (isBlocked = false), show modal
    setTimeout(() => {
        if (!isBlocked.value) {
            isVisible.value = true;
        }
    }, 1000);
});

const dismiss = (forever = false) => {
    isVisible.value = false;

    // 30 days
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const data = {
        timestamp: new Date().getTime(),
        expiry: thirtyDaysInMs
    };

    localStorage.setItem(DISMISSAL_KEY, JSON.stringify(data));
};
</script>

<template>
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="isVisible"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <div
                class="relative max-w-sm w-full p-8 rounded-xl bg-streamer-card border border-streamer-border shadow-2xl text-center">
                <div class="mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-streamer-accent" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>

                <h2 class="text-2xl font-bold mb-2 text-white">Ad-Blocker Recommended</h2>
                <p class="text-gray-400 mb-8 text-sm leading-relaxed">
                    For the best experience on Streamer, we highly recommend using
                    <span class="text-white font-semibold">uBlock Origin</span>.
                </p>

                <a href="https://ublockorigin.com/" target="_blank" rel="noopener noreferrer"
                    class="block w-full py-3 px-4 bg-streamer-accent hover:bg-green-400 text-black font-bold rounded text-sm transition-colors mb-4"
                    @click="dismiss()">
                    Install uBlock Origin
                </a>

                <button @click="dismiss()"
                    class="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                    Maybe Later
                </button>
            </div>
        </div>
    </Transition>
</template>
