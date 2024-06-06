<template>
	<div class="content">
		<div class="viewContent">
			<h1>Control de Jornada</h1>
			<div class="content-group">
				<div class="search-group">
					<form @submit.prevent="handleSubmit">
						<label class="btn-export" for="from">Desde </label>
						<input @change="" ref="dateFrom" class="btn-export" type="date" name="from" id="datefrom" required>
						
						<label class="btn-export" for="to">Hasta </label>
						<input @change="lockDateMin()" ref="dateTo" class="btn-export" type="date" name="to" id="dateto" required>
						
						<label class="btn-export" for="tracker">Track ID</label>
						<input ref="tracker" class="btn-export" type="text" name="tracker" id="tracker" placeholder="Track ID o Patente" />
						
						<button class="btn-export" type="submit">Filtrar</button>
					</form>
				</div>
			</div>
			<table ref="tableData" id="tableData" class="display">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Rut</th>
						<th>Tarjeta</th>
						<th>Patente</th>
						<th>Track ID</th>
						<th>Entrada</th>
						<th>Salida</th>
						<th>Duración</th>
					</tr>
				</thead>
				<tbody ref="tableBody">
					<!--<tr v-for="(row, index) in tableDataRows" :key="index">
						<td>{{ row.driver }}</td>
						<td>{{ row.header }}</td>
						<td>{{ row.trackid }}</td>
						<td>{{ row.dateMark }} - {{ row.on_duty_time }}</td>
						<td>{{ row.dateMark }} - {{ row.off_duty_time }}</td>
						<td>{{ row.duration }}</td>
					</tr>-->
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import api from '@/api';
export default {
	data() {
		return {
			today: new Date(),
			tableDataRows: [],
			tableRef: null
		}
	},
	async mounted() {
		this.$root.loadScreen = true;
		let curDate = new Date();
		let yesterday = new Date(curDate.getTime() - (24*60*60*1000));
		this.$refs.dateTo.valueAsDate = curDate;
		this.$refs.dateFrom.valueAsDate = yesterday;
		this.$refs.dateTo.setAttribute('max', this.$refs.dateTo.value);
		this.$refs.dateTo.setAttribute('min', this.$refs.dateFrom.value);
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
		await this.fetchData();
		this.$root.loadScreen = false;
	},
	methods: {
		lockDateMin() {
			this.$refs.dateFrom.setAttribute('max', this.$refs.dateTo.value);
		},
		lockDateMax() {
			this.$refs.dateTo.setAttribute('min', this.$refs.dateFrom.value);
		},
		async fetchData() {
			try {
				let dateFrom = this.$refs.dateFrom.value;
				let dateTo = this.$refs.dateTo.value;
				let doTracker = '';
				if(this.$refs.tracker.value) {
					doTracker = `&tracker=${this.$refs.tracker.value}`;
				}
				const response = await api.get(`/gpsmarcar?from=${dateFrom}&to=${dateTo}${doTracker}`);
				if(response.data){
					const json = await response.data;
					this.tableDataRows = this.processData(json.sheets);
				} else {
					window.alert("No existen registros");
					$('#tableData').DataTable().clear();
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		processData(sheets) {
			let rowData = [];
			for (const sheet of sheets) {
				const days = sheet.sections[1].data;
				for (const day of days) {
					const rows = day.rows;
					for (const row of rows) {
						rowData.push({
							trackid: sheet.entity_ids[0],
							header: sheet.header,
							driver: row.driver.v,
							rut: sheet.rut?sheet.rut:'',
							hkey: sheet.key?sheet.key:'',
							on_duty_time: row.on_duty_time.v,
							off_duty_time: row.off_duty_time.v,
							duration: row.duration.v,
							dateMark: day.header.split(" ")[0].replaceAll("/","-"),
						});
					}
				}
			}
			$('#tableData').DataTable().clear();
			$('#tableData').DataTable().page(1);
			rowData.forEach(item => {
				$('#tableData').DataTable().row.add([
				item.driver,
				item.rut,
				item.hkey,
				item.header,
				item.trackid,
				item.dateMark + " - " + item.on_duty_time,
				item.dateMark + " - " + item.off_duty_time,
				item.duration
				]).draw(false);
				/*
				const trIn = document.createElement('tr');
				var tdIn = {
					nombre: document.createElement('td'),
					patente: document.createElement('td'),
					trackid: document.createElement('td'),
					entrada: document.createElement('td'),
					salida: document.createElement('td'),
					duracion: document.createElement('td'),
				};
				tdIn.nombre.textContent = item.driver;
				tdIn.patente.textContent = item.header;
				tdIn.trackid.textContent = item.trackid;
				tdIn.entrada.textContent = item.dateMark + " - " + item.on_duty_time;
				tdIn.salida.textContent = item.dateMark + " - " + item.off_duty_time;
				tdIn.duracion.textContent = item.duration;

				trIn.append(tdIn.nombre);
				trIn.append(tdIn.patente);
				trIn.append(tdIn.trackid);
				trIn.append(tdIn.entrada);
				trIn.append(tdIn.salida);
				trIn.append(tdIn.duracion);
				this.$refs.tableBody.appendChild(trIn);*/
			});
			return rowData;
		},
		async handleSubmit() {
			try {
				this.$root.loadScreen = true;
				await this.fetchData();
				this.$root.loadScreen = false;
			} catch (error) {
				this.$root.loadScreen = false;
				console.error('Error al traer datos:', error);
			}
		}
	}
}
</script>

<style scoped>
.display {
	max-height: 640px;
	overflow-y: auto;
}
input[type="text"]{
	cursor: text;
}
input[type="date"]{
	color: white;
}
</style>