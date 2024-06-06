<!--No usada-->
<template>
    <div class="btn-strip">
        <button @click="exportCSV" class="btn-export"><i class="fa fa-file-text-o fa-fw"></i>CSV</button>
        <button @click="exportExcel" class="btn-export"><i class="fa fa-file-excel-o fa-fw"></i>Excel</button>
        <button @click="copyToClipboard" class="btn-export"><i class="fa fa-files-o fa-fw"></i>Copiar</button>
        <button @click="printData" class="btn-export"><i class="fa fa-print fa-fw"></i>Imprimir</button>
    </div>
    <span id="snackbar">Copiado!</span>
</template>

<script>
import * as XLSX from 'xlsx';
export default {
    props: {
        indata: Object,
    },
    data() {
        return {
            CSVData: '',
        }
    },
    methods: {
        // Va a fallar si se desactivan los popups
        async printData(){
            this.$root.loadScreen = true;
            let exdata = await this.$parent.makeObject();

            var printable = window.open('');

            var tableOut = document.createElement('table');
            tableOut.style.width = "100%";
            tableOut.style.textAlign = "center";
            tableOut.style.border = "1px solid black";
            tableOut.style.borderCollapse = "collapse";
            var trOut = document.createElement('tr');

            for (const [key] of Object.entries(exdata[0])) {
                var thIn = document.createElement('th');
                thIn.style.border = "1px solid black";
                thIn.textContent = key;
                trOut.appendChild(thIn);
		    }

            tableOut.appendChild(trOut);


            exdata.forEach(item => {
                var tbOut = document.createElement('tr');
                for (const [key, value] of Object.entries(item)) {
                    var tdIn = document.createElement('td');
                    tdIn.style.border = "1px solid black";
                    tdIn.textContent = value;
                    tbOut.appendChild(tdIn);
                }
                tableOut.appendChild(tbOut);
            });

            printable.document.body.appendChild(tableOut);

            printable.print();
            this.$root.loadScreen = false;
        },
        async exportCSV(){
            this.$root.loadScreen = true;
            // Traemos los datos desde el padre
            let exdata = await this.$parent.prepareCSV();
            var CSVData = exdata.csv;
            var filename = exdata.name;

            // Crear un blob
            var blob = new Blob([CSVData], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);

            // Crear un link
            var lnk = document.createElement('a');
            lnk.href = url;
            lnk.setAttribute('download', filename);
            lnk.click();
            this.$root.loadScreen = false;
        },
        async exportExcel() {
            this.$root.loadScreen = true;
            // Traemos los datos desde el padre
            let exdata = await this.$parent.prepareExcel();
            let data = XLSX.utils.json_to_sheet(exdata.xls);
            const filename = exdata.name;

            // Creamos un libro
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, data, filename);

            // Guardamos el archivo
            XLSX.writeFile(workbook, filename);
            this.$root.loadScreen = false;
        },
        async copyToClipboard() {
            this.$root.loadScreen = true;
            // Traemos los datos desde el padre
            let exdata = await this.$parent.prepareCSV('\t');
            navigator.clipboard.writeText(exdata.csv);

            var sb = document.getElementById("snackbar");
            sb.className = "show";
            setTimeout(()=>{ sb.className = sb.className.replace("show", ""); }, 3000);
            this.$root.loadScreen = false;
        }
    }
}
</script>