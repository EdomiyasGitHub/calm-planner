import type { CapacitorConfig } from "@capacitor/cli";

// appId must be unique on Google Play and cannot change after the first upload.
// Replace it once the product name is final (handbook section 16).
const config: CapacitorConfig = {
  appId: "com.calmplanner.app",
  appName: "Calm Planner",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
};

export default config;
