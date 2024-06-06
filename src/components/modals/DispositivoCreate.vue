<template>
    <div @click="closeModal" class="modal-bg"></div>
    <div class="modal-content">
        <h2>Dispositivo</h2>
        <br>
        <form @submit.prevent="save()">
            <div class="form-group">
                <label for="sim">SIM</label>
                <input required type="text" name="sim" v-model="sim">
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
            sim: '',
        }
    },
    mounted() {
        try{
            if(this.dataIn){
                this.saveid = this.dataIn.id;
                this.sim = this.dataIn.sim;
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
            return await api.post('/dispositivos', {
                sim: this.sim,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe esta SIM!');
                    }
                } else {
                    console.error(error);
                }
            });
        },
        async update() {
            return await api.put(`/dispositivos/${this.saveid}`, {
                sim: this.sim,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe esta SIM!');
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