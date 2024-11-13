const SHOW_SIGN_UP = true;
const REFETCH_INTERVAL = 5 * 60 * 1000;
const KEYPAD_PRESETS_ACTION = "REPLACE"; // "REPLACE" | "ADD"
// This is made this way to allow configuration to be modifyable by expo update channel
const config = {
  SHOW_SIGN_UP,
  REFETCH_INTERVAL,
  KEYPAD_PRESETS_ACTION,
};

export default config;
