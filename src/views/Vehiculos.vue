<template>
    <div class="content">
        <div class="viewContent">
            <h1>Vehiculos</h1>
            <table id="tableData" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patente</th>
                        <th>IMEI</th>
                        <th>Conexión</th>
                        <th>Ultima Conexón</th>
                        <th>Estado</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    async mounted() {
        this.$root.loadScreen = true;

        const initializeDataTable = () => {
            return new Promise(resolve => {
                $(document).ready(function() {
                    $('#tableData').DataTable({
                        ajax: {
                            url: 'https://dev.wit.la/api/wsbuses',
                            dataSrc: '',
                        },
                        language: {
                            url: "/esCLDT.json"
                        },
                        processing: true,
                        layout: {
                            topStart: {
                                buttons: [
                                    'copyHtml5',
                                    'excelHtml5',
                                    'csvHtml5',
                                    'pdfHtml5',
                                    {
                                        text: 'Recargar',
                                        action: function (e, dt, node, config) {
                                            dt.clear().draw();
                                            dt.ajax.reload();
                                        }
                                    }]
                            },
                            bottomStart: 'pageLength'
                        },
                        columns: [
                            { data: 'id' },
                            { data: 'patente' },
                            { data: 'imei' },
                            { data: 'connection_status' },
                            { data: 'ultima-conexion'},
                            { data: 'movement_status' },
                        ],
                        columnDefs: [
                            {className: "dt-center", "targets": "_all"}
                        ],
                        initComplete: function() {
                            resolve();
                        }
                    });
                });
            });
        };
        await initializeDataTable();
        this.$root.loadScreen = false;
    },
}
</script>
