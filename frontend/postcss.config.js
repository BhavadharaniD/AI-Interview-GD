const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;

if (typeof module !== "undefined") {
  module.exports = config;
}
