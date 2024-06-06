<template>
    <div class="content">
        <Dashboard/>
    </div>
</template>

<script>
import Dashboard from '@/views/Dashboard.vue';
import { socket } from '@/WebSocket.js';

export default {
    components: {
      	Dashboard,
    },
    mounted() {
		this.initWS();
    },
	methods: {
		// Inicializa la conexion con el servidor WebSocket
		async initWS(){
			if(!this.$root.userHash){
            this.$root.loadScreen = true;
			this.$root.userHash = await this.$root.getUserHash();
			this.$root.getBuses()
			.then(reply => {
				this.$root.buses = reply;
				this.$root.trackers = this.$root.buses.map(item => item.id);
				let message = { "action": "subscribe", "hash": this.$root.userHash, "events": ["state"], "trackers": this.$root.trackers };
				socket.send(JSON.stringify(message));
				console.log(message);
            	this.$root.loadScreen = false;
			});
			}
		}
	},
}
</script>
