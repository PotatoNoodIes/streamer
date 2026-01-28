<script setup lang="ts">
import { useAdBlocker } from '~/composables/useAdBlocker';

const { isBlocked } = useAdBlocker();
const isVisible = ref(false);

onMounted(() => {
    // Check local storage for dismissal
    const dismissed = localStorage.getItem('adblock-modal-dismissed');

    if (dismissed) {
        const { timestamp, expiry } = JSON.parse(dismissed);
        const now = new Date().getTime();

        // If current time is past expiry, clear it and allow showing
        if (now > timestamp + expiry) {
            localStorage.removeItem('adblock-modal-dismissed');
        } else {
            // Still suppressed
            return;
        }
    }

    // Watch for the check result
    // If isBlocked is FALSE (No blocker), we show the modal.
    // Wait a tick to ensure logic settles.
    setTimeout(() => {
        if (!isBlocked.value) {
            isVisible.value = true;
        }
    }, 1000);
});

const dismiss = () => {
    isVisible.value = false;

    // Set 30-day suppression
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const data = {
        timestamp: new Date().getTime(),
        expiry: thirtyDaysInMs
    };

    localStorage.setItem('adblock-modal-dismissed', JSON.stringify(data));
};
</script>

<template>
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="isVisible"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div
                class="relative max-w-md w-full p-6 rounded-2xl border border-white/20 shadow-2xl glass-panel text-center">
                <h2 class="text-xl font-bold mb-2 text-white">Enhance Your Experience</h2>
                <p class="text-white/80 mb-6 font-light">
                    For a better experience, we suggest installing an ad-blocker.
                </p>

                <a href="https://ublockorigin.com/" target="_blank" rel="noopener noreferrer"
                    class="btn btn-primary btn-wide mb-4" @click="dismiss">
                    Get uBlock Origin
                </a>

                <button @click="dismiss" class="btn btn-ghost btn-sm text-white/50 hover:text-white">
                    Maybe Later
                </button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.glass-panel {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Dark mode override if system preference or class strategy is used, 
   but for now a generic dark glass usually looks good on both or primarily dark streamer sites. */
@media (prefers-color-scheme: light) {
    .glass-panel {
        background: rgba(255, 255, 255, 0.7);
        border-color: rgba(0, 0, 0, 0.1);
    }

    h2 {
        color: #000;
    }

    p {
        color: #333;
    }

    button.text-white\/50 {
        color: #666;
    }

    button.text-white\/50:hover {
        color: #000;
    }
}

@media (prefers-color-scheme: dark) {
    .glass-panel {
        background: rgba(0, 0, 0, 0.7);
        border-color: rgba(255, 255, 255, 0.1);
    }
}
</style>
