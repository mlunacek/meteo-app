<template>
     <section class="">

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
        }
    },

    created() {
  
        window.addEventListener('resize', this.handleResize)
        this.handleResize();
    },
   
      
    mounted() {


        // this.$store.dispatch("fetchSounding", { url: this.url, 
        //                                         id: this.$route.params.id,
        //                                         callback: this.onData })   
              
        
        this.onData();

    },

    methods:{
        
        toggleModal(){
            this.modal = !this.modal
            console.log(this.isModalActive())
            
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

            console.log(this.model)

            let data = this.sounding;
            this.graph = new WindGramGraph("windgraphid");
            this.graph.config(this.window.height-50, 
                              this.window.width-20,
                              20);
            // this.graph.config(this.window.height-70, 800);
            this.graph.data(data);
            this.graph.setKey(this.model)
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
        }
        
     
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