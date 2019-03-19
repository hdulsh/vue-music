import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png') // loading时默认显示的图片
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
