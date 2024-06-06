<template>
<div class="content">
    <div class="viewContent">
        <h1>Conductores</h1>
        <div class="content-group">
            <button @click="showCreateModal()" class="btn-gradient">Nuevo Chofer</button>
        </div>
        <div class="content-group">
            <div class="btn-group">
                <ButtonStrip :indata="conductores.data"/>
            </div>
            <form v-on:submit.prevent="doSearch(1)" class="search-group">
                <input ref="searchtext" class="search-input" type="text" v-model="searchQuery" placeholder="Ingrese un termino"/>
                <a @click="clearSearch" class="search-clear"><i class="fa fa-times fa-fw"></i></a>
                <button class="btn-export"><i class="fa fa-search fa-fw"></i>Buscar</button>
            </form>
        </div>
        <ConductoresTable :tdata="conductores.data"/>
        <PaginationStrip :routeName="'conductores'" :links="filteredLinks()"/>
        <ConductorCreate
            v-if="dispCreateModal"
            :vehicles="vehiculos"
            :smartcards="smartcards"
            :companies="empresas"
            :dataIn="editado"
        />
    </div>
</div>
</template>

<script>
import api from '@/api';
import ButtonStrip from '@/components/ButtonStrip.vue'
import ConductoresTable from '@/components/tables/ConductoresTable.vue'
import ConductorCreate from '@/components/modals/ConductorCreate.vue'
import PaginationStrip from '@/components/PaginationStrip.vue'
import router from '@/router/index'

export default {
    components: {
        ButtonStrip,
        ConductoresTable,
        PaginationStrip,
        ConductorCreate,
    },
    data() {
        return {
            dispCreateModal: false,
            conductores: [],
            vehiculos: [],
            smartcards: [],
            empresas: [],
            searchQuery: '',
            editado: {},
            vehid: 0,
            empid: 0,
            scid: 0,
        }
    },
    created() {
        this.refresh();

        $(document).ready(function() {
            $('#example').DataTable();
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/conductores`, {
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
            this.conductores = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        // Funcion para filtrar la paginacion generada por Laravel
        filteredLinks() {
            return this.conductores.links ? this.conductores.links.filter(item => item.url !== null) : '';
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
            router.push({name: 'conductores', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
        },
        // Limpia la barra de busqueda, incluyendo el parametro de ruta
        clearSearch(){
            this.searchQuery = '';
            router.push({name: 'conductores', params: { page: 1, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Hace una busqueda, cambiando el parametro de ruta con el contenido de searchQuery
        doSearch(curpage = 1){
            router.push({name: 'conductores', params: { page: curpage, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Carga los datos desde el backend
        async refresh() {
            this.$root.loadScreen = true;
            api.get('gpsemploy')
            .then(data => {
                this.conductores = data;
                this.$root.loadScreen = false;
            });
        },
        // Muestra el modal crear o editar
        // itemIn: Entrada a editar, si se deja en null se asume que se creará
        async showCreateModal(itemIn = null) {
            this.$root.loadScreen = true;
            this.editado = itemIn;
            this.vehiculos = await this.$root.getApiData('vehiculos');
            this.smartcards = await this.$root.getApiData('smartcards');
            this.empresas = await this.$root.getApiData('empresas');
            this.dispCreateModal = true;
            this.$root.loadScreen = false;
        },
        // Cambia el estado del conductor
        async toggle(itemIn = null){
            itemIn.activo = !itemIn.activo;

            api.put(`/conductores/${itemIn.id}`, {
                activo: itemIn.activo,
            });
        },
        // Crea una lista de objetos con llaves especificas, el cual se utilizará para generar CSV, libros de Excel o tabla de impresion
        async makeObject(){
            var objectout = [];

            this.conductores.data.forEach(item => {
                var itemout = {
                    'Id': item.id,
                    'Nombre': item.first_name+" "+item.last_name,
                    'Rut': item.personnel_number,
                    'Tracker ID': item.tracker_id,
                    'Tarjeta': item.hardware_key ? item.hardware_key : '',
                };

                objectout.push(itemout);
            });

            return objectout;
        },
        // Prepara un par de objetos para exportar
        async prepareExcel(){
            var dataObject = await this.makeObject();
            
            return { xls: dataObject, name: 'Conductores.xlsx'}
        },
        // Prepara un par de objetos para exportar
        async prepareCSV(separator = ','){
            var dataObject = await this.makeObject();
            
            var CSVData = this.$root.makeCSV(separator, dataObject);

            return { csv: CSVData, name: 'Conductores.csv'}
        },
    }
}
</script>