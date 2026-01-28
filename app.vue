<template>
  <div
    class="min-h-screen flex flex-col bg-base-100 font-sans text-base-content selection:bg-primary selection:text-white">
    <TheHeader />
    <AdBlockerModal />

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded-t-2xl mt-auto">
      <aside>
        <p class="font-bold">
          STREAMER <br />Providing reliable content since 2024
        </p>
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
    </footer>
  </div>
</template>
