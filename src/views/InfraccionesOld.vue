<template>
<div class="content">
    <div class="viewContent">
        <h1>Infracciones de Velocidad</h1>
        <div class="content-group">
            <div class="btn-group">
                <ButtonStrip />
            </div>
            <form v-on:submit.prevent="" class="search-group">
                <input ref="searchtext" class="search-input" type="text" v-model="searchQuery" placeholder="Ingresa una patente"/>
                <a @click="" class="search-clear"><i class="fa fa-times fa-fw"></i></a>
                <button class="btn-export"><i class="fa fa-search fa-fw"></i>Patente</button>
            </form>
        </div>
        <InfraccionesTable :tdata="alertas" />
    </div>
</div>
</template>
<script>
import ButtonStrip from '@/components/ButtonStrip.vue'
import InfraccionesTable from '@/components/tables/InfraccionesTable.vue'

export default {
    components: {
        ButtonStrip,
        InfraccionesTable
    },
    data() {
        return {
            alertas: null,
        }
    },
    created() {
        this.refresh()
        .then(() => {
            console.log(this.alertas);
        });
    },
    methods: {
        async refresh(){
            this.$root.loadScreen = true;
            this.$root.getApiData('gpsalert',true)
            .then(data => {
                this.$root.loadScreen = false;
                this.alertas = data;
            });
        }
    }
}
</script>