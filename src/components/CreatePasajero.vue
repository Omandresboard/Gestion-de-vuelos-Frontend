<template>
  <div class="vuelos" ref="CreateVuelo">
    <h2>Crear Pasajero - Formulario de Registro</h2>
    <router-link to="/home" class="btn btn-secondary">Volver</router-link>

    <form @submit.prevent="registrar">
      <div class="content">
        <div class="inputs">
          <label for="">Identificacion</label>
          <input
            v-model="newPassenger.identificacion"
            type="text"
            class="form-control"
          />
        </div>

        <div class="inputs">
          <label for="sala">Nombre:</label>
          <input
            v-model="newPassenger.nombres"
            type="text"
            class="form-control"
          />
        </div>

        <div class="inputs">
          <label for="destination">Apellidos:</label>
          <input
            v-model="newPassenger.apellidos"
            type=""
            class="form-control"
          />
        </div>

        <div class="inputs">
          <label for="departure">Email:</label>
          <input
            v-model="newPassenger.email"
            type="email"
            class="form-control"
          />
        </div>

        <div class="inputs">
          <label for="arrival">Telefono:</label>
          <input
            v-model="newPassenger.telefono"
            type="tel"
            class="form-control"
          />
        </div>

        <div class="inputs">
          <label for="airline">Vuelos:</label>
          <select
            v-model="newPassenger.codvuelo"
            class="form-select"
            id="airline"
          >
            <option value="" disabled>Selecciona un Vuelo</option>
            <option
              v-for="vuelo in vuelos"
              :key="vuelo.codvuelo"
              :value="vuelo.codvuelo"
            >
              {{ vuelo.destino_desc }}
            </option>
          </select>
        </div>

        <div class="inputs">
          <label for="">Foto del Pasajero:</label>
          <input @change="handleFileChange" type="file" class="form-control" />
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
      vuelos: [],
      newPassenger: {
        codvuelo: "",
        identificacion: "",
        nombres: "",
        apellidos: "",
        email: "",
        telefono: "",
        foto: null
      },
    };
  },
  methods: {
    handleFileChange(event) {
      // Accede al archivo seleccionado
      this.newPassenger.foto = event.target.files[0];
      // Realiza acciones con el archivo si es necesario
      // Por ejemplo, puedes mostrar información sobre el archivo seleccionado
      console.log('Archivo seleccionado:', this.selectedFile);
    },
    obtenerVuelos() {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/api/vuelos", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log(response);
      this.vuelos = response.data;
    })
    .catch((error) => {
      console.error("Error al obtener los vuelos:", error);
    });
},


    async registrar() {
      console.log(this.newPassenger);
      if (
        Object.values(this.newPassenger).every((value) => value == "") ||
        this.newPassenger.codvuelo == ""
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

      try {
        const response = await axios.post(
        `http://localhost:3000/api/pasajeros/${this.newPassenger.codvuelo}`,
          this.newPassenger,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // let codigoGenerado = "";

        if (response.status === 200) {
          Swal.fire({
            title: "¡Registro exitoso!",
            text: `El pasajero se ha registrado correctamente.`,
            icon: "success",
            confirmButtonText: "OK",
          });
        this.newPassenger = {}
        }
        console.log(response.data);
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
  mounted() {
    this.obtenerVuelos();
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
    /* background-color: rgb(44, 44, 255); */
  }
}
</style>
