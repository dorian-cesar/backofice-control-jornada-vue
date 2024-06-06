<template>
<div class="content">
    <div class="viewContent">
        <h1>Vehiculos</h1>
        <div class="content-group">
            <button @click="showCreateModal()" class="btn-gradient">Nuevo Vehiculo</button>
            <button v-if="level>=10" @click="syncVehicles()" class="btn-gradient">Actualizar</button>
        </div>
        <div class="content-group">
            <div class="btn-group">
                <ButtonStrip :indata="vehiculos.data"/>
            </div>
            <form v-on:submit.prevent="doSearch(1)" class="search-group">
                <input ref="searchtext" class="search-input" type="text" v-model="searchQuery" placeholder="Ingrese un termino"/>
                <a @click="clearSearch" class="search-clear"><i class="fa fa-times fa-fw"></i></a>
                <button class="btn-export"><i class="fa fa-search fa-fw"></i>Buscar</button>
            </form>
        </div>
        <VehiculosTable :tdata="vehiculos.data"/>
        <PaginationStrip :routeName="'vehiculos'" :links="filteredLinks()"/>
        <VehiculoCreate
            v-if="dispCreateModal"
            :dataIn="editado"
            :types="tipos"
            :states="estados"
            :devices="dispositivos"
            :empresas="empresas"
        />
    </div>
</div>
</template>

<script>
import ButtonStrip from '@/components/ButtonStrip.vue'
import VehiculosTable from '@/components/tables/VehiculosTable.vue'
import VehiculoCreate from '@/components/modals/VehiculoCreate.vue'
import PaginationStrip from '@/components/PaginationStrip.vue'
import router from '@/router/index'
import api from '@/api';
import { useAuthStore } from '@/store/auth';

export default {
    components: {
        ButtonStrip,
        VehiculosTable,
        PaginationStrip,
        VehiculoCreate,
    },
    data() {
        return {
            level: useAuthStore().level,
            dispCreateModal: false,
            vehiculos: [],
            tipos: [],
            estados: [],
            dispositivos: [],
            empresas: [],
            searchQuery: '',
            editado: {},
        }
    },
    created() {
        this.refresh();
    },
    beforeRouteUpdate(to, from, next) {
        this.$root.loadScreen = true;
        api.get(`/vehiculos`, {
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
            this.vehiculos = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        // Sincroniza los vehiculos con el backend de MásGPS
        async syncVehicles() {
            this.$root.loadScreen = true;
            try {
                await api.get('/sync')
                .then(reply=>{
                    this.refresh();
                });
            } catch(error) {
                console.error(error);
            }
            this.$root.loadScreen = false;
        },
        // Funcion para filtrar la paginacion generada por Laravel
        filteredLinks() {
            return this.vehiculos.links ? this.vehiculos.links.filter(item => item.url !== null) : '';
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
            router.push({name: 'vehiculos', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
            //this.refresh();
        },
        // Limpia la barra de busqueda, incluyendo el parametro de ruta
        clearSearch(){
            this.searchQuery = '';
            router.push({name: 'vehiculos', params: { page: 1, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Hace una busqueda, cambiando el parametro de ruta con el contenido de searchQuery
        doSearch(curpage = 1){
            router.push({name: 'vehiculos', params: { page: curpage, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Carga los datos desde el backend
        async refresh() {
            this.$root.loadScreen = true;
            this.$root.getApiData('vehiculos',true)
            .then(data => {
                this.$root.loadScreen = false;
                this.vehiculos = data;
            });
        },
        // Muestra el modal crear o editar
        // itemIn: Entrada a editar, si se deja en null se asume que se creará
        async showCreateModal(itemIn = null) {
            this.$root.loadScreen = true;
            this.editado = itemIn;
            this.empresas = await this.$root.getApiData('empresas');
            this.tipos = await this.$root.getApiData('tipovehiculos');
            this.estados = await this.$root.getApiData('estadovehiculos');
            this.dispositivos = await this.$root.getApiData('dispositivos');
            this.dispCreateModal = true;
            this.$root.loadScreen = false;
        },
        // Crea una lista de objetos con llaves especificas, el cual se utilizará para generar CSV, libros de Excel o tabla de impresion
        async makeObject(){
            var objectout = [];
            var dataout = await this.$root.searchApiData('vehiculos',this.vehiculos.data);

            dataout.forEach(item => {
                var itemout = {
                    'Tracker Id': item.track_id,
                    'Patente': item.patente,
                    'Conductor': item.driver ? item.driver.nombre : '',
                    'Empresa' : item.company ? item.company.nombre : '',
                    'Tipo': item.vehicle_type ? item.vehicle_type.tipo : '',
                    'Estado': item.latest_log ? item.latest_log.estado : '',
                    'Conexion': item.latest_log ? item.latest_log.conexion : '',
                    'IMEI': item.imei
                };

                objectout.push(itemout);
            });

            return objectout;
        },
        // Prepara un par de objetos para exportar
        async prepareExcel(){
            var dataObject = await this.makeObject();
            
            return { xls: dataObject, name: 'Vehiculos.xlsx'}
        },
        // Prepara un par de objetos para exportar
        async prepareCSV(separator = ','){
            var dataObject = await this.makeObject();
            
            var CSVData = this.$root.makeCSV(separator, dataObject);

            // Retornamos un par de datos con llave
            return { csv: CSVData, name: 'Vehiculos.csv'}
        },
    }
}
</script>