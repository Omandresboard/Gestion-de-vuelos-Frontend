import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';


import HeaderC from './components/HeaderC.vue';
import CreateVuelo from './components/CreateVuelo.vue';
import CreatePasajero from './components/CreatePasajero.vue';
import UpdateVuelo from './components/UpdateVuelo.vue';
import VueloPasajeros from './components/VueloPasajeros.vue';
import LoginC from './components/LoginC.vue';

const routes = [

  { path: '/', component: LoginC },
  { path: '/home', component: HeaderC },
  { path: '/vuelos', component: CreateVuelo},
  { path: '/pasajeros', component: CreatePasajero},

  { 
    path: '/vuelos/:id',
    name: 'UpdateVuelo',
    component: UpdateVuelo
  },

  { 
    path: '/vueloPasajeros/:id', 
    name: 'VueloPasajeros', 
    component: VueloPasajeros 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount('#app');