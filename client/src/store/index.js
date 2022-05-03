// store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import videos from './modules/videos';

const store = createStore({
  modules: {
    auth,
    videos,
  },
});

export default store;
