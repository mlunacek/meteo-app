<template>
     <section class="">
    <div>
        <div class="tabs">
            <ul>
            <router-link to="/" tag="li" active-class='is-active' exact><a><icon-base view-box="0 0 100 100"><icon-home/></icon-base></a></router-link>
            <router-link to="/" tag="li" active-class='is-active' exact><a>sounding</a></router-link>

            <!-- <span> <strong>{{name}}</strong> </span> -->
            <li v-bind:class="{ 'is-active': isActive('nam') }" v-on:click="changeModel"><a>nam</a></li>
            <li v-bind:class="{ 'is-active': isActive('hrrr') }" v-on:click="changeModel"><a>hrrr</a></li>
            <li  v-on:click="toggleModal"> <a><icon-base view-box="0 0 50 50"><icon-config/></icon-base></a></li>
            </ul>
        
        </div>
    </div>


    <div  v-bind:class="{ 'is-active': isModalActive() }" class="modal">
    <!-- <div  class="modal is-active"> -->
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
        <p class="modal-card-title">Configuration</p>
        <button class="delete" aria-label="close" v-on:click="toggleModal"></button>
        </header>
        <section class="modal-card-body">
        
        <div class="pretty p-default">
            <input type="checkbox" id="threshold" value="Threshold" v-model="thresholdWind">
            <div class="state">
                <label for="threshold">Threshold wind at 15mph</label>
            </div>
        </div>

      <div class="pretty p-default">
            <input type="checkbox" id="nightoverlay" value="NightOverlay" v-model="nightOverlay">
            <div class="state">
                <label for="nightoverlay">Night overlay</label>
            </div>
        </div>

      <div class="pretty p-default">
            <input type="checkbox" id="theme" value="dark" v-model="theme">
            <div class="state">
                <label for="theme">dark theme</label>
            </div>
        </div>

      <div class="pretty p-default">
            <input type="checkbox" id="theme" value="dark" v-model="numbers">
            <div class="state">
                <label for="numbers">numbers</label>
            </div>
        </div>

        <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br>


        </section>
        <!-- <footer class="modal-card-foot">
        <button class="button is-success" v-on:click="save">Save changes</button>
        <button class="button" v-on:click="toggleModal">Cancel</button>
        </footer> -->
    </div>
    </div>


            <div id="windgraphid"></div>
            <div id="windgraphidfocus"></div>
        


     </section>
</template>

<script>

import {WindGramGraph} from '../graphs/windgram_graph';
import IconBase from './icons/IconBase.vue'
import IconHome from './icons/IconHome.vue'
import IconConfig from './icons/IconConfig.vue'

export default {

  components: {
    IconBase,
    IconHome,
    IconConfig,
  },


    data() {
        return {
        'window': {
            'width': 0,
            'height': 0,
         },
        'modal': false,
        'nightOverlay': false,
        'thresholdWind': false,
        'numbers': true,
        }
    },

    created() {
  
      this.initial_state = this.$store.state.initial_state;

      // Check to see if anything is saved?
      var obj = JSON.parse(window.localStorage.getItem('store'));
      console.log(obj)
      if( obj && obj !== 'null' && obj !== 'undefined'){
          obj['initial_state'] = this.initial_state;
          this.$store.replaceState(obj);
      }


        window.addEventListener('resize', this.handleResize)
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
        if(this.window.width > 1152){
            this.window.width = 1150;
        }
    },
   


    mounted() {


        this.$store.dispatch("fetchSounding", { url: this.url, 
                                                id: this.$route.params.id,
                                                callback: this.onData })   
              
        
        // this.onData();
        console.log("switching to page")
        this.$router.push({name: 'windgram', 'params': {'id': this.$route.params.id }});

    },

    methods:{
        save(){
            console.log("save")        
        },
        toggleModal(){
            this.modal = !this.modal

            this.graph.setThreshold(this.thresholdWind)
         
            console.log("theme -----> ", this.theme)
            if( this.theme === true){
                this.graph.background_dark();
            }
            else{
                this.graph.background_light();
            }
            if( this.numbers === true){
                this.graph.numbers_show();
            }
            else{
                this.graph.numbers_hide();
            }

            this.graph.draw();

            const data = JSON.stringify(this.$store.state)
            console.log("saving state")
            window.localStorage.setItem('store', data);
            
        },
        
        isModalActive(){
            return this.modal;
        },

        changeModel(event){
            this.$store.state.initial_state.soundings[this.$route.params.id]['model'] = event.target.innerText;
            this.graph.setKey(this.model)
            
            this.graph.draw();
        },

        isActive(key){
            return key === this.model;
        },


        handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
            if(this.window.width > 1152){
                this.window.width = 1150;
            }
            
            // this.graph.config(this.window.height-50, 
            //                   this.window.width-20,
            //                   20);   
            // this.graph.setKey('hrrr')      
            // this.graph.draw();
        },

        onData() {
            this.load_graph();   
        },

        load_graph(){

            console.log(this.sounding)

            

            let data = this.sounding;
            this.graph = new WindGramGraph("windgraphid");
            this.graph.config(this.window.height-50, 
                              this.window.width-20,
                              18);
            // this.graph.config(this.window.height-70, 800);
            this.graph.data(data);
            this.graph.setKey(this.model)
            // this.graph.setThreshold(this.thresholdWind)

            if( this.theme === true){
                this.graph.background_dark();
            }
            else{
                this.graph.background_light();
            }
            if( this.numbers === true){
                this.graph.numbers_show();
            }
            else{
                this.graph.numbers_hide();
            }

            this.graph.draw();


            // this.graph2 = new WindGramGraph("windgraphidfocus");
            // this.graph2.config(this.window.height/2-50, 
            //                   this.window.width-30,
            //                   9);
            // this.graph2.data(data);
            // this.graph2.setKey('hrrr')
            // this.graph2.draw();

        }
    },
    
    computed: {
        location(){
            return this.$store.getters.get_location(this.$route.params.id);
        },
        url(){
            return this.location['url']
        },
        model(){
            return this.location['model']
        },
        sounding(){
            return this.$store.getters.get_sounding(this.$route.params.id);
        },
        name(){
            return this.$route.params.id;
        },

        theme: {
           get(){
               return this.$store.state.initial_state['soundings'][this.$route.params.id]['theme'];
           },
           set(value){
              this.$store.state.initial_state['soundings'][this.$route.params.id]['theme'] = value;
           }
       },



        
     
     }

}
</script>

<style>

.svg-block{
  float: left;
}

.canvas-block{
  float: left;
  top: 0px;
  left: 0px;
}

.chart{
  z-index: -2;
  opacity: .99;
  background-color: white;
  float: left;
  clear: none;
}

.react-root{
  float: left;
  clear: none;
  position: relative;
}

.section {
    padding: 1rem 1rem;
}

div.scrollmenu {
    background-color: white;
    overflow: auto;
    white-space: nowrap;
    border-style: solid;
    border-color: lightgrey;
    border-width: 1px;
}

.zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}

</style>