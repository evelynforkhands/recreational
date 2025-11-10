// entrypoints/background.ts

export default defineBackground(() => {
  (browser.action ?? browser.browserAction).onClicked.addListener(
    async (tab) => {
      if (!tab.id) return;

      try {
        await browser.tabs.sendMessage(tab.id, {
          type: "EXTRACT_AND_COPY_MOVIE_STATS",
        });
      } catch (err) {
        console.error(
          "Failed to ask content script for movie stats. Is it injected on this page?",
          err,
        );
      }
    },
  );
});
