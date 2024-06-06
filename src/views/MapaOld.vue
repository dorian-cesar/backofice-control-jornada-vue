<template>
    <div class="content">
        <div class="viewContent">
            <h1>Mapa</h1>
            <br>
            <div class="map-cont">
                <div class="map-left">
                    <div class="content-group">
                        <div class="btn-strip">
                            <button v-if="items.length!=0" class="btn-export" @click="updateMap()">Actualizar</button>
                            <button class="btn-export" @click="toggleInactive()"><i :class="inactive?'inactive':''" class="fa fa-eye fa-fw"></i></button>
                        </div>
                        <p v-if="items.length==0&&!loadScreen">Error cargando los datos.</p>
                    </div>
                    <div v-if="items.length!=0" class="content-group">
                        <p>Última actualización: {{ items[0].latest_updated_at }}</p>
                    </div>
                    <table v-if="items.length!=0">
                        <thead>
                            <tr>
                                <th>Patente</th>
                                <th>Velocidad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(item, index) in items" :key="index">
                            <tr v-if="!inactive||item.estado!='parked'" :class="item.estado!='parked'?'':'inactive'" @click="jumpTo(item.vehicle_id)">
                                <td class="click">{{ item.vehicle.patente }}</td>
                                <td class="click" :style="item.velocidad>45?'background-color:gray':''"><i v-if="item.velocidad>45" class="fa fa-exclamation-triangle fa-fw"></i>{{ item.velocidad }}Km/h</td>
                                <td class="click">{{ item.estado }}</td>
                            </tr>
                            </template>
                        </tbody>
                    </table>
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
            userHash: '',
            trackers: [],
        }
    },
    async mounted() {
        this.userHash = await this.$root.getUserHash();
        this.map = L.map('map').setView([-33.41265, -70.56614], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        await this.initMap();
        //setInterval(this.updateMap, 10000);
    },
    methods: {
        async getWS() {
            if(this.userHash&&this.items.length!=0){
                this.trackers = this.items.map(item => item.vehicle_id);
                console.log(this.trackers);
                console.log(this.userHash);
                let socket = new WebSocket("wss://masgps.witservices.io/api-v2/event/subscription");
                let message = { "action": "subscribe", "hash": this.userHash, "events": ["state"], "trackers": this.trackers };

                console.log(socket);
                console.log(message);

                socket.onopen = (e) => {
                    socket.send(JSON.stringify(message));
                };

                socket.onmessage = (event) => {
                    const datos = JSON.parse(event.data);

                    console.log(datos.data);
                    console.log(this.markers);

                    var marker = this.markers.find(x => x.id === datos.data.source_id);

                    if(marker != null){
                        console.log('test');
                        marker.setLatLng([datos.data.gps.location.lat,datos.data.gps.location.lng]);
                    }
                };
            }
        },
        toggleInactive(){
            this.inactive = !this.inactive;
        },
        async updateMap(){
            this.$root.loadScreen = true;
            await this.$root.getVehiculos();

            this.$root.getApiData('logs')
            .then(reply => {
                this.items = reply;
                console.log(reply);
                console.log(this.markers);

                reply.forEach(item => {
                    var marker = this.markers.find(x => x.id === item.vehicle_id);
                    if(marker!=null){
                        if(item.estado!="parked"){
                            marker.setIcon(busIcon);
                        } else {
                            marker.setIcon(disabledIcon);
                        }
                        marker.setLatLng([item.lat,item.lng]);
                        marker.setPopupContent(`<p style="text-align:center"><b>${item.vehicle.patente}</b><br>${item.lat}, ${item.lng}<br>${item.velocidad}km/h</p>`);
                    }
                    this.$root.loadScreen = false;
                });
            })
            .catch(error => {
                console.log(error);
                this.$root.loadScreen = false;
            });
        },
        async initMap(){
            this.$root.loadScreen = true;

            this.$root.getApiData('logs')
            .then(reply => {
                if(reply){
                this.items = reply;
                reply.forEach(item => {
                        var latitude = item.lat;
                        var longitude = item.lng;

                        if(item.estado!="parked"){
                            var marker = L.marker([latitude, longitude],{icon: busIcon, autoPan: false, autoPanOnFocus: false}).addTo(this.map);
                        } else {
                            var marker = L.marker([latitude, longitude],{icon: disabledIcon, autoPan: false, autoPanOnFocus: false}).addTo(this.map);
                        }
                            
                        marker.bindPopup(`<p style="text-align:center"><b>${item.vehicle.patente}</b><br>${latitude}, ${longitude}<br>${item.velocidad}km/h</p>`);

                        marker.id = item.source_id;

                        this.markers.push(marker);
                });
                this.trackers = this.items.map(item => item.vehicle_id);
                this.getWS();
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