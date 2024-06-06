<template>
    <div class="content">
        <div class="viewcontent">
            <div class="informark">
               <i class="fa fa-calendar-check-o fa-fw"></i> Control de Jornada
            </div>
            <div class="modal-content">
                <h2>Cambiar Contraseña</h2>
                <br>
                <form ref="formLogin" @submit.prevent="resetPass()">
                    <p>Contraseña actual</p>
                    <div class="form-group">
                        <label for="password"><i class="fa fa-asterisk fa-fw"></i></label>
                        <input type="password" id="password" v-model="credentials.password" placeholder="Contraseña" required>
                    </div>
                        <p>Repita su nueva contraseña</p>
                    <div class="form-group">
                        <label for="password_confirmation"><i class="fa fa-asterisk fa-fw"></i></label>
                        <input type="password" id="password_confirmation" v-model="credentials.password_confirmation" placeholder="Contraseña" required>
                    </div>
                    <br>
                    <div class="form-group">
                        <button class="btn-gradient">Aceptar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            credentials: {
                token: '',
                email: '',
                password: '',
                password_confirmation: '',
            },
        };
    },
    methods: {
        resetPass() {
            this.credentials.token = this.$route.params.token;
            api.post('/password/reset', this.credentials)
                .then(response => {
                    window.alert('Se ha cambiado la contraseña.');
                    this.$router.push('/login');
                })
                .catch(error => {
                    if(error.response){
                    window.alert(error.response.data.message);
                    }
                });
        }
    },
};
</script>

<style scoped>
p {
    display: block;
    margin: auto;
    text-align: center;
    color: var(--text-color);
}
a {
    color: var(--text-color);
    cursor: pointer;
}

a:hover {
    font-weight: bold;
    text-decoration: underline;
}

.informark {
    position: fixed;
    width: max-content;
    left: 10px;
    top: 10px;
    color: var(--text-color);
    font-weight: bold;
    border-radius: 5px;
    padding: 0.2rem;
    font-size: 2rem;
    z-index: 5000;
}
</style>