<template>
    <div @click="closeModal" class="modal-bg"></div>
    <div class="modal-content">
        <h2>Evento de Jornada</h2>
        <br>
        <form @submit.prevent="save()">
            <div class="form-group">
                <label for="evento">Evento</label>
                <select name="evento" v-model="evento">
                    <option value="Inicio de Jornada">Inicio de Jornada</option>
                    <option value="Inicio de Conduccion">Inicio de Conduccion</option>
                    <option value="Fin de Conduccion">Fin de Conduccion</option>
                    <option value="Fin de Jornada">Fin de Jornada</option>
                </select>
            </div>
            <div class="form-group">
                <label for="driver_id">Conductor</label>
                <select name="driver_id" v-model="driver">
                    <template v-if="drivers">
                        <template v-for="(item, index) in drivers" >
                            <option :value="item.id">
                                {{ item.nombre }}
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
        drivers: Object,
    },
    data() {
        return {
            evento: 'Inicio de Jornada',
            driver: 1,
        }
    },
    methods: {
        //Desactiva el modal
        closeModal() {
            this.$parent.dispCreateModal = false;
        },
        async insert() {
            return await api.post('/historial', {
                event: this.evento,
                driver_id: this.driver,
            })
            .then(reply => {
                return reply;
            })
            .catch(function (error) {
                if(error.response){
                    console.error(error);
                }
            });
        },
        async save() {
            this.$root.loadScreen = true;
            this.insert()
            .then(reply => {
                if(reply){
                    this.$root.loadScreen = false;
                    this.closeModal();
                    this.$parent.refresh();
                }
            });
        },
    }
}
</script>