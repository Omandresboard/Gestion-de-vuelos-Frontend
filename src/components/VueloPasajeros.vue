<template>
  <div class="vuelos">
    <div class="Admin">
      <h3>
        Administrar Pasajeros del Vuelo:
        <span class="text-danger">{{ this.$route.params.id }}</span> con destino
        a: <span class="text-danger">{{ vuelo.destino_desc }}</span>
      </h3>
      <router-link to="/home" class="btn btn-secondary">Volver</router-link>
    </div>
    <hr />
    <br />
    <div v-if="pasajeros.length > 0">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Identificacion</th>
            <th>Nombres</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Foto:</th>
            <th>Eliminar Pasajero</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center" v-for="pasajero in pasajeros" :key="pasajero.id">
            <td>{{ pasajero.identificacion }}</td>
            <td>{{ pasajero.nombres }}</td>
            <td>{{ pasajero.apellidos }}</td>
            <td>{{ pasajero.email }}</td>
            <td>{{ pasajero.telefono }}</td>
            <td>
              <img :src="`${backendUrl}/imagenes/Pasajeros/${pasajero.foto}`" :alt="pasajero.foto" style="width: 100px;">
            </td>
            <td>
              <button
                class="btn btn-outline-danger"
                @click="eliminarPasajero(pasajero.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container-fluid" v-else>
      <div class="alert alert-success text-center">
        No hay Pasajeros en este vuelo
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "VueloPasajeros",
  data() {
    return {
      pasajeros: [],
      vuelo: {},
      backendUrl: process.env.VUE_APP_BACKEND_URL,
    };
  },
  methods: {
    obtenerPasajeros() {
      axios
        .get(`http://localhost:3000/api/pasajeros/${this.$route.params.id}`)
        .then((response) => {
          this.pasajeros = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los pasajeros:", error);
        });
      axios
        .get(`http://localhost:3000/api/vuelos/${this.$route.params.id}`)
        .then((response) => {
          this.vuelo = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener el vuelo:", error);
        });
    },
    eliminarPasajero(idPasajero) {
      // Buscar el pasajero por su ID
      const pasajeroAEliminar = this.pasajeros.find(
        (pasajero) => pasajero.id === idPasajero
      );

      // Verificar si se encontró al pasajero
      if (pasajeroAEliminar) {
        Swal.fire({
          title: "¿Estás seguro?",
          text: `Esta acción eliminará al pasajero ${pasajeroAEliminar.nombres}. ¿Deseas continuar?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`http://localhost:3000/api/pasajeros/${this.$route.params.id}/${idPasajero}`)
              .then((response) => {
                console.log("Pasajero eliminado:", response.data);
                this.obtenerPasajeros(); 
                const pasajerosActualizados = this.pasajeros.filter(p => p.id != idPasajero)
                this.pasajeros = pasajerosActualizados; 
                Swal.fire({
                  icon: "success",
                  title: "Pasajero Eliminado",
                  text: "El pasajero ha sido eliminado exitosamente",
                });
              })
              .catch((error) => {
                console.error("Error al eliminar el pasajero:", error);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Hubo un problema al intentar eliminar al pasajero",
                });
              });
          }
        });
      } else {
        // Si no se encuentra el pasajero, mostrar un mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo encontrar al pasajero para eliminar",
        });
      }
    },
  },
  mounted() {
    this.obtenerPasajeros();
  },
};
</script>

<style scoped>
.Admin {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1rem, 0.5rem, 1rem rgba(0, 0, 0, 0.1);
}

.btn {
  width: 100px;
  font-weight: bolder;
}
.vuelos {
  width: 100%;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.table {
  width: fit-content;
  display: block;
  border-collapse: collapse;
  overflow-y: auto;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  border-radius: 15px;
}

.table .btn {
  width: fit-content;
  font-weight: 400;
}

.table th {
  width: 100vw;
  font-weight: bold;
}

.table td,
.table th {
  text-align: center;
}

@media (max-width: 820px) {
  .flight-table {
    overflow-x: scroll;
  }
}
</style>
