<template>
    <div @click="closeModal" class="modal-bg"></div>
    <div class="modal-content">
        <h2>Vehiculo</h2>
        <br>
        <form @submit.prevent="save()">
            <div class="form-group">
                <label for="patente">Patente</label>
                <input required type="text" name="patente" v-model="patente">
            </div>
            <div class="form-group">
                <label for="track_id">ID Track</label>
                <input required type="number" name="track_id" v-model="track_id">
            </div>
            <div class="form-group">
                <label for="vehicle_type_id">Tipo</label>
                <select required name="vehicle_type_id" v-model="tipo">
                    <option value="" disabled selected>Seleccionar</option>
                    <template v-if="types">
                        <option v-for="(item, index) in types" :value="item.id">{{ item.tipo }}</option>
                    </template>
                </select>
            </div>
            <div class="form-group">
                <label for="company_id">Empresa</label>
                <select required name="company_id" v-model="empresa">
                    <option value="" disabled selected>Seleccionar</option>
                    <template v-if="empresas">
                        <option v-for="(item, index) in empresas" :value="item.id">{{ item.nombre }}</option>
                    </template>
                </select>
            </div>
            <div class="form-group">
                <label for="imei">IMEI</label>
                <input required type="text" name="imei" v-model="imei">
            </div>
            <div class="form-group">
                <button class="btn-gradient">Guardar</button>
            </div>
        </form>
    </div>
</template>

<script>
import api from '@/api';
export default {
    props: {
        dataIn: Object,
        types: Object,
        states: Object,
        devices: Object,
        empresas: Object,
    },
    data() {
        return {
            saveid: 0,
            track_id: 0,
            patente: '',
            tipo: '',
            imei: '',
            empresa: '',
        }
    },
    mounted() {
        try{
            if(this.dataIn){
                this.saveid = this.dataIn.id;
                this.track_id = this.dataIn.track_id;
                this.patente = this.dataIn.patente;
                this.empresa = this.dataIn.company_id;
                this.tipo = this.dataIn.vehicle_type_id ? this.dataIn.vehicle_type_id : '';
                this.imei = this.dataIn.imei ? this.dataIn.imei : '';
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
            return await api.post('/vehiculos', {
                patente: this.patente,
                vehicle_type_id: this.tipo,
                imei: this.imei,
                track_id: this.track_id,
                company_id: this.empresa,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe esta Patente!');
                    }
                } else {
                    console.error(error);
                }
            });
        },
        async update() {
            return await api.put(`/vehiculos/${this.saveid}`, {
                patente: this.patente,
                vehicle_type_id: this.tipo,
                imei: this.imei,
                track_id: this.track_id,
                company_id: this.empresa,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe esta Patente!');
                    }
                } else {
                    console.error(error);
                }
            });
        },
        async save() {
            this.$root.loadScreen = true;
            try {
            if(this.saveid>0){
                this.update()
                .then(reply => {
                    if(reply){
                        this.$root.loadScreen = false;
                        this.closeModal();
                        this.$parent.refresh();
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$root.loadScreen = false;
                });
            } else {
                this.insert()
                .then(reply => {
                    if(reply){
                        this.$root.loadScreen = false;
                        this.closeModal();
                        this.$parent.refresh();
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$root.loadScreen = false;
                });
            }
            } catch(error) {
                console.error(error);
                this.$root.loadScreen = false;
            }
        },
    }
}
</script>