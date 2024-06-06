<template>
    <div @click="closeModal" class="modal-bg"></div>
    <div class="modal-content">
        <h2>Usuario</h2>
        <br>
        <form @submit.prevent="save()">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input required type="text" name="nombre" v-model="nombre">
            </div>
            <div class="form-group">
                <label for="email">Correo</label>
                <input required type="email" name="email" v-model="email">
            </div>
            <div v-if="!dataIn" class="form-group">
                <label for="pass">Pass</label>
                <input required type="password" name="pass" v-model="password">
            </div>
            <div class="form-group">
                <label for="level">Nivel</label>
                <select required name="level" v-model="level">
                    <option value="1">Usuario</option>
                    <option value="5">Supervisor</option>
                    <option value="10">Administrador</option>
                </select>
            </div>
            <div class="form-group">
                <button class="btn-gradient">Guardar</button>
            </div>
        </form>
    </div>
</template>

<script>
import api from '@/api'
export default {
    props: {
        dataIn: Object,
    },
    data() {
        return {
            saveid: 0,
            nombre: '',
            email: '',
            password: '',
            level: 1,
        }
    },
    mounted() {
        try{
            if(this.dataIn){
                this.saveid = this.dataIn.id;
                this.nombre = this.dataIn.name;
                this.email = this.dataIn.email;
                this.level = this.dataIn.level;
            }

        } catch(error) {
            console.error(error);
        }
    },
    methods: {
        //Desactiva el modal
        closeModal() {
            this.$parent.dispCreateModal = false;
        },
        async insert() {
            return await api.post('/users', {
                name: this.nombre,
                email: this.email,
                password: this.password,
                level: this.level,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe este Usuario!');
                    }
                } else {
                    console.error(error);
                }
            });
        },
        async update() {
            return await api.put(`/users/${this.saveid}`, {
                name: this.nombre,
                email: this.email,
                level: this.level,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe este Usuario!');
                            break;
                    }
                } else {
                    console.error(error);
                }
            });
        },
        async save() {
            this.$root.loadScreen = true;
            if(this.saveid>0){
                this.update()
                .then(reply => {
                    if(reply){
                        this.$root.loadScreen = false;
                        this.closeModal();
                        this.$parent.fetchData();
                    }
                })
            } else {
                this.insert()
                .then(reply => {
                    if(reply){
                        this.$root.loadScreen = false;
                        this.closeModal();
                        this.$parent.insertData(reply.data.user);
                    }
                })
            }
        },
    }
}
</script>