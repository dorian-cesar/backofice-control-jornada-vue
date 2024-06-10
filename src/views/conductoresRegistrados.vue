<template>
    <div class="content">
        <div class="viewContent">
            <h1>Control de Horario</h1>
            <div class="content-group">
                <button @click="showCreateModal" class="btn-gradient">Nuevo Usuario</button>
            </div>
            <table ref="tableData" id="tableData" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>RUT</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Código RFID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="conductor in conductores" :key="conductor.id">
                        <td>{{ conductor.id }}</td>
                        <td>{{ conductor.rut }}</td>
                        <td>{{ conductor.nombre }}</td>
                        <td>{{ conductor.fecha }}</td>
                        <td>{{ conductor.rfid }}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" @click="editConductor(conductor)"><i class="fa fa-pencil fa-fw"></i></button>
                            <button class="btn btn-danger btn-sm" @click="deleteConductor(conductor.id)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <UsuarioCreate v-if="dispCreateModal" :conductor="selectedConductor" @close="closeModal" @saved="handleSave"/>
        </div>
    </div>
</template>

<script>
import UsuarioCreate from '@/components/modals/UsuarioCreate2.vue'
import axios from 'axios';

export default {
    components: {
        UsuarioCreate,
    },
    data() {
        return {
            dispCreateModal: false,
            conductores: [],
            tableData: [],
            dataTableInstance: null,
            selectedConductor: null,
        };
    },
    async mounted() {
        await this.leerConductores();
        this.initializeDataTable();
    },
    methods: {
        async leerConductores() {
            try {
                const response = await axios.get('https://interurbano.wit.la/card-rfid/php/read.php');
                this.conductores = response.data;
            } catch (error) {
                console.error('Error al obtener los conductores:', error);
            }
        },
        initializeDataTable() {
            this.$nextTick(() => {
                this.dataTableInstance = $('#tableData').DataTable({
                    data: this.conductores,
                    columns: [
                        { data: 'id', className: 'text-center' },
                        { data: 'rut', className: 'text-center' },
                        { data: 'nombre', className: 'text-center' },
                        { data: 'fecha', className: 'text-center' },
                        { data: 'rfid', className: 'text-center' },
                        {
                            data: null,
                            className: 'text-center',
                            orderable: false,
                            searchable: false,
                            createdCell: (cell, cellData, rowData, rowIndex, colIndex) => {
                                $(cell).html(`
                                    <button class="btn btn-warning btn-sm edit-button">Editar</button>
                                    <button class="btn btn-danger btn-sm delete-button">Eliminar</button>
                                `);
                            }
                        },
                    ],
                });

                $('#tableData tbody').on('click', 'button.edit-button', (event) => {
                    const data = this.dataTableInstance.row($(event.target).closest('tr')).data();
                    this.editConductor(data);
                });

                $('#tableData tbody').on('click', 'button.delete-button', (event) => {
                    const data = this.dataTableInstance.row($(event.target).closest('tr')).data();
                    this.deleteConductor(data.id);
                });
            });
        },
        async reloadDataTable() {
            try {
                const response = await axios.get('https://interurbano.wit.la/card-rfid/php/read.php');
                this.dataTableInstance.clear().rows.add(response.data).draw();
            } catch (error) {
                console.error('Error al recargar el DataTable:', error);
            }
        },
        showCreateModal() {
            this.selectedConductor = { id: null, rut: '', nombre: '', fecha: '', rfid: '' };
            this.dispCreateModal = true;
            $('#usuarioModal').modal('show');
        },
        async deleteConductor(id) {
            try {
                const response = await axios.post('https://interurbano.wit.la/card-rfid/php/delete.php', { id });
                if (response.data.success) {
                    await this.leerConductores();
                    this.reloadDataTable();
                    alert(response.data.message);
                } else {
                    alert('Error al eliminar el conductor: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error al eliminar el conductor:', error);
                alert('Error al eliminar el conductor.');
            }
        },
        editConductor(conductor) {
            this.selectedConductor = { ...conductor };
            this.dispCreateModal = true;
            $('#usuarioModal').modal('show');
        },
        closeModal() {
            this.dispCreateModal = false;
            $('#usuarioModal').modal('hide');
        },
        handleSave() {
            this.dispCreateModal = false;
            this.reloadDataTable();
            $('#usuarioModal').modal('hide');
        },
    }
};
</script>
