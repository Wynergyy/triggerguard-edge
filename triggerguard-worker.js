export default {
  async fetch() {
    return new Response(
      JSON.stringify(
        {
          system: "TriggerGuard",
          status: "active",
          message: "TriggerGuard core deployed successfully"
        },
        null,
        2
      ),
      {
        headers: {
          "content-type": "application/json",
          "x-triggerguard": "active"
        }
      }
    );
  }
};
