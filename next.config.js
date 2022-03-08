/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_GAME_NAME: "Kantle",
    REACT_APP_LOCALE_STRING: "id",
    REACT_APP_SOLUTION_PASSPHRASE: "salamjustalk",
    REACT_APP_BASE_URL: "https://kantle.vercel.app",
  },
};

module.exports = nextConfig;
