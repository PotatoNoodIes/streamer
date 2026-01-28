export const useAdBlocker = () => {
  const isBlocked = ref(false);

  // We only run this on the client side
  onMounted(async () => {
    try {
      // Try to fetch a known ad script. 
      // If it fails (network error), it's likely blocked.
      // HEAD method is faster as we don't need the body.
      // mode: 'no-cors' is needed because we are hitting an external domain that might not send CORS headers for a check like this,
      // BUT 'no-cors' typically returns an opaque response which doesn't throw on network error in the same way for all blockers.
      // However, most aggressive blockers (uBlock Origin) will block the network request entirely, causing a fetch error or a specific failure that we can catch.
      
      // Let's try a standard fetch first. 
      // If uBlock blocks it, fetch throws "TypeError: Failed to fetch"
      await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store'
      });
      
      // If we get here, the request was ALLOWED (or at least attempted and not blocked by the network layer in a way that throws).
      // Meaning NO ad-blocker is effectively killing the request.
      isBlocked.value = false;
      
    } catch (error) {
      // If fetch throws, it's likely blocked by an extension.
      isBlocked.value = true;
    }
  });

  return {
    isBlocked
  };
};
