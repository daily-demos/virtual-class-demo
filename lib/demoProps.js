export default function getDemoProps() {
  return {
    domain: process.env.DAILY_DOMAIN || null,
    // Check that both domain and key env vars are set
    isConfigured: !!process.env.DAILY_DOMAIN && !!process.env.DAILY_API_KEY,
    // Are we running in demo mode? (automatically creates a short-expiry room)
    demoMode: !!process.env.DAILY_DEMO_MODE,
  };
}
