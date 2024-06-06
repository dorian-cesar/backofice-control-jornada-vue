<template>
    <div class="content">
        <div class="viewContent">
            <h1>Mapa Interactivo</h1>
            <br>
            <div class="map-cont">
                <div class="map-left">
                    <div class="content-group">
                        <div class="btn-strip">
                            <button v-if="items.length!=0" class="btn-export" @click="updateMap()">Recargar</button>
                            <button class="btn-export" @click="toggleInactive()"><i :class="inactive?'inactive':''" class="fa fa-eye fa-fw"></i></button>
                        </div>
                        <p v-if="items.length==0&&!loadScreen">Error cargando los datos.</p>
                    </div>
                    <table v-if="items.length!=0">
                        <thead>
                            <tr>
                                <th>Patente</th>
                                <th>Coordenada</th>
                                <th>Velocidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(item, index) in items" :key="index">
                            <tr v-if="!inactive||item.connection_status=='active'" :class="item.connection_status=='active'?'':'inactive'" @click="jumpTo(item.id)">
                                <td class="click">{{ item.patente }}</td>
                                <td class="click">{{ item.lat }}, {{ item.lng }}</td>
                                <td class="click">{{ item.speed }}Km/h</td>
                            </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="notice">
                        <i class="fa fa-exclamation-triangle fa-fw"></i>
                        Este mapa solo debe mostrar el vehiculo seleccionado, con una opción para actualizar automaticamente.
                    </div>
                </div>
                <div class="map-right">
                    <div id="map"></div>
                </div>
            </div>
            <LoadingScreen v-if="$root.loadScreen"/>
        </div>
    </div>
  </template>

<script>
import LoadingScreen from '@/components/LoadingScreen.vue'

export default {
    components: {
        LoadingScreen,
    },
    data() {
        return {
            map: null,
            items: [],
            markers: [],
            loadScreen: false,
            inactive: false,
        }
    },
    mounted() {
        this.map = L.map('map').setView([-33.41265, -70.56614], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.initMap();
        //setInterval(this.updateMap, 10000);
    },
    methods: {
        toggleInactive(){
            this.inactive = !this.inactive;
        },
        async updateMap(){
            this.$root.loadScreen = true;
            this.$root.getVehiculos()
            .then(reply => {
                if(reply.data&&reply.status==200){
                this.items = reply.data;

                reply.data.forEach(item => {
                    var marker = this.markers.find(x => x.id === item.id);
                    if(marker!=null){
                        marker.setLatLng([item.lat,item.lng]);
                        marker.setPopupContent(`<p style="text-align:center"><b>${item.patente}</b><br>${item.lat}, ${item.lng}<br>${item.speed}km/h</p>`);
                    }
                    this.$root.loadScreen = false;
                });
                }
            })
            .catch(error => {
                console.log(error);
                this.$root.loadScreen = false;
            });
        },
        async initMap(){
            this.$root.loadScreen = true;

            var busIcon = L.divIcon({
                className: 'map-icon',
                html: '<i class="fa fa-bus fa-2x fa-fw"></i>',
                iconSize: [40,40],
                iconAnchor: [20,20],
                popupAnchor: [0,-40],
            })
            var disabledIcon = L.divIcon({
                className: 'map-icon-disabled',
                html: '<i class="fa fa-bus fa-2x fa-fw"></i>',
                iconSize: [40,40],
                iconAnchor: [20,20],
                popupAnchor: [0,-40],
            })

            this.$root.getVehiculos()
            .then(reply => {
                if(reply.data){
                this.items = reply.data;
                reply.data.forEach(item => {
                        var latitude = item.lat;
                        var longitude = item.lng;

                        if(item.connection_status=="active"){
                            var marker = L.marker([latitude, longitude],{icon: busIcon, autoPan: false, autoPanOnFocus: false}).addTo(this.map);
                        } else {
                            var marker = L.marker([latitude, longitude],{icon: disabledIcon, autoPan: false, autoPanOnFocus: false}).addTo(this.map);
                        }
                            
                        marker.bindPopup(`<p style="text-align:center"><b>${item.patente}</b><br>${latitude}, ${longitude}<br>${item.speed}km/h</p>`);

                        marker.id = item.id;

                        this.markers.push(marker);
                });
                }
                this.$root.loadScreen = false;
            })
            .catch(error => {
                console.error(error);
                this.$root.loadScreen = false;
            });
        },
        jumpTo(id){
            this.markers.forEach(marker => {
            if (marker.id === id) {
                this.map.panTo(marker.getLatLng(), {animate: false});
                marker.openPopup();
            }});
        },
    }
}
</script>

<style scoped>
.notice {
    border: 1px solid orange;
    background-color: rgb(255, 198, 41);
    padding: 1rem;
    color: black;
    text-align: justify;
}
table {
    max-height: 100%;
    overflow-y: auto;
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
    background-color: var(--navbar-bg-color);
    cursor: pointer;
}

#map {
  height: 100%;
}

.map-cont {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
}

.map-left {
    flex: 0 0 30%;
}

.map-right {
    flex: 0 0 68%;
    height: calc(100vh - 200px);
}
</style>