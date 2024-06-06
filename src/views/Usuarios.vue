<template>
    <div class="content">
        <div class="viewContent">
            <h1>Usuarios</h1>
            <div class="content-group">
                <button @click="showCreateModal()" class="btn-gradient">Nuevo Usuario</button>
            </div>
            <table ref="tableData" id="tableData" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Nivel</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.level }}</td>
                        <td>
                            <button class="btn-table" @click="editRow(user)"><i class="fa fa-pencil fa-fw"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <UsuarioCreate v-if="dispCreateModal" :dataIn="edited"/>
        </div>
    </div>
</template>

<script>
import UsuarioCreate from '@/components/modals/UsuarioCreate.vue'
import api from '@/api';
export default {
    components: {
        UsuarioCreate,
    },
    data() {
        return {
            dispCreateModal: false,
            edited: null,
            users: [],
        }
    },
    async mounted() {
        this.$root.loadScreen = true;
        await this.fetchData();
        this.tableRef = $('#tableData').dataTable({
			language: {
				url: "/esCLDT.json"
			},
			layout: {
				topStart: {
					buttons: [
						'copyHtml5',
						'excelHtml5',
						'csvHtml5',
						'pdfHtml5']
				},
				bottomStart: 'pageLength'
			},
			columnDefs: [
				{"className": "dt-center", "targets": "_all"}
			],
		});
        this.$root.loadScreen = false;
    },
    methods: {
        async fetchData(){
            try {
                const response = await api.get('/gpsusers');
                this.users = response.data;
                //const json = await response.data;
                //this.processData(json);
            } catch(error) {
                console.error(error);
            }
        },
        insertData(item){
            $('#tableData').DataTable().row.add([
                item.id,
                item.name,
                item.email,
                item.level,
                '',
            ]).draw(false);
        },
        processData(dataIn){
			$('#tableData').DataTable().clear();
			$('#tableData').DataTable().page(1);
            dataIn.forEach(item => {
				$('#tableData').DataTable().row.add([
                    item.id,
                    item.name,
                    item.email,
                    item.level,
                    '<button @click="editRow(' + item + ')">Ed</button>'
                ]).draw(false);
            });
        },
        editRow(dataIn){
            this.$root.loadScreen = true;
            this.edited = dataIn;
            if(this.edited){
                this.dispCreateModal = true;
            }
            this.$root.loadScreen = false;
        },
        showCreateModal(){
            this.$root.loadScreen = true;
            this.edited = null;
            this.dispCreateModal = true;
            this.$root.loadScreen = false;
        }
    }
}
</script>
