import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default function makeStore(initialState){

    
    console.log(JSON.stringify(initialState));

    return new Vuex.Store({
        
        state: {
            'initial_state': initialState,
            'soundings': {},
            'current_state': {
                'page': 'windgram',
                'location': 'broomfield',
                'model': 'nam',
            },
        },

        mutations: {
            FETCH_SOUNDING(state, data) {
                state.soundings[data['id']] = data['data'];
                const tmp = JSON.stringify(state)
                window.localStorage.setItem('store', tmp);
            }
        },
        
        getters: {
            get_location: (state ) => {
                return (keyword) => {
                    return state.initial_state.soundings[keyword];
                }
            },
            get_sounding: (state ) => {
                return (keyword) => {
                    return state.soundings[keyword];
                }
            }
        },

        actions: {

            fetchSounding({ commit }, { url, id, callback })  {    
             
                Vue.http.get(url)
                    .then(function(response){
                        console.log(response)
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