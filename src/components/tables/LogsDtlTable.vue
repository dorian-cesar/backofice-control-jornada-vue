<template>
    <table>
        <thead>
            <tr>
                <th @click="$parent.sortBy('created_at')">Fecha y Hora</th>
                <th @click="$parent.sortBy('velocidad')">Velocidad</th>
                <th @click="$parent.sortBy('lat')">Latitud</th>
                <th @click="$parent.sortBy('lng')">Longitud</th>
                <th @click="$parent.sortBy('conexion')">Conexión</th>
                <th @click="$parent.sortBy('estado')">Estado</th>
                <th @click="$parent.sortBy('ignicion')">Ignición</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in tdata" :key="index">
                <td>{{ item.created_at.split('T')[0] }} {{ item.created_at.split('T')[1].split('.')[0] }}</td>
                
                <td :style="item.velocidad>45?'background-color:gray':''"><i v-if="item.velocidad>45" class="fa fa-exclamation-triangle fa-fw"></i>{{ item.velocidad }}Km/h</td>
                <td>{{ item.lat }}</td>
                <td>{{ item.lng }}</td>
                <td>{{ item.conexion }}</td>
                <td>{{ item.estado }}</td>
                <td>{{ item.ignicion ? 'Si' : 'No' }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        tdata: Object,
    }
}
</script>