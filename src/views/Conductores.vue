<template>
    <div class="content">
        <div class="viewContent">
            <h1>Conductores</h1>
            <table id="tableData" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>RUT</th>
                        <th>Tracker ID</th>
                        <th>Tarjeta</th>
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
                            url: 'https://dev.wit.la/api/gpsemploy',
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
                                            dt.ajax.reload();
                                        }
                                    }]
                            },
                            bottomStart: 'pageLength'
                        },
                        columns: [
                            { data: 'id' },
                            { data: null,
                                render: function(data, type, row) {
                                    return row.first_name + ' ' + row.last_name;
                                }
                            },
                            { data: 'personnel_number' },
                            { data: 'tracker_id' },
                            { data: 'hardware_key' },
                        ],
                        columnDefs: [
                            {"className": "dt-center", "targets": "_all"}
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
