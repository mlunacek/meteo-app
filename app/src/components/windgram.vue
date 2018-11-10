<template>
     <section class="section">

            <div class="modal is-moble">
            <div class="modal-background"></div>
            
            <div class="modal-card">
                <header class="modal-card-head">
                <p class="modal-card-title">Configuration</p>
                <button class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                <div class="field">
                    <div class="control">
                        <input class="input is-primary" type="text" placeholder="Primary input">
                    </div>
                </div>
                </section>
                <footer class="modal-card-foot">
                <button class="button is-success">Save changes</button>
                <button class="button">Cancel</button>
                </footer>
            </div>
            
            </div>


            <div id="windgraphid"></div>
     
        


     </section>
</template>

<script>

import {WindGramGraph} from '../graphs/windgram_graph';

export default {

    data() {
        return {
        'window': {
            'width': 0,
            'height': 0,
         }
        }
    },

    created() {
  
        window.addEventListener('resize', this.handleResize)
        this.handleResize();
    },
   
      
    mounted() {

        console.log("mounted")
        this.$store.dispatch("fetchSounding", { url: this.url, 
                                                id: this.$route.params.id,
                                                callback: this.onData })   
              
        
        // this.onData();

    },

    methods:{

        handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
            // this.graph.config(this.window.height-70, this.window.width-30);
            // // this.graph.config(this.window.height-70, 800);
            // this.graph.draw();
        },

        onData() {
            this.load_graph();   
        },

        load_graph(){

            let data = this.sounding;
            this.graph = new WindGramGraph("windgraphid");
            this.graph.config(this.window.height-70, this.window.width-30);
            // this.graph.config(this.window.height-70, 800);
            this.graph.data(data);
            this.graph.draw();

        }
    },
    
    computed: {
        url(){
            return this.$store.state.initial_state.soundings[this.$route.params.id]['url']
        },
        sounding(){
            return this.$store.state.soundings[this.$route.params.id];
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