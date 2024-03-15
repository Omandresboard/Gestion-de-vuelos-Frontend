<template>
  <body>
    <div class="login is-bordered">
      <h1>Login</h1>
      <!-- Formulario de inicio de sesión -->
      <form @submit.prevent="login" class="login-form">
        <input
          type="text"
          v-model="usuario.username"
          placeholder="Username"
          required
          class="input-field"
        />
        <input
          type="password"
          v-model="usuario.password"
          placeholder="Password"
          required
          class="input-field"
        />
        <br />
        <button type="submit" class="btn btn-primary w-100">
          Iniciar Sesion
        </button>
      </form>
    </div>
  </body>
  <router-view></router-view>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "LoginC",
  data() {
    return {
      usuario: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      axios
        .post(`http://localhost:3000/api/usuarios/autenticar`, this.usuario, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        
        .then((response) => {
          console.log(response)
          Swal.fire({
            title: "¡Autenticacion exitosa!",
            icon: "success",
          });
          localStorage.setItem("token", response.data.usuario.token);
          setTimeout(() => {
            window.location.href = "/home";
          }, 1000);
        })
        .catch((error) => {
          Swal.fire({
            title: "Error al Autenticar el usuario",
            text: error.response.data.msg,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    },
  },
};
</script>

<style scoped>
body {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  background-image: url(../assets/IMG/fondo_login.jpeg);
  background-repeat: no-repeat;
  background-size: cover;
}

.login {
  width: 35%;
  height: auto;
  margin: 20px;
  padding: 85px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  border-radius: 5px;
  background-color: #e5ecf4;
}

.login h1 {
  margin-bottom: 20px;
  font-weight: bolder;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-field {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

@media (max-width: 1520px) {
  .login-form {
    width: 93%;
  }

  .input-field {
    width: 100%;
  }
}

@media (max-width: 1200px) {
  .login {
    width: 50%;
  }
}

@media (max-width: 900px) {
  .login {
    width: 53%;
  }
}

@media (max-width: 800px) {
  .login {
    width: 58%;
  }
}

@media (max-width: 600px) {
  .login {
    width: 90%;
  }
}
</style>
