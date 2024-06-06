<template>
    <div class="content">
        <div class="viewcontent">
            <div class="informark">
               <i class="fa fa-calendar-check-o fa-fw"></i> Control de Jornada
            </div>
            <div class="modal-content">
                <h2>Iniciar Sesion</h2>
                <br>
                <form ref="formLogin" @submit.prevent="login()">
                    <div class="form-group">
                        <label for="email"><i class="fa fa-user fa-fw"></i></label>
                        <input type="email" id="email" placeholder="Correo" v-model="credentials.email" required>
                    </div>
                    <div class="form-group">
                        <label for="pass"><i class="fa fa-asterisk fa-fw"></i></label>
                        <input type="password" id="password" v-model="credentials.password" placeholder="Contraseña" required>
                    </div>
                    <br>
                    <div class="form-group">
                        <button class="btn-gradient">Iniciar Sesion</button>
                    </div>
                </form>
                <div class="form-group">
                    <a @click="recoverPass()">Recuperar Contraseña</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
import api from '@/api';

export default {
    data() {
        return {
            credentials: {
                email: '',
                password: '',
            },
        };
    },
    methods: {
        login() {
            this.$root.loadScreen = true;
            // Hacemos post a api/login con correo y contraseña
            api.post('/login', this.credentials)
                .then(response => {
                    // Obtenemos el token y nivel de acceso del usuario
                    const { token, level, name } = response.data;
                    // Los que se guardan en un store de Pinia
                    useAuthStore().setTokenAndAccessLevel(token, level, name);

                    // Activamos el navbar y navegamos al dashboard
                    this.$root.navEnable = true;
                    this.$router.push('/');
                })
                .catch(error => {
                    this.$root.loadScreen = false;
                    if(error.response){
                        if(error.response){
                        window.alert(error.response.data.message);
                        }
                    }
                });
        },
        recoverPass() {
            this.$router.push('/recover');
        }
    },
};
</script>

<style scoped>
a {
    color: var(--text-color);
    cursor: pointer;
}

a:hover {
    font-weight: bold;
    text-decoration: underline;
}
</style>