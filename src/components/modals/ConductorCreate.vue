<template>
    <div @click="closeModal" class="modal-bg"></div>
    <div class="modal-content">
        <h2>Conductor</h2>
        <br>
        <form @submit.prevent="save()">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input required type="text" name="nombre" v-model="nombre">
            </div>
            <div class="form-group">
                <label for="rut">Rut</label>
                <input required type="text" name="rut" v-model="rut">
            </div>
            <div class="form-group">
                <label for="company_id">Empresa</label>
                <select @change="filterVehicles(empresa)" name="company_id" v-model="empresa">
                    <option value="">---</option>
                    <template v-if="companies">
                        <template v-for="(item, index) in companies" >
                            <option v-if="item.estado" :value="item.id">
                                {{ item.nombre }}
                            </option>
                        </template>
                    </template>
                </select>
            </div>
            <div class="form-group" v-if="empresa!=''">
                <label for="vehicle_id">Vehiculo</label>
                <select name="vehicle_id" v-model="vehiculo">
                    <option value="">---</option>
                    <option v-if="dataIn&&dataIn.vehicle" :value="dataIn.vehicle.id">
                        {{ dataIn.vehicle.patente }}
                    </option>
                    <template v-if="vehicles">
                        <template v-for="(item, index) in filterVeh" >
                            <option v-if="!item.driver" :value="item.id">
                                {{ item.patente }}
                            </option>
                        </template>
                    </template>
                </select>
            </div>
            <div class="form-group">
                <label for="smartcard_id">Tarjeta</label>
                <select name="smartcard_id" v-model="tarjeta">
                    <option value="">---</option>
                    <option v-if="dataIn&&dataIn.smartcard" :value="dataIn.smartcard.id">
                        {{ dataIn.smartcard.number }}
                    </option>
                    <template v-if="smartcards">
                        <template v-for="(item, index) in smartcards" >
                            <option v-if="!item.driver" :value="item.id">
                                {{ item.number }}
                            </option>
                        </template>
                    </template>
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
        vehicles: Object,
        smartcards: Object,
        companies: Object,
        dataIn: Object,
    },
    data() {
        return {
            filterVeh: [],
            saveid: 0,
            nombre: '',
            rut: '',
            vehiculo: '',
            tarjeta: '',
            empresa: '',
        }
    },
    mounted() {
        try{
            if(this.dataIn){
                this.saveid = this.dataIn.id;
                this.nombre = this.dataIn.nombre;
                this.rut = this.dataIn.rut;
                this.tarjeta = this.dataIn.smartcard_id ? this.dataIn.smartcard_id : '';
                this.empresa = this.dataIn.company_id ? this.dataIn.company_id : '';
                this.filterVehicles(this.dataIn.company_id);
                this.vehiculo = this.dataIn.vehicle_id ? this.dataIn.vehicle_id : '';
            }

        } catch(error) {
            console.error(error);
        }
    },
    methods: {
        filterVehicles(idIn) {
            this.filterVeh = this.vehicles.filter(function (item) {
                return item.company_id == idIn;
            });
            this.vehiculo = '';
        },
        //Desactiva el modal
        closeModal() {
            this.$parent.dispCreateModal = false;
        },
        async insert() {
            return await api.post('/conductores', {
                nombre: this.nombre,
                rut: this.rut,
                activo: true,
                vehicle_id: this.vehiculo,
                smartcard_id: this.tarjeta,
                company_id: this.empresa,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe este RUT!');
                    }
                } else {
                    console.error(error);
                }
            });
        },
        async update() {
            return await api.put(`/conductores/${this.saveid}`, {
                nombre: this.nombre,
                rut: this.rut,
                activo: true,
                vehicle_id: this.vehiculo,
                smartcard_id: this.tarjeta,
                company_id: this.empresa,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    switch(error.response.status){
                        case 422:
                            window.alert('Ya existe este RUT!');
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