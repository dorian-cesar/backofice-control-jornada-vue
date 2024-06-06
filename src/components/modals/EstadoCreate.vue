<template>
    <div @click="closeModal" class="modal-bg"></div>
    <div class="modal-content">
        <h2>Estado</h2>
        <br>
        <form @submit.prevent="save()">
            <div class="form-group">
                <label for="estado">Estado</label>
                <input required type="text" name="estado" v-model="instring">
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
            instring: '',
        }
    },
    mounted() {
        try{
            if(this.dataIn){
                this.saveid = this.dataIn.id;
                this.instring = this.dataIn.estado;
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
            return await api.post('/estadovehiculos', {
                estado: this.instring,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe este Estado!');
                    }
                } else {
                    console.error(error);
                }
            });
        },
        async update() {
            return await api.put(`/estadovehiculos/${this.saveid}`, {
                estado: this.instring,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe este Estado!');
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
                        this.$parent.refresh();
                    }
                })
            } else {
                this.insert()
                .then(reply => {
                    if(reply){
                        this.$root.loadScreen = false;
                        this.closeModal();
                        this.$parent.refresh();
                    }
                })
            }
        },
    }
}
</script>