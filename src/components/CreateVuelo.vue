<template>
  <div class="vuelos" ref="CreateVuelo">
    <h2>Crear Vuelo - Formulario de Registro</h2>
    <router-link to="/home" class="btn btn-secondary">Volver</router-link>

    <form @submit.prevent="registrar">
      <div class="content">
        <div class="inputs"></div>

        <div class="inputs">
          <label for="airline">Aerolínea:</label>
          <select
            v-model="newFlight.codaerolinea"
            class="form-select"
            id="airline"
          >
            <option value="" disabled>Selecciona una aerolínea</option>
            <option
              v-for="airline in airlines"
              :key="airline.id"
              :value="airline.id"
            >
              {{ airline.name }}
            </option>
          </select>
        </div>

        <div class="inputs">
          <label for="sala">Sala de Abordaje:</label>
          <select
            v-model="newFlight.salaabordaje"
            class="form-select"
            id="sala"
          >
            <option value="" disabled>Selecciona una sala</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="A3">A3</option>
            <option value="A4">A4</option>
          </select>
        </div>

        <div class="inputs">
          <label for="destination">Destino:</label>
          <select
            v-model="newFlight.coddestino"
            class="form-select"
            id="destination"
          >
            <option value="" disabled>Selecciona un destino</option>
            <option
              v-for="destination in destinations"
              :key="destination.id"
              :value="destination.id"
            >
              {{ destination.name }}
            </option>
          </select>
        </div>

        <div class="inputs">
          <label for="departure">Hora de Salida:</label>
          <input
            v-model="newFlight.horasalida"
            type="time"
            class="form-control"
            id="departure"
          />
        </div>

        <div class="inputs">
          <label for="arrival">Hora de Llegada:</label>
          <input
            v-model="newFlight.horallegada"
            type="time"
            class="form-control"
            id="arrival"
          />
        </div>
      </div>

      <button class="btn btn-primary w-100" type="submit">Registrar</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      newFlight: {
        codvuelo: "",
        coddestino: "",
        codaerolinea: "",
        salaabordaje: "",
        horasalida: "",
        horallegada: "",
      },
      destinations: [
        { id: "1", name: "Armenia" },
        { id: "2", name: "Barranquilla" },
        { id: "3", name: "Cali" },
        { id: "4", name: "Cartagena" },
        { id: "5", name: "Medellin" },
        { id: "6", name: "Santa Martha" },
        { id: "7", name: "San Andres Isla" },
      ],
      airlines: [
        { id: "1", name: "Avianca" },
        { id: "2", name: "SATENA" },
        { id: "3", name: "Wingo" },
        { id: "4", name: "LATAM" },
        { id: "5", name: "Ultra Air" },
        { id: "6", name: "EASYFLY" },
      ],
    };
  },
  methods: {
    generateFlightCode() {
      const numbers = "0123456789";
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let code = "";

      for (let i = 0; i < 3; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
        code += letters.charAt(Math.floor(Math.random() * letters.length));
      }

      this.newFlight.codvuelo = code;
    },
    async registrar() {
      if (
        !this.newFlight.codvuelo ||
        !this.newFlight.coddestino ||
        !this.newFlight.codaerolinea ||
        !this.newFlight.salaabordaje ||
        !this.newFlight.horasalida ||
        !this.newFlight.horallegada
      ) {
        // Mostrar alerta si hay campos vacíos
        Swal.fire({
          title: "Todos los Campos son obligatorios",
          text: "Por favor completa todos los campos antes de registrar el vuelo.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return; // Detener el proceso de registro si hay campos vacíos
      }

      if (!this.newFlight.codvuelo) {
        this.generateFlightCode(); // Generar el código si está vacío
        console.log(this.newFlight.codvuelo);
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/vuelos",
          this.newFlight,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // let codigoGenerado = "";

        if (response.status === 200) {
          Swal.fire({
            title: "¡Registro exitoso!",
            text: `El vuelo se ha registrado correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          this.newFlight = {}
        }
        console.log(response.data); // Manejo de la respuesta del servidor
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error al registrar el vuelo",
          text: error.response.data.msg,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  },
  created() {
    try {
      this.generateFlightCode();
    } catch (error) {
      console.error("Error al generar el código de vuelo:", error);
    }
  },
  mounted() {
    console.log(this.$refs.CreateVuelo);
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
  margin: 90px 0px 10px 0px;
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

/* BOTON DEL GENERADOR DE CODIGO */

.input-with-button {
  position: relative;
}

.input-with-button input {
  padding-right: 40px;
  /* Espacio para el botón dentro del input */
}

.input-with-button button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
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

  .input-with-button button {
    position: relative;
    margin-top: 15px;
  }

  .btn {
    width: 100%;
  }
}
</style>