export default {
  async fetch(request) {
    const incident = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const payload = {
      system: "TriggerGuard",
      classification: "PLATFORM_FAULT",
      incident,
      timestamp,
      guidance:
        "This failure shows no indicators of user-side misconfiguration."
    };

    return new Response(JSON.stringify(payload, null, 2), {
      status: 503,
      headers: {
        "content-type": "application/json",
        "x-triggerguard": "active",
        "x-incident-id": incident
      }
    });
  }
};
