<template>
  <div class="flight-management">
    <div class="Admin">
      <h1>Administrar Vuelos</h1>
      <div class="botones">
        <router-link to="/pasajeros" class="btn btn-light">Crear Pasajero +</router-link>
        <router-link to="/vuelos" class="btn btn-light">Crear Vuelo +</router-link>
      </div>
    </div>
    <br />
    <!-- Verificar si hay vuelos antes de mostrar la tabla -->
    <template v-if="vuelos.length > 0">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Codigo de Vuelo</th>
            <th>Destino</th>
            <th>Aerolínea</th>
            <th>Sala</th>
            <th>Hora de Salida</th>
            <th>Hora de LLegada</th>
            <th>Tiempo de Vuelo</th>
            <th>Editar Vuelo</th>
            <th>Ver Pasajeros</th>
            <th>Cancelar vuelo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vuelo in vuelos" :key="vuelo.codvuelo">
            <td>{{ vuelo.codvuelo }}</td>
            <td>{{ vuelo.destino_desc }}</td>
            <td>{{ vuelo.aerolinea_desc }}</td>
            <td>{{ vuelo.salaabordaje }}</td>
            <td>{{ vuelo.horasalida }}</td>
            <td>{{ vuelo.horallegada }}</td>
            <td>{{ calcularTiempoVuelo(vuelo) }}</td>
            <td>
              <router-link :to="{ name: 'UpdateVuelo', params: { id: vuelo.codvuelo } }" class="btn btn-outline-success">Editar</router-link>
            </td>
            <td>
              <router-link :to="{ name: 'VueloPasajeros', params: { id: vuelo.codvuelo } }" class="btn btn-outline-primary">Ver</router-link>
            </td>
            <td>
              <button class="btn btn-outline-danger" @click="eliminarVuelo(vuelo.codvuelo)">Cancelar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <!-- Mostrar un mensaje si no hay vuelos registrados -->
    <template v-else>
      <div class="container-fluid">
        <div class="alert alert-success text-center">
          No hay vuelos registrados
        </div>
      </div>
    </template>
    <br />
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "VueloC",
  data() {
    return {
      vuelos: [],
    };
  },
  methods: {
    obtenerVuelos() {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/api/vuelos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.vuelos = response.data;
        })
        .catch((error) => {
          console.error("Error al obtener los vuelos:", error);
        });
    },
    calcularTiempoVuelo(vuelo) {
      const horaInicio = vuelo.horasalida.split(":");
      const horaFin = vuelo.horallegada.split(":");

      const horaInicioMinutos =
        parseInt(horaInicio[0]) * 60 + parseInt(horaInicio[1]);
      const horaFinMinutos = parseInt(horaFin[0]) * 60 + parseInt(horaFin[1]);

      let diferencia = horaFinMinutos - horaInicioMinutos;
      if (diferencia < 0) {
        diferencia = horaFinMinutos - horaInicioMinutos + 24 * 60;
      }

      const horas = Math.floor(diferencia / 60);
      const minutos = diferencia % 60;

      return `${horas}h ${minutos}m`;
    },
    actualizarTiempoEstimado() {
      const ahora = new Date();

      this.vuelos.forEach((vuelo) => {
        const horaSalida = new Date(vuelo.horasalida);
        const tiempoRestante = Math.max(
          0,
          Math.floor((horaSalida - ahora) / (60 * 1000))
        );

        vuelo.tiempoEstimado = tiempoRestante;
      });
    },
    eliminarVuelo(codVuelo) {
      let destinoDesc = "";

      axios
        .get(`http://localhost:3000/api/vuelos/${codVuelo}`)
        .then((response) => {
          destinoDesc = response.data.destino_desc;

          Swal.fire({
            title: `¿Estás seguro de cancelar el vuelo ${codVuelo}?`,
            text: `Esta acción eliminará el vuelo con destino a ${destinoDesc}. ¿Deseas continuar?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar vuelo",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              axios
                .delete(`http://localhost:3000/api/vuelos/${codVuelo}`)
                .then((response) => {
                  console.log("Vuelo eliminado:", response.data);
                  this.obtenerVuelos();
                  Swal.fire({
                    icon: "success",
                    title: `El vuelo ${codVuelo} con destino ${destinoDesc} ha sido eliminado con éxito`,
                    text: "El vuelo ha sido cancelado exitosamente",
                  });
                })
                .catch((error) => {
                  console.error("Error al eliminar el vuelo:", error);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al intentar eliminar el vuelo",
                  });
                });
            }
          });
        })
        .catch((error) => {
          console.error("Error al obtener información del vuelo:", error);
        });
    },
  },
  mounted() {
    this.obtenerVuelos();
    setInterval(this.actualizarTiempoEstimado, 60000);
  },
};
</script>

<style scoped>
.Admin {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.botones {
  display: flex;
  width: fit-content;
  gap: 15px;
}

.flight-management {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
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

.table th,
.table td {
  text-align: center;
}

.table th {
  width: 100vw;
  font-weight: bold;
}

@media (max-width: 820px) {
  .flight-table {
    overflow-x: scroll;
  }
}
</style>