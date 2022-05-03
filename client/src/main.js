/* eslint-disable vue/multi-word-component-names */
import { createApp } from 'vue';
import mitt from 'mitt';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import './assets/scss/app.scss';
import Draggable from 'vuedraggable';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCircle,
  faSquare,
  faWindowMaximize,
  faWindowRestore,
} from '@fortawesome/free-regular-svg-icons';
import {
  faPlay,
  faInfinity,
  faList,
  faClose,
  faGripLinesVertical,
  faArrowRotateRight,
  faTrash,
  faInfo,
} from '@fortawesome/free-solid-svg-icons';

const emitter = mitt();
const app = createApp(App).use(router).use(store).use(VueAxios, axios);

/**
 * Third party components
 */
app.component('VueDraggable', Draggable);
app.component('FontAwesomeIcon', FontAwesomeIcon);

/**
 * Font Awesome Icons
 */
library.add(
  faCircle,
  faPlay,
  faWindowMaximize,
  faWindowRestore,
  faInfinity,
  faList,
  faSquare,
  faClose,
  faGripLinesVertical,
  faArrowRotateRight,
  faTrash,
  faInfo
);

/**
 * App Components
 */
const components = import.meta.globEager('./components/**/*.vue');
Object.entries(components).forEach(([path, definition]) => {
  const componentName = path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  app.component(componentName, definition.default);
});

app.config.globalProperties.emitter = emitter;

app.mount('#app');
