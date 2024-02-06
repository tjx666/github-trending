const config = require('@yutengjing/prettier-config');
/** @type {import('prettier').Config} */
module.exports = {
  ...config,
  tabWidth: 2,
  plugins: [...config.plugins, 'prettier-plugin-tailwindcss'],
};
