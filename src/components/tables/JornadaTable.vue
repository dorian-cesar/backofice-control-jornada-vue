<template>
<table ref="table">
    <thead>
        <tr>
            <th @click="$parent.sortBy('id')">ID</th>
            <th @click="$parent.sortBy('driver')">Conductor</th>
            <th @click="$parent.sortBy('smartcard')">Tarjeta</th>
            <th @click="$parent.sortBy('event')">Evento</th>
            <th @click="$parent.sortBy('vehicle')">Vehiculo</th>
            <th @click="$parent.sortBy('company')">Empresa</th>
            <th @click="$parent.sortBy('formatted_updated_at')">Fecha</th>
        </tr>
    </thead>
    <tbody>
        <template v-for="(item, index) in tdata" :key="index">
            <tr>
                <td>{{ item.id }}</td>
                <td>
                    <template v-if="item.driver">
                        {{ item.driver.nombre }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </td>
                <td>
                    <template v-if="item.driver.smartcard">
                        {{ item.driver.smartcard.number }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </td>
                <td>{{ item.event }}</td>
                <td>
                    <template v-if="item.driver.vehicle">
                        {{ item.driver.vehicle.patente }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </td>
                <td>
                    <template v-if="item.driver.vehicle&&item.driver.vehicle.company">
                        {{ item.driver.vehicle.company.nombre }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </td>
                <td>{{ item.formatted_updated_at }}</td>
            </tr>
        </template>
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