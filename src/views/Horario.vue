<template>
  <div class="content">
    <div class="viewContent">
      <h1>Control de Horario</h1>
      <table id="tableData" class="display">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Rut</th>
            <th>Tarjeta</th>
            <th>Patente</th>
            <th>Tipo</th>
            <th>Timestamp</th>
            <th>Método</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id" class="text-center">
            <td>{{ item.id }}</td>
            <td> Alexis </td>
            <td>{{ item.rut }}</td>
            <td> abcd12345 </td>
            <td>{{ item.patente }}</td>
            <td>{{ item.tipo }}</td>
            <td>{{ item.timestamp }}</td>
            <td>{{ item.metodo }}</td>
            <td> 09:00 </td>
            <td> 18:00 </td>
            <td> 09.00 </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      tableData: [],
      dataTableInstance: null,
    };
  },
  async mounted() {
    this.$root.loadScreen = true;
    await this.loadData();
    await this.initializeDataTable();
  },
  methods: {
    async loadData() {
      try {
        const response = await axios.get('https://interurbano.wit.la/inicio-salida-Jornada/php/apiLeerDatos.php');
        this.tableData = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async initializeDataTable() {
      this.$root.loadScreen = false;
      this.dataTableInstance = $('#tableData').DataTable({
        data: this.tableData,
        columns: [
          { data: 'id', className: 'text-center' },
          { data: null, defaultContent: 'Alexis', className: 'text-center' },
          { data: 'rut', className: 'text-center' },
          { data: null, defaultContent: 'abcd12345', className: 'text-center' },
          { data: 'patente', className: 'text-center' },
          { data: 'tipo', className: 'text-center' },
          { data: 'timestamp', className: 'text-center' },
          { data: 'metodo', className: 'text-center' },
          { data: null, defaultContent: '09:00', className: 'text-center' },
          { data: null, defaultContent: '18:00', className: 'text-center' },
          { data: null, defaultContent: '09.00', className: 'text-center' }
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
                  await this.reloadDataTable();
                }
              }]
          },
          bottomStart: 'pageLength'
        },
      });
    },
    async reloadDataTable() {
      this.$root.loadScreen = true;
      await this.loadData();
      this.dataTableInstance.clear().rows.add(this.tableData).draw();
      this.$root.loadScreen = false;
    }
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
