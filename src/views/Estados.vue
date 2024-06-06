<template>
<div class="content">
    <div class="viewContent">
        <h1>Estados de Vehiculos</h1>
        <div class="content-group">
            <button @click="showCreateModal()" class="btn-gradient">Nuevo Estado</button>
        </div>
        <div class="content-group">
            <div class="btn-group">
                <ButtonStrip :indata="estados.data"/>
            </div>
            <form v-on:submit.prevent="doSearch(1)" class="search-group">
                <input ref="searchtext" class="search-input" type="text" v-model="searchQuery" placeholder="Ingrese un termino"/>
                <a @click="clearSearch" class="search-clear"><i class="fa fa-times fa-fw"></i></a>
                <button class="btn-export"><i class="fa fa-search fa-fw"></i>Buscar</button>
            </form>
        </div>
        
        <VehiculosEstadosTable :tdata="estados.data"/>
        <PaginationStrip :routeName="'estados'" :links="filteredLinks()"/>
        <EstadoCreate v-if="dispCreateModal" :dataIn="editado"></EstadoCreate>
    </div>
</div>
</template>

<script>
import ButtonStrip from '../components/ButtonStrip.vue'
import VehiculosEstadosTable from '../components/tables/VehiculosEstadosTable.vue'
import EstadoCreate from '../components/modals/EstadoCreate.vue'
import PaginationStrip from '../components/PaginationStrip.vue'
import router from '../router/index'
import api from '@/api';

export default {
    components: {
        ButtonStrip,
        VehiculosEstadosTable,
        PaginationStrip,
        EstadoCreate,
        LoadingScreen,
    },
    data() {
        return {
            dispCreateModal: false,
            estados: [],
            searchQuery: '',
            editado: {},
        }
    },
    created() {
        this.refresh();
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/estadovehiculos`, {
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
            this.estados = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        filteredLinks() {
            return this.estados.links ? this.estados.links.filter(item => item.url !== null) : '';
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
        clearSearch(){
            this.searchQuery = '';
            router.push({name: 'estados', params: { page: 1, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        doSearch(curpage = 1){
            router.push({name: 'estados', params: { page: curpage, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        async refresh() {
            this.$root.loadScreen = true;
            this.$root.getApiData('estadovehiculos',true)
            .then(data => {
                this.estados = data;
                this.$root.loadScreen = false;
            });
        },
        async showCreateModal(itemIn = null) {
            this.$root.loadScreen = true;
            this.editado = itemIn;
            this.dispCreateModal = true;
            this.$root.loadScreen = false;
        },
        async makeObject(){
            var objectout = [];
            var dataout = await this.$root.searchApiData('estadovehiculos',this.estados.data);

            dataout.forEach(item => {
                var itemout = {
                    'Id': item.id,
                    'Estado': item.estado,
                };

                objectout.push(itemout);
            });

            return objectout;
        },
        async prepareExcel(){
            var dataObject = await this.makeObject();
            
            return { xls: dataObject, name: 'Estados.xlsx'}
        },
        async prepareCSV(separator = ','){
            var dataObject = await this.makeObject();
            
            var CSVData = this.$root.makeCSV(separator, dataObject);

            // Retornamos un par de datos con llave
            return { csv: CSVData, name: 'Estados.csv'}
        },
    }
}
</script>