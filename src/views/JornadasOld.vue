<template>
    <div class="content">
        <div class="viewContent">
            <h1>Control de Jornadas</h1>
            <div class="content-group">
                <button @click="showCreateModal()" class="btn-gradient">Registrar Movimiento</button>
            </div>
            <JornadaTable :tdata="jornadas.data"/>
            <PaginationStrip :routeName="'estados'" :links="filteredLinks()"/>
            <JornadaForge :drivers="drivers" v-if="dispCreateModal"/>
        </div>
    </div>
</template>

<script>
import JornadaTable from '@/components/tables/JornadaTable.vue'
import JornadaForge from '@/components/modals/JornadaForge.vue'
import PaginationStrip from '@/components/PaginationStrip.vue'
import router from '@/router/index'
import api from '@/api';

export default {
    components: {
        JornadaTable,
        PaginationStrip,
        JornadaForge,
    },
    data() {
        return {
            jornadas: [],
            drivers: [],
            dispCreateModal: false,
        }
    },
    created() {
        this.refresh();
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/historial`, {
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
            this.jornadas = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        filteredLinks() {
            return this.jornadas.links ? this.jornadas.links.filter(item => item.url !== null) : '';
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
            router.push({name: 'estados', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
            //this.refresh();
        },
        async refresh() {
            this.$root.loadScreen = true;
            this.$root.getApiData('historial',true)
            .then(data => {
                this.$root.loadScreen = false;
                this.jornadas = data;
            });
        },
        async showCreateModal() {
            this.$root.loadScreen = true;
            this.drivers = await this.$root.getApiData('conductores');
            this.dispCreateModal = true;
            this.$root.loadScreen = false;
        },
    }
}
</script>