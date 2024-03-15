<template>
  <div class="vuelos">
    <h2>Actualizar Vuelo - Formulario de Edición</h2>
    <router-link to="/home" class="btn btn-secondary">Volver</router-link>
    <form @submit.prevent="actualizarVuelo">
      <div class="content">
        <div class="inputs">
          <label for="codigoVuelo">Código de vuelo:</label>
          <input type="text" class="form-control" :value="codvuelo" disabled />
        </div>

        <div class="inputs">
          <label for="aerolinea">Aerolínea:</label>
          <input
            type="text"
            class="form-control"
            :value="codaerolinea"
            disabled
          />
        </div>

        <div class="inputs">
          <label for="sala">Sala de Abordaje</label>
          <input
            type="text"
            class="form-control"
            :value="salaabordaje"
            disabled
          />
        </div>

        <div class="inputs">
          <label for="destino">Destino:</label>
          <input
            type="text"
            class="form-control"
            :value="coddestino"
            disabled
          />
        </div>

        <div class="inputs">
          <label for="horaSalida">Hora de Salida:</label>
          <input type="time" class="form-control" :value="horasalida" />
        </div>

        <div class="inputs">
          <label for="horaLlegada">Hora de Llegada:</label>
          <input type="time" class="form-control" :value="horallegada" />
        </div>
      </div>
      <button class="btn btn-primary w-100" type="submit">Actualizar</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      codvuelo: "",
      codaerolinea: "",
      salaabordaje: "",
      coddestino: "",
      horasalida: "",
      horallegada: "",
    };
  },
  created() {
    this.obtenerDatosVuelo();
  },
  methods: {
    async obtenerDatosVuelo() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/vuelos/${this.$route.params.id}`
        );
        this.codvuelo = response.data.codvuelo;
        this.codaerolinea = response.data.aerolinea_desc;
        this.salaabordaje = response.data.salaabordaje;
        this.coddestino = response.data.destino_desc;
        this.horasalida = response.data.horasalida;
        this.horallegada = response.data.horallegada;

        console.log("Datos del vuelo:", response.data); // Verificar datos obtenidos
      } catch (error) {
        console.error("Error al obtener los datos del vuelo:", error);
      }
    },
    async actualizarVuelo() {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/vuelos/${this.$route.params.id}`,
          {
            horasalida: this.horasalida,
            horallegada: this.horallegada,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "¡Actualización exitosa!",
            text: "El vuelo se ha actualizado correctamente.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        console.log(response.data); // Manejo de la respuesta del servidor
      } catch (error) {
        Swal.fire({
          title: "Error al actualizar el vuelo",
          text: "Hubo un problema al actualizar el vuelo.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error al actualizar el vuelo:", error);
      }
    },
  },
  mounted() {
    this.obtenerDatosVuelo();
  },
};
</script>

<style scoped>
.vuelos {
  width: 100%;
  padding: 20px 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.vuelos h2 {
  text-decoration: underline #000000;
}

.btn {
  width: 100px;
  font-weight: bolder;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 90px 20px 10px 20px;
}

.content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 90px;
  width: 30%;
  gap: 5px;
}

@media (max-width: 750px) {
  .vuelos {
    text-align: center;
    justify-content: center;
    gap: 10px;
  }
  .inputs {
    width: 100%;
  }
  .btn {
    width: 100%;
  }
}
</style>
