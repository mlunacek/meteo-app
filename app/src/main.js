import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResoure from 'vue-resource';

import App from './App.vue';

import {routes} from './routes';
import makeStore from './store/store';
import lodash from 'lodash';  


export function main( options ) {

  Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });
  
  Vue.use(VueRouter);
  Vue.use(VueResoure);

  const router = new VueRouter({
    routes
  });

  const store = makeStore(options.initial_state);

  new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
  })

};