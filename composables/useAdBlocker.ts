export const useAdBlocker = () => {
  const isBlocked = ref(false);

  onMounted(async () => {
    try {
      // Stabilization: Use Google Analytics as bait.
      // Logic: 
      // - Failure (Network Error in Catch) -> Blocker IS present (True).
      // - Success -> No Blocker (False).
      
      await fetch('https://www.google-analytics.com/analytics.js', { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store'
      });
      
      // If we reach here, the request was NOT blocked.
      isBlocked.value = false;
      
    } catch (error) {
      // Network error implies a blocker intercepted the request.
      isBlocked.value = true;
    }
  });

  return {
    isBlocked
  };
};
