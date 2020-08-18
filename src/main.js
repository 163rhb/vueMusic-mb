import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {getRequest} from "./assets/js/api";
Vue.prototype.getRequest=getRequest
//引入mint-ui
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './assets/css/my-mint.css'

Vue.use(MintUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
