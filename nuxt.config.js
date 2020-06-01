module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'stroogle',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Structural Webapp' }
    ],
    script: [
      //  { src: '/js/svg4everybody.min.js'}
      // { src: '//cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.99.7/jsxgraphcore.js' },
      // { src: 'https://cdn.jsdelivr.net/npm/apexcharts' },
      // { src: 'https://cdn.jsdelivr.net/npm/vue-apexcharts' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      // { rel:'stylesheet', type:'text/css', href:'//cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.99.7/jsxgraph.css' }
    ]
  },
  plugins: ['~/plugins/vuetify.js','~/plugins/konva.js'],
  css: ['~/assets/style/app.styl'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    //analyze : true,
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          //loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
