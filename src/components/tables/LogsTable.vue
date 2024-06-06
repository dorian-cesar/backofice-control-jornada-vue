<template>
    <table>
        <thead>
            <tr>
                <th @click="$parent.sortBy('updated_at')">Fecha</th>
                <th @click="$parent.sortBy('patente')">Patente</th>
                <th @click="$parent.sortBy('driver')">Conductor</th>
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
                <td>{{ item.formatted_updated_at }}</td>
                <td>
                    <template v-if="item.vehicle">
                        {{ item.vehicle.patente }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </td>
                <td>
                    <template v-if="item.vehicle.driver">
                        {{ item.vehicle.driver.nombre }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </td>
                <td :class="item.velocidad>45?'Advertencia':''">{{ item.velocidad }}Km/h</td>
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
    },
}
</script>

<style scoped>
.Advertencia {
    background-color: var(--advertencia-bg-color);
}
</style>