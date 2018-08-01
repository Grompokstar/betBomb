const webpack = require('webpack');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'de_portal_frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'DE Portal 2.0' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700&amp;subset=cyrillic" rel="stylesheet' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700&amp;subset=cyrillic' }
    ]
  },
  modules: [
    ['cookie-universal-nuxt', { parseJSON: false }],
  ],
  sentry: {
    dsn: 'http://e3db63d086164e9b9e9ecda686649763@185.193.143.85/3'
  },
  plugins: [
    '~/plugins/bootstrap.js',
    '~/plugins/vuetify.js',
    '~/plugins/vuei18n.js',
    { src: '~/plugins/cxlt-vue2-toastr.js', ssr: false }
  ],
  css: [
    'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css',
    '~/assets/stylus/app.styl',
    '~/assets/stylus/theme.styl'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'jquery',
      'bootstrap',
      '~/plugins/vuetify.js',
      'chart.js',
      'vue-chartjs'
    ],
    extractCSS: true,
    plugins: [
      // set shortcuts as global for bootstrap
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
    /*
    ** Run ESLint on save
    */
    /*extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }*/
  }
}
