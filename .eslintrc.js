module.exports = {
  extends: ["@rushstack/eslint-config/profile/web-app", "plugin:storybook/recommended"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
