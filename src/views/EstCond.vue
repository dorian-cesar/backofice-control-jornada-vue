<template>
    <div class="content">
        <div class="viewContent">
            <h1>Infracciones de Velocidad</h1>
            <LogsTable :tdata="logs.data"/>
            <div style="float:left" v-if="this.logs.data" class="content-group">
                <p>Última actualización: {{ this.logs.data[0].latest_updated_at }}</p>
            </div>
            <PaginationStrip :routeName="'logs'" :links="filteredLinks()"/>
        </div>
    </div>
</template>

<script>
import LogsTable from '@/components/tables/LogsTable.vue'
import PaginationStrip from '@/components/PaginationStrip.vue'
import router from '@/router/index'
import api from '@/api';
import { receivedMessages } from '@/WebSocket.js';

export default {
    components: {
        LogsTable,
        PaginationStrip,
    },
    data() {
        return {
            logs: [],
            buses: null,
            trackers: null,
            userHash: null,
            latestMessage: null,
        }
    },
    mounted() {
        this.refresh();
        this.fetchData()
        .then(() => {
            this.$root.loadScreen = false;
        });
        this.$watch(() => receivedMessages.value, (newMessages) => {
            if (newMessages.length > 0) {
                this.latestMessage = newMessages[newMessages.length - 1];
                if(this.buses){
                    //console.log(this.latestMessage);
                    this.updateTable(this.latestMessage);
                }
            }
        }, { deep: true });
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/logs`, {
                params: {
                page: to.params.page,
                searchqry: to.params.query,
                sort: to.params.sort ? {
                    col: to.params.sort,
                    dir: to.params.dir,
                } : '',
            }
        })
        .then(data => {
            this.logs = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        // Actualiza la tabla usando datos del WebSocket
        async updateTable(msg){
            if(msg.data){
                let speed = msg.data.gps.speed;

                var bus = this.buses.find(x => x.source_id == msg.data.source_id);

                if(speed>45){
                    var logData = {
                        id: bus.id,
                        lat: msg.data.gps.location.lat,
                        lng: msg.data.gps.location.lng,
                        ignicion: false, // No se trae por WS
                        velocidad: speed,
                        direccion: msg.data.gps.heading,
                        estado: msg.data.movement_status,
                        conexion: msg.data.connection_status,
                    }

                    this.$root.logVehicle(logData)
                    .then(() => {
                        this.refresh();
                    });

                    this.$root.alertUI();
                }
            }
        },
        // Trae los datos desde el WebSocket
        async fetchData() {
            this.userHash = await this.$root.getUserHash();
            this.buses = await this.$root.getBuses();
        },
        // Cambia la ventana hacia la pagina de detalles
        viewDetails(idIn){
            router.push({name: 'logsdtl', params: { id: idIn, page: 1, sort: 'created_at', dir: 'desc'}});
        },
        // Funcion para filtrar la paginacion generada por Laravel
        filteredLinks() {
            return this.logs.links ? this.logs.links.filter(item => item.url !== null) : '';
        },
        // Funcion para gestionar el ordenamiento de la tabla
        sortBy(key){
            var direct = 'asc';
            if(this.$route.params.sort == key){
                if(this.$route.params.dir=='asc'){
                    direct = 'desc';
                } else {
                    direct = 'asc';
                }
            }
            router.push({name: 'logs', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
            //this.refresh();
        },
        // Trae los datos iniciales
        async refresh() {
            this.$root.getApiData('logs',true)
            .then(data => {
                this.logs = data;
            });
        }
    }
}
</script>