<template>
    <div class="content">
        <div class="viewContent">
            <h1>Mapa</h1>
            <br>
            <div class="map-cont">
                <div class="map-left">
                    <div class="content-group">
                        <div class="btn-strip">
                            <button class="btn-export" @click="toggleInactive()"><i :class="inactive?'inactive':''" class="fa fa-eye fa-fw"></i></button>
                        </div>
                    </div>
                    <div class="content-group">
                        <form v-on:submit.prevent="doSearch()" class="search-group">
                            <input ref="searchtext" class="search-input" type="text" v-model="query" placeholder="Buscar"/>
                            <button type="button" @click="query='';doSearch()" class="search-clear"><i class="fa fa-times fa-fw"></i></button>
                            <button type="submit" class="btn-export"><i class="fa fa-search fa-fw"></i>Buscar</button>
                        </form>
                    </div>
                    <div class="table-cont">
                        <table v-if="markers.length>0">
                            <thead>
                                <tr>
                                    <th>Patente</th>
                                    <th>Velocidad</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(item,index) in filteredMarkers" :key="index">
                                    <tr @click="goToMarker(item.id)" v-if="!inactive||item.movestatus!='parked'" :class="item.movestatus!=='parked'?'':'inactive'" class="click">
                                        <td>{{ item.patente }}</td>
                                        <td>{{ item.speed }}Km/h</td>
                                        <td>{{ item.movestatus }}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="map-right">
                    <div id="map"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toRaw } from "vue";
import { receivedMessages } from '@/WebSocket.js';

var stopIcon = L.divIcon({
    className: 'map-icon',
    html: '<i class="fa fa-fa-hand-paper-o fa-fw"></i>',
    iconSize: [20,20],
    iconAnchor: [10,10],
    popupAnchor: [0,-20],
});
var busIcon = L.divIcon({
    className: 'map-icon',
    html: '<i class="fa fa-bus fa-2x fa-fw"></i>',
    iconSize: [40,40],
    iconAnchor: [20,20],
    popupAnchor: [0,-40],
});
var disabledIcon = L.divIcon({
    className: 'map-icon-disabled',
    html: '<i class="fa fa-bus fa-2x fa-fw"></i>',
    iconSize: [40,40],
    iconAnchor: [20,20],
    popupAnchor: [0,-40],
});

export default {
    data() {
        return {
            map: null,
            buses: null,
            paradas: null,
            userHash: null,
            trackers: null,
            markers: [],
            filteredMarkers: [],
            inactive: false,
            query: '',
            loadScreen: false,
            latestMessage: null,
        }
    },
    mounted() {
        this.$root.loadScreen = true;
        this.fetchData();
        this.$watch(() => receivedMessages.value, (newMessages) => {
            if (newMessages.length > 0) {
                this.latestMessage = newMessages[newMessages.length - 1];
                if(this.markers.length>0){
                    this.updateMarkers(this.latestMessage);
                }
            }
        }, { deep: true });
        this.map = L.map('map').setView([-33.41265, -70.56614], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
    },
    methods: {
        // Actualiza los marcadores usando datos del WebSocket
        async updateMarkers(msg){
            if(msg.data){
                // Verificar que exista un marcador por ID
                var marker = this.markers.find(x => x.id == msg.data.source_id);

                // Si el marcador existe, actualizar sus datos
                if(marker){
                    var coords = [msg.data.gps.location.lat,msg.data.gps.location.lng];
                    marker.setLatLng(coords);
                    var icon = msg.data.movement_status==="parked"?disabledIcon:busIcon;

                    marker.setIcon(icon);
                    marker.movestatus = msg.data.movement_status;
                    marker.speed = msg.data.gps.speed;

                    marker.setPopupContent(
                        `<p style="text-align:center">${marker.patente}<br>${marker.speed}km/h</p>`
                    );
                }
            }
        },
        // Inicializa los marcadores
        async initMarkers(){
            if(this.$root.buses){
                this.$root.buses.forEach(item => {
                var coord = [item.lat,item.lng];

                var icon = item.movement_status==="parked"?disabledIcon:busIcon;

                // Agregamos el marcador
                // toRaw para evitar problemas de timing cuando leaflet intenta acceder a valores del componente
                var marker = L.marker(coord, {
                    icon: icon,
                    autoPan: false,
                    autoPanOnFocus: false
                }).addTo(toRaw(this.map));

                // Agregamos el popup
                marker.bindPopup(
                    `<p style="text-align:center">${item.patente}<br>${item.speed}km/h</p>`
                );

                // Guardamos datos extra en el marcador para evitar hacer consultas innecesarias
                marker.id = item.source_id;
                marker.vehid = item.id;
                marker.patente = item.patente;
                marker.speed = item.speed;
                marker.movestatus = item.movement_status;

                // Cuando el marcador se mueva, tambiem movemos el PopUp
                marker.on('move', function(event) {
                    var newLatLng = event.target.getLatLng();
                    marker.getPopup().setLatLng(newLatLng);
                });

                // Agregamos cada marcador a un array para poder seleccionarlos mas adelante
                this.markers.push(marker);
            });
            }
        },
        // Filtra la lista de marcadores al buscarlos
        doSearch(){
            this.filteredMarkers = this.markers.filter(x => x.patente.includes(this.query.toUpperCase()));
        },
        // Mueve las coordenadas del mapa para centrar en un marcador
        goToMarker(idIn){
            var marker = this.markers.find(x => x.id == idIn);
            if(marker){
                this.map.panTo(marker.getLatLng(), {animate: false});
                marker.openPopup();
            }
        },
        // Cambia el estado de inactive para esconder o mostrar los buses que estan en estado estacionado
        toggleInactive(){
            this.inactive = !this.inactive;
        },
        // Trae los datos desde el backend
        async fetchData(){
            this.userHash = await this.$root.getUserHash();
                this.initMarkers();
                this.filteredMarkers = this.markers;
                this.$root.loadScreen = false;
            /*this.$root.getParadas()
            .then(reply => {
                this.paradas = reply;
                this.addStopMarkers();
            });*/
        },
        addStopMarkers(){
            if(this.paradas){
                this.paradas.forEach(item => {
                    var coord = [item.latitud,item.longitud];

                    var marker = L.marker(coord, {
                        icon: stopIcon,
                        autoPan: false,
                        autoPanOnFocus: false
                    }).addTo(this.map);

                    marker.bindPopup(
                        `<p style="text-align:center">${item.direccion}</p>`
                    );
                });
            }
        },
    },
}
</script>

<style scoped>
.viewContent {
  width: 1500px;
  margin: auto;
}

table {
    width: 96%;
}

table tr th:hover {
    text-decoration: none;
    cursor: unset;
}

.click {
    text-decoration: underline;
    cursor: pointer;
}

.click:hover {
    text-decoration: underline;
    background-color: var(--sidebar-bg-color);
    cursor: pointer;
}

#map {
  height: 100%;
  width: 100%;
}

.map-cont {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
}

.map-left {
    flex: 0 0 25%;
}

.table-cont {
    height: 584px;
    max-height: 584px;
    overflow-y: auto;
}

.map-right {
    flex: 0 0 74%;
    height: calc(100vh - 240px);
}

@media (max-width: 1280px) {
    .table-cont {
        height: 389px;
        max-height: 389px;
    }
}
</style>