<template>
  <nav class="bg-dark">
    <h3 class="text-light m-0">Panel de Administracion</h3>
    <button @click="cerrarSesion" class="d-flex btn btn-outline-light"
      >Cerrar Sesion</button
    >
  </nav>
  <VueloC />
</template>

<script>
import VueloC from "./VueloC.vue";

export default {
  name: "HeaderC",
  components: {
    VueloC,
  },
  methods:{
    cerrarSesion(){
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }
};
</script>

<style scoped>
nav {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
}

.btn {
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
}

@media (max-width: 520px) {
  nav {
    width: 100%;
    justify-content: center;
    gap: 15px;
  }
  .btn {
    width: 100%;
  }
}
</style>