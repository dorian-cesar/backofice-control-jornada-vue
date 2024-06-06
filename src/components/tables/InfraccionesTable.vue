<template>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Patente</th>
                <th>Conductor</th>
                <th>Velocidad</th>
                <th>Latitud</th>
                <th>Longitud</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in tdata" :key="index">
                <td>{{ item.fecha }} {{ item.start_time }}</td>
                <td>{{ item.patente }}</td>
                <td>{{ item.conductor }}</td>
                <td>{{ item.speed }}</td>
                <td v-if="item.location">{{ item.location.lat }}</td>
                <td v-if="item.location">{{ item.location.lng }}</td>
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