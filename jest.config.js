module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
