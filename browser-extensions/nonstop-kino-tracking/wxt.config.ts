import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab"],
    action: {},
  },
  webExt: {
    startUrls: ["https://wxt.dev"],
  },
});
