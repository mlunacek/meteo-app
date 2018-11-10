<template>
  <div>
      <div class="tabs">
        <ul>
          <router-link to="/" tag="li" active-class='is-active' exact><a><icon-base><icon-home/></icon-base></a></router-link>
        
          <span> Broomfield </span>
        </ul>
       
      </div>
  </div>
</template>

<script>

import IconBase from './icons/IconBase.vue'
import IconHome from './icons/IconHome.vue'
import IconFly from './icons/IconFly.vue'
import IconKite from './icons/IconKite.vue'
import IconTable from './icons/IconTable.vue'

export default {

  components: {
    IconBase,
    IconHome,
    IconFly,
    IconKite,
    IconTable
  },

  computed:{

  },

  created() {

      this.initial_state = this.$store.state;

      // Check to see if anything is saved?
      var obj = JSON.parse(window.localStorage.getItem('store'));
      // console.log(obj)
      if( obj && obj !== 'null' && obj !== 'undefined'){
          this.$store.replaceState(obj);
      }

  
  },
  save(){
      const data = JSON.stringify(this.$store.state)
      window.localStorage.setItem('store', data);
  },

  methods: {
    reset(){
    },

  }
}
</script>

<style>
.select.is-small {
  background-color: white;
}
.select-width{
  width: 200px;
}
</style>