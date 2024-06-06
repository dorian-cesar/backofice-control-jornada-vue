<template>
<div class="content">
    <div class="viewContent">
        <h1>Dispositivos de Conexion</h1>
        <div class="content-group">
            <button @click="showCreateModal()" class="btn-gradient">Nuevo Dispositivo</button>
        </div>
        <div class="content-group">
            <div class="btn-group">
                <ButtonStrip :indata="dispositivos.data"/>
            </div>
            <form v-on:submit.prevent="doSearch(1)" class="search-group">
                <input ref="searchtext" class="search-input" type="text" v-model="searchQuery" placeholder="Ingrese un termino"/>
                <a @click="clearSearch" class="search-clear"><i class="fa fa-times fa-fw"></i></a>
                <button class="btn-export"><i class="fa fa-search fa-fw"></i>Buscar</button>
            </form>
        </div>
        <DispositivosTable :tdata="dispositivos.data"/>
        <PaginationStrip :routeName="'dispositivos'" :links="filteredLinks()"/>
        <DispositivoCreate v-if="dispCreateModal" :dataIn="editado"></DispositivoCreate>
    </div>
</div>
</template>

<script>
import api from '@/api';
import ButtonStrip from '@/components/ButtonStrip.vue'
import DispositivosTable from '@/components/tables/DispositivosTable.vue'
import DispositivoCreate from '@/components/modals/DispositivoCreate.vue'
import PaginationStrip from '@/components/PaginationStrip.vue'
import router from '@/router/index'

export default {
    components: {
        ButtonStrip,
        DispositivosTable,
        PaginationStrip,
        DispositivoCreate,
    },
    data() {
        return {
            dispCreateModal: false,
            vehiculos: [],
            dispositivos: [],
            searchQuery: '',
            editado: {},
        }
    },
    created() {
        this.refresh();
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/dispositivos`, {
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
            this.dispositivos = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        // Funcion para filtrar la paginacion generada por Laravel
        filteredLinks() {
            return this.dispositivos.links ? this.dispositivos.links.filter(item => item.url !== null) : '';
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
            router.push({name: 'dispositivos', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
            //this.refresh();
        },
        // Limpia la barra de busqueda, incluyendo el parametro de ruta
        clearSearch(){
            this.searchQuery = '';
            router.push({name: 'dispositivos', params: { page: 1, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Hace una busqueda, cambiando el parametro de ruta con el contenido de searchQuery
        doSearch(curpage = 1){
            router.push({name: 'dispositivos', params: { page: curpage, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Carga los datos desde el backend
        async refresh() {
            this.$root.loadScreen = true;
            this.$root.getApiData('dispositivos',true)
            .then(data => {
                this.dispositivos = data;
                this.$root.loadScreen = false;
            });
        },
        // Muestra el modal crear o editar
        // itemIn: Entrada a editar, si se deja en null se asume que se creará
        async showCreateModal(itemIn = null) {
            this.$root.loadScreen = true;
            this.vehiculos = await this.$root.getApiData('vehiculos');
            this.editado = itemIn;
            this.dispCreateModal = true;
            this.$root.loadScreen = false;
        },
        // Crea una lista de objetos con llaves especificas, el cual se utilizará para generar CSV, libros de Excel o tabla de impresion
        async makeObject(){
            var objectout = [];
            var dataout = await this.$root.searchApiData('dispositivos',this.dispositivos.data);

            dataout.forEach(item => {
                var itemout = {
                    'Id': item.id,
                    'Número SIM': item.sim,
                    'Vehiculo': item.vehicle ? item.vehicle.patente : '',
                };

                objectout.push(itemout);
            });

            return objectout;
        },
        // Prepara un par de objetos para exportar
        async prepareExcel(){
            var dataObject = await this.makeObject();
            
            return { xls: dataObject, name: 'Dispositivos.xlsx'}
        },
        // Prepara un par de objetos para exportar
        async prepareCSV(separator = ','){
            var dataObject = await this.makeObject();
            
            var CSVData = this.$root.makeCSV(separator, dataObject);

            // Retornamos un par de datos con llave
            return { csv: CSVData, name: 'Dispositivos.csv'}
        },
    }
}
</script>