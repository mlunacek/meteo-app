import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default function makeStore(initialState){

    console.log(initialState);

    return new Vuex.Store({
        
        state: {
            'initial_state': initialState,
            'soundings': {},
        },

        mutations: {
            FETCH_SOUNDING(state, data) {
                state.soundings[data['id']] = data['data'];
                const tmp = JSON.stringify(state)
                window.localStorage.setItem('store', tmp);
            }
        },
        
        getters: {

        },

        actions: {

            fetchSounding({ commit }, { url, id, callback })  {    
             
                Vue.http.get(url)
                    .then(function(response){
                        commit("FETCH_SOUNDING", {'id': id, 
                                                  'data': response.body});
                        callback();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },



        }
        
        
    });
}