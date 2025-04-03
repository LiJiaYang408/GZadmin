// store/index.js
import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            details: []
        }
    },
    mutations: {
        setDetails(state, payload) {
            state.details = payload
        }
    }
})

export default store