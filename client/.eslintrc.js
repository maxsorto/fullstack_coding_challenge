module.exports = {
  root: true,
  env: { node: true },
  parser: 'vue-eslint-parser',
  plugins: ['prettier'],
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'warn',
  },
}
