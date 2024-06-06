<template>
    <div class="content">
        <div class="viewcontent">
            <div class="informark">
               <i class="fa fa-calendar-check-o fa-fw"></i> Control de Jornada
            </div>
            <div class="modal-content">
                <h2>Recuperar Pass</h2>
                <br>
                <form ref="formRec" @submit.prevent="recoverPass()">
                    <div class="form-group">
                        <label for="email"><i class="fa fa-user fa-fw"></i></label>
                        <input type="email" id="email" placeholder="Correo" v-model="email" required>
                    </div>
                    <br>
                    <div class="form-group">
                        <button ref="formBtn" class="btn-gradient">Recuperar</button>
                    </div>
                </form>
                <div class="form-group">
                    <a @click="$router.push('/login')">Volver</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            email: '',
        };
    },
    methods: {
        recoverPass() {
            this.$root.loadScreen = true;
            api.post('/password/email', {
                email: this.email,
                url: window.location.origin,
            })
            .then(response => {
                window.alert('Se ha enviado un correo de recuperación.');
                this.$router.push('/login');
                this.$root.loadScreen = false;
            })
            .catch(error => {
                if(error.response){
                window.alert(error.response.data.message);
                }
                this.$root.loadScreen = false;
            });
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

.modal-bg {
    z-index: 1001;
}
</style>