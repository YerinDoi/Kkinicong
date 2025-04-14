module.exports = {
  extends: ["@rushstack/eslint-config/profile/web-app"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
