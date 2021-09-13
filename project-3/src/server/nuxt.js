const { Nuxt, Builder } = require('nuxt');

module.exports = async function (app) {
  // Import and Set Nuxt.js options
  const config = require('../../nuxt.config.js');
  config.dev = process.env.NODE_ENV !== 'production';

  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  await nuxt.ready();

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }
  app.use(nuxt.render)
  return nuxt;
}
