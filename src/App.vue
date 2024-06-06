<template>
	<NavBar v-if="navEnable" ref="navbar"/>
	<router-view @click="closeBars()">
	</router-view>
	<Watermark/>
	<LoadingScreen v-if="loadScreen"/>
    <span id="sbNotif">Nueva notificación!</span>
</template>

<script>
import Watermark from '@/components/Watermark.vue';
import NavBar from '@/components/NavBar.vue';
import LoadingScreen from '@/components/LoadingScreen.vue'
import api from '@/api';
import { toHandlers } from 'vue';
import { receivedMessages } from '@/WebSocket.js';

export default {
	data() {
		return {
			navEnable: false,
        	loadScreen: false,
        	alertas: [],
			newAlerta: false,
			soundCtrl: true,
			userHash: null,
			buses: null,
			trackers: null,
			gpsData: null,
			alertNew: [],
		}
	},
  	components: {
    	Watermark,
    	NavBar,
        LoadingScreen,
  	},
	created() {
		if(localStorage.logs){
			this.alertNew = JSON.parse(localStorage.logs);
		}
	},
	mounted() {
		this.$watch(() => receivedMessages.value, (newMessages) => {
            if (newMessages.length > 0) {
                let latestMessage = newMessages[newMessages.length - 1];
				if(latestMessage.data.source_id&&latestMessage.data.gps.speed>110){
					let bus = this.buses.find(x => x.source_id==latestMessage.data.source_id);
					if(bus){
					this.alertNew.unshift({
						patente: bus.patente,
						speed: latestMessage.data.gps.speed,
						date: latestMessage.data.gps.updated,
					});
					}
				this.alertUI();
				localStorage.logs = JSON.stringify(this.alertNew);
				}
            }
        }, { deep: true });
	},
  	methods: {
	// Emite el sonido de notificacion, activa el snack y cambia el estado de newAlerta, el cual define el estado del boton de alertas en la barra superior
	alertUI() {
		if(this.soundCtrl){
			const notifAudio = new Audio();
			notifAudio.src = '/notification.mp3';
			notifAudio.play();
		}
		this.newAlerta = true;
		var sb = document.getElementById("sbNotif");
		sb.className = "show";
		setTimeout(()=>{ sb.className = sb.className.replace("show", ""); }, 5000);

	},
	// Crea un log de vehiculos en la base de datos, el backend se encarga de generar notificaciones en caso de superar los 45 Km/h
	async logVehicle(dataIn) {
		var dt = new Date();
		this.alertas.push({
			start_time: dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds(),
			fecha: dt.getDay()+"/"+dt.getMonth()+"/"+dt.getFullYear(),
			id_tracker: dataIn.id,
			patente: dataIn.patente,
			speed: dataIn.speed,
		});
		this.alertUI();
	},
	// Obtiene el hash de usuario desde el backend de MásGPS (A traves de nuestro backend)
	async getUserHash(){
		let data = await api.get('/wshash');

		return data.data.hash;
	},
	// Obtiene todos los buses desde el backend de MásGPS
	async getBuses(){
		let data = await api.get('/wsbuses');

		return data.data;
	},
	// Obtiene todas las paradas desde el backend de MásGPS
	async getParadas(){
		let data = await api.get('/wsparaderos');

		return data.data;
	},
	// Recarga la lista de notificaciones
	async refreshAlerts() {
		await this.$root.getApiData('gpsalert',false)
		.then(data => {
			this.alertas = data;
		});
		return;
	},
	// Obtiene la lista de vehiculos y los sincroniza en nuestro backend, no usar
	async getVehiculos() {
		try {
			let data = await api.get('/sync');
			await this.refreshAlerts();
			return data;
		} catch (error) {
			console.error('Error buscando vehiculos:', error);
			throw error;
		}
	},
	// Cierra la barra lateral, la lista de notificaciones y la opciones de usuario, llamado al hacer click en el contenido de la pagina
	closeBars() {
		if(this.$refs.navbar) {
		document.getElementsByClassName('content')[0].classList.remove('opened');
		this.$refs.navbar.mostrarUserbar = false;
		this.$refs.navbar.mostrarSidebar = false;
		this.$refs.navbar.mostrarNotif = false;
		}
	},
	// Funcion generica para llamar un endpoint GET del backend con un query de busqueda
	// apidir: nombre de la ruta de la api
	// curdata: lista actual de datos en caso de que el query este vacio
	async searchApiData(apidir = '', curdata){
		if(this.$route.params.query===''){
			const res = await api.get(`/${apidir}`,{
				params: {
					sort: this.$route.params.sort ? {col: this.$route.params.sort, dir: this.$route.params.dir} : '',
				}
			});
			return res.data;
		}
		return curdata;
	},
	// Funcion generica para llamar un endpoint GET
	// apidir: nombre de la ruta de la api
	// table: traer todos los datos o separarlos en tabla
	async getApiData(apidir = '', table = false){
		if(table){
            try{
            const res = await api.get(`/${apidir}`, {
					params: {
                    page: this.$route.params.page,
                    searchqry: this.$route.params.query,
                    sort: this.$route.params.sort ? {
                        col: this.$route.params.sort,
                        dir: this.$route.params.dir,
                    } : '',
                }
            });
            return res.data;
            } catch(error) {
                console.error(error);
            }
		} else {
            try {
                const res = await api.get(`/${apidir}`);
                return res.data;
            } catch(error) {
                console.error(error);
            }
		}
	},
	// Toma una lista de objetos y lo convierte en un string CSV
	// separator: caracter a usar como separador
	// dataIn: lista de objetos, puede contener una cantidad variable de llaves, pero todos los objetos deben tener las mismas llaves
	makeCSV(separator = ',', datain){
		// Headers
		var CSVData = '';

		for (const [key, value] of Object.entries(datain[0])) {
			CSVData += key+separator;
		}

		CSVData += '\n';

		datain.forEach(item => {
			for (const [key, value] of Object.entries(item)) {
				CSVData += value+separator;
			}
			CSVData += '\n';
		});

		return CSVData;
	},
  	}
}
</script>