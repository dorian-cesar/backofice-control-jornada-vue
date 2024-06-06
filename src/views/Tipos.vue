<template>
<div class="content">
    <div class="viewContent">
        <h1>Tipos de Vehiculos</h1>
        <div class="content-group">
            <button @click="showCreateModal()" class="btn-gradient">Nuevo Tipo</button>
        </div>
        <div class="content-group">
            <div class="btn-group">
                <ButtonStrip :indata="tipos.data"/>
            </div>
            <form v-on:submit.prevent="doSearch(1)" class="search-group">
                <input ref="searchtext" class="search-input" type="text" v-model="searchQuery" placeholder="Ingrese un termino"/>
                <a @click="clearSearch" class="search-clear"><i class="fa fa-times fa-fw"></i></a>
                <button class="btn-export"><i class="fa fa-search fa-fw"></i>Buscar</button>
            </form>
        </div>
        
        <VehiculosTiposTable :tdata="tipos.data"/>
        <PaginationStrip :routeName="'tipos'" :links="filteredLinks()"/>
        <TipoCreate v-if="dispCreateModal" :dataIn="editado"></TipoCreate>
    </div>
</div>
</template>

<script>
import ButtonStrip from '@/components/ButtonStrip.vue'
import VehiculosTiposTable from '@/components/tables/VehiculosTiposTable.vue'
import TipoCreate from '@/components/modals/TipoCreate.vue'
import PaginationStrip from '@/components/PaginationStrip.vue'
import router from '@/router/index'
import api from '@/api';

export default {
    components: {
        ButtonStrip,
        VehiculosTiposTable,
        PaginationStrip,
        TipoCreate,
    },
    data() {
        return {
            dispCreateModal: false,
            tipos: [],
            searchQuery: '',
            editado: {},
        }
    },
    created() {
        this.refresh();
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/tipovehiculos`, {
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
            this.tipos = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        // Funcion para filtrar la paginacion generada por Laravel
        filteredLinks() {
            return this.tipos.links ? this.tipos.links.filter(item => item.url !== null) : '';
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
            router.push({name: 'tipos', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
            //this.refresh();
        },
        // Limpia la barra de busqueda, incluyendo el parametro de ruta
        clearSearch(){
            this.searchQuery = '';
            router.push({name: 'tipos', params: { page: 1, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Hace una busqueda, cambiando el parametro de ruta con el contenido de searchQuery
        doSearch(curpage = 1){
            router.push({name: 'tipos', params: { page: curpage, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Carga los datos desde el backend
        async refresh() {
            this.$root.loadScreen = true;
            this.$root.getApiData('tipovehiculos',true)
            .then(data => {
                this.tipos = data;
                this.$root.loadScreen = false;
            });
        },
        // Muestra el modal crear o editar
        // itemIn: Entrada a editar, si se deja en null se asume que se creará
        async showCreateModal(itemIn = null) {
            this.$root.loadScreen = true;
            this.editado = itemIn;
            this.dispCreateModal = true;
            this.$root.loadScreen = false;
        },
        // Crea una lista de objetos con llaves especificas, el cual se utilizará para generar CSV, libros de Excel o tabla de impresion
        async makeObject(){
            var objectout = [];
            var dataout = await this.$root.searchApiData('tipovehiculos',this.tipos.data);

            dataout.forEach(item => {
                var itemout = {
                    'Id': item.id,
                    'Tipo': item.tipo,
                };

                objectout.push(itemout);
            });

            return objectout;
        },
        // Prepara un par de objetos para exportar
        async prepareExcel(){
            var dataObject = await this.makeObject();
            
            return { xls: dataObject, name: 'Tipos.xlsx'}
        },
        // Prepara un par de objetos para exportar
        async prepareCSV(separator = ','){
            var dataObject = await this.makeObject();
            
            var CSVData = this.$root.makeCSV(separator, dataObject);

            // Retornamos un par de datos con llave
            return { csv: CSVData, name: 'Tipos.csv'}
        },
    }
}
</script>