<template>
    <div class="content">
        <div class="viewContent">
            <h1>Patente: {{ logs.data ? logs.data[0].vehicle.patente : '' }}</h1>
            <div class="content-group">
                <button @click="goBack()" class="btn-gradient"><i class="fa fa-chevron-left fa-fw"></i> Volver</button>
                <button @click="update()" class="btn-gradient"><i class="fa fa-refresh fa-fw"></i> Actualizar</button>
            </div>
            <LogsDtlTable :tdata="logs.data"/>
            <div style="float:left" v-if="this.logs.data" class="content-group">
                <p>Última actualización: {{ this.logs.data[0].latest_updated_at }}</p>
            </div>
            <PaginationStrip :routeName="'logsdtl'" :links="filteredLinks()"/>
        </div>
    </div>
</template>

<script>
import LogsDtlTable from '../components/tables/LogsDtlTable.vue'
import PaginationStrip from '../components/PaginationStrip.vue'
import router from '../router/index'
import api from '@/api';

export default {
    components: {
        LogsDtlTable,
        PaginationStrip,
    },
    data() {
        return {
            logs: [],
            track_id: this.$route.params.id,
        }
    },
    created() {
        this.refresh();
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/logs/${this.track_id}`, {
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
        goBack() {
            router.push({name: 'logs', params: { page: 1 }});
        },
        async update(){
            this.$root.loadScreen = true;
            await this.$root.getVehiculos();
            this.$root.loadScreen = false;
            this.refresh();
        },
        filteredLinks() {
            return this.logs.links ? this.logs.links.filter(item => item.url !== null) : '';
        },
        sortBy(key){
            var direct = 'asc';
            if(this.$route.params.sort == key){
                if(this.$route.params.dir=='asc'){
                    direct = 'desc';
                } else {
                    direct = 'asc';
                }
            }
            router.push({name: 'logsdtl', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
            //this.refresh();
        },
        async refresh() {
            this.$root.loadScreen = true;
            this.$root.getApiData(`logs/${this.track_id}`,true)
            .then(data => {
                this.$root.loadScreen = false;
                this.logs = data;
            });
        }
    }
}
</script>