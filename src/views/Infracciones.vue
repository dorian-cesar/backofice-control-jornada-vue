<template>
    <div class="content">
        <div class="viewContent">
            <h1>Infracciones de Velocidad</h1>
            <table id="tableData" class="display">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Patente</th>
                        <th>Conductor</th>
                        <th>Velocidad</th>
                        <th>Coordenadas</th>
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
                            url: 'https://dev.wit.la/api/gpsalert',
                            dataSrc: '',
                        },
                        language: {
                            url: "/esCLDT.json"
                        },
                        processing: true,
                        order: [[0, 'desc']],
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
                            { data: null, render: function(data,type,row) {
                                return row.fecha + ' ' + row.start_time;
                            } },
                            { data: 'patente' },
                            { data: 'conductor' },
                            { data: null, render: function(data,type,row) {
                                return row.speed + 'Km/h';
                            } },
                            { data: null, className: "dt-center clickable", render: function(data,type,row) {
                                return row.location.lat + ', ' + row.location.lng;
                            } },
                        ],
                        columnDefs: [
                            {className: "dt-center", "targets": "_all"}
                        ],
                        createdRow: function (row, data, index) {
                            var lastCell = $('td', row).eq(-1);
                            lastCell.on('mousedown', function (event) {
                                if (event.which === 1 || event.which === 2) {
                                    var latLng = data.location.lat + ',' + data.location.lng;
                                    var googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + latLng;
                                    window.open(googleMapsUrl, '_blank');
                                }
                            });
                        },
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

<style>
.clickable {
    cursor: pointer;
}
.clickable:hover {
    font-weight: bold;
    text-decoration: underline;
}
</style>