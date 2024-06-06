<template>
<div class="content">
    <div class="viewContent">
        <h1>Empresas</h1>
        <div class="content-group">
            <button @click="showCreateModal()" class="btn-gradient">Nueva Empresa</button>
        </div>
        <div class="content-group">
            <div class="btn-group">
                <ButtonStrip :indata="empresas.data"/>
            </div>
            <form v-on:submit.prevent="doSearch(1)" class="search-group">
                <input ref="searchtext" class="search-input" type="text" v-model="searchQuery" placeholder="Ingrese un termino"/>
                <a @click="clearSearch" class="search-clear"><i class="fa fa-times fa-fw"></i></a>
                <button class="btn-export"><i class="fa fa-search fa-fw"></i>Buscar</button>
            </form>
        </div>
        
        <EmpresasTable :tdata="empresas.data"/>
        <PaginationStrip :routeName="'empresas'" :links="filteredLinks()"/>
        <EmpresaCreate v-if="dispCreateModal" :dataIn="editado"></EmpresaCreate>
    </div>
</div>
</template>

<script>
import ButtonStrip from '@/components/ButtonStrip.vue'
import EmpresasTable from '@/components/tables/EmpresasTable.vue'
import EmpresaCreate from '@/components/modals/EmpresaCreate.vue'
import PaginationStrip from '@/components/PaginationStrip.vue'
import router from '@/router/index'
import api from '@/api';

export default {
    components: {
        ButtonStrip,
        EmpresasTable,
        PaginationStrip,
        EmpresaCreate,
    },
    data() {
        return {
            dispCreateModal: false,
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
        api.get(`/empresas`, {
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
            this.empresas = data.data;
            this.$root.loadScreen = false;
        });
        next();
    },
    methods: {
        // Funcion para filtrar la paginacion generada por Laravel
        filteredLinks() {
            return this.empresas.links ? this.empresas.links.filter(item => item.url !== null) : '';
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
            router.push({name: 'empresas', params: { page: 1, sort: key, dir: direct, query: this.$route.params.query }});
            //this.refresh();
        },
        // Limpia la barra de busqueda, incluyendo el parametro de ruta
        clearSearch(){
            this.searchQuery = '';
            router.push({name: 'empresas', params: { page: 1, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Hace una busqueda, cambiando el parametro de ruta con el contenido de searchQuery
        doSearch(curpage = 1){
            router.push({name: 'empresas', params: { page: curpage, sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.searchQuery }});
        },
        // Carga los datos desde el backend
        async refresh() {
            this.$root.loadScreen = true;
            this.$root.getApiData('empresas',true)
            .then(data => {
                this.empresas = data;
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
        // Cambia el estado de la empresa
        async toggle(itemIn = null){
            itemIn.estado = !itemIn.estado;

            api.put(`/empresas/${itemIn.id}`, {
                estado: itemIn.estado,
            });
        },
        // Crea una lista de objetos con llaves especificas, el cual se utilizará para generar CSV, libros de Excel o tabla de impresion
        async makeObject(){
            var objectout = [];
            var dataout = await this.$root.searchApiData('empresas',this.empresas.data);

            dataout.forEach(item => {
                var itemout = {
                    'Id': item.id,
                    'RUT': item.rut,
                    'Nombre': item.nombre,
                };

                objectout.push(itemout);
            });

            return objectout;
        },
        // Prepara un par de objetos para exportar
        async prepareExcel(){
            var dataObject = await this.makeObject();
            
            return { xls: dataObject, name: 'Empresas.xlsx'}
        },
        // Prepara un par de objetos para exportar
        async prepareCSV(separator = ','){
            var dataObject = await this.makeObject();
            
            var CSVData = this.$root.makeCSV(separator, dataObject);

            // Retornamos un par de datos con llave
            return { csv: CSVData, name: 'Empresas.csv'}
        },
    }
}
</script>