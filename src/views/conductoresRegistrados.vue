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
                            <button class="btn btn-warning btn-sm" @click="editConductor(conductor)">
                                <i class="fa fa-pencil fa-fw"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" @click="deleteConductor(conductor.id)">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <UsuarioCreate v-if="dispCreateModal" :conductor="selectedConductor" @close="closeModal"
                @saved="handleSave" />
        </div>
    </div>
</template>

<script>
import UsuarioCreate from '@/components/modals/UsuarioCreate2.vue'; // Importa el componente UsuarioCreate.
import axios from 'axios'; // Importa la biblioteca axios para hacer solicitudes HTTP.

export default {
    components: {
        UsuarioCreate, // Declara el componente UsuarioCreate para su uso en este componente.
    },
    data() {
        return {
            dispCreateModal: false, // Indica si el modal de creación está visible o no.
            conductores: [], // Almacena la lista de conductores.
            dataTableInstance: null, // Instancia de DataTable para manejar la tabla de datos.
            selectedConductor: null, // Almacena el conductor seleccionado para editar.
        };
    },
    async mounted() {
        await this.leerConductores(); // Llama a la función para leer los conductores cuando el componente se monta.
        this.initializeDataTable(); // Inicializa la tabla de datos.
    },
    methods: {
        // Método para leer los conductores desde la API
        async leerConductores() {
            try {
                const response = await axios.get('https://interurbano.wit.la/card-rfid/php/read.php');
                this.conductores = response.data; // Asigna los datos recibidos a la variable conductores.
            } catch (error) {
                console.error('Error al obtener los conductores:', error); // Muestra un error en la consola si la solicitud falla.
            }
        },
        // Método para inicializar la tabla de datos con DataTables
        initializeDataTable() {
            this.$nextTick(() => {
                this.dataTableInstance = $('#tableData').DataTable({
                    data: this.conductores, // Asigna los datos de los conductores a la tabla.
                    columns: [
                        { data: 'id', className: 'text-center' }, // Columna para el ID.
                        { data: 'rut', className: 'text-center' }, // Columna para el RUT.
                        { data: 'nombre', className: 'text-center' }, // Columna para el nombre.
                        { data: 'fecha', className: 'text-center' }, // Columna para la fecha.
                        { data: 'rfid', className: 'text-center' }, // Columna para el código RFID.
                        {
                            data: null,
                            className: 'text-center',
                            orderable: false, // No permite ordenar esta columna.
                            searchable: false, // No permite buscar en esta columna.
                            createdCell: (cell) => {
                                $(cell).html(`
                    <button class="btn btn-warning btn-sm edit-button">Editar</button>
                    <button class="btn btn-danger btn-sm delete-button">Eliminar</button>
                  `); // Agrega botones de editar y eliminar en la celda.
                            }
                        },
                    ],
                    layout: {
                        topStart: {
                            buttons: [
                                'copyHtml5',
                                'excelHtml5',
                                'csvHtml5',
                                'pdfHtml5',
                                {
                                    text: 'Recargar',
                                    action: async (e, dt, node, config) => {
                                        dt.clear().draw();
                                        await this.reloadDataTable();
                                    }
                                }]
                        },
                        bottomStart: 'pageLength'
                    },
                });

                // Maneja el evento de clic en el botón de editar
                // Maneja el evento de clic en el botón de editar
                $('#tableData tbody').on('click', 'button.edit-button', (event) => {
                    const data = this.dataTableInstance.row($(event.target).closest('tr')).data();
                    this.editConductor(data); // Llama a la función para editar el conductor con los datos seleccionados.
                });

                // Maneja el evento de clic en el botón de eliminar
                $('#tableData tbody').on('click', 'button.delete-button', (event) => {
                    const data = this.dataTableInstance.row($(event.target).closest('tr')).data();
                    console.log('Eliminar clic: ', data); // Log para verificar los datos seleccionados.
                    this.deleteConductor(data.id); // Llama a la función para eliminar el conductor con el ID seleccionado.
                });
            });
        },
        // Método para recargar los datos de la tabla
        async reloadDataTable() {
            try {
                const response = await axios.get('https://interurbano.wit.la/card-rfid/php/read.php');
                this.dataTableInstance.clear().rows.add(response.data).draw(); // Recarga los datos en la tabla.
            } catch (error) {
                console.error('Error al recargar el DataTable:', error); // Muestra un error en la consola si la solicitud falla.
            }
        },
        // Método para mostrar el modal de creación
        showCreateModal() {
            this.selectedConductor = { id: null, rut: '', nombre: '', fecha: '', rfid: '' }; // Resetea el conductor seleccionado.
            this.dispCreateModal = true; // Muestra el modal.
            $('#usuarioModal').modal('show'); // Usa jQuery para mostrar el modal.
        },
        // Método para eliminar un conductor
        async deleteConductor(id) {
            console.log('ID para eliminar: ', id); // Log para verificar el ID del conductor a eliminar.
            if (confirm('¿Estás seguro de que deseas eliminar este conductor?')) { // Confirma la eliminación.
                try {
                    console.log('Llamando a la API para eliminar...'); // Log para verificar si se llama a la API.
                    const response = await axios.post('https://interurbano.wit.la/card-rfid/php/delete.php', {
                        id : id
                    });
                    console.log('Respuesta de la API: ', response.data); // Log para verificar la respuesta de la API.
                    if (response.data.success) {
                        await this.leerConductores(); // Vuelve a leer los conductores.
                        this.reloadDataTable(); // Recarga la tabla de datos.
                        alert(response.data.message); // Muestra un mensaje de éxito.
                    } else {
                        alert('Error al eliminar el conductor: ' + response.data.message); // Muestra un mensaje de error.
                    }
                } catch (error) {
                    console.error('Error al eliminar el conductor:', error); // Muestra un error en la consola si la solicitud falla.
                    alert('Error al eliminar el conductor.'); // Muestra una alerta de error.
                }
            }
        },

        // Método para editar un conductor
        editConductor(conductor) {
            this.selectedConductor = { ...conductor }; // Clona el conductor seleccionado.
            this.dispCreateModal = true; // Muestra el modal de edición.
            $('#usuarioModal').modal('show'); // Usa jQuery para mostrar el modal.
        },
        // Método para cerrar el modal
        closeModal() {
            this.dispCreateModal = false; // Oculta el modal.
            $('#usuarioModal').modal('hide'); // Usa jQuery para ocultar el modal.
        },
        // Método para manejar el evento de guardado del conductor
        async handleSave(conductor) {
            try {
                const url = conductor.id
                    ? 'https://interurbano.wit.la/card-rfid/php/update.php' // URL para actualizar si el ID existe.
                    : 'https://interurbano.wit.la/card-rfid/php/create.php'; // URL para crear si el ID no existe.
                const response = await axios.post(url, conductor); // Realiza una solicitud POST a la URL correspondiente con los datos del conductor.
                if (response.data.success) {
                    await this.leerConductores(); // Vuelve a leer los conductores.
                    this.reloadDataTable(); // Recarga la tabla de datos.
                    alert('Conductor guardado con éxito'); // Muestra un mensaje de éxito.
                } else {
                    alert('Error al guardar el conductor: ' + response.data.message); // Muestra un mensaje de error.
                }
            } catch (error) {
                console.error('Error al guardar el conductor:', error); // Muestra un error en la consola si la solicitud falla.
                alert('Error al guardar el conductor.'); // Muestra una alerta de error.
            } finally {
                this.closeModal(); // Cierra el modal.
            }
        },
    }
};
</script>