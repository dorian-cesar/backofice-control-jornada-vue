<template>
<table ref="table">
    <thead>
        <tr>
            <th @click="$parent.sortBy('track_id')">ID Tracker</th>
            <th @click="$parent.sortBy('patente')">Patente</th>
            <th @click="$parent.sortBy('driver')">Conductor</th>
            <th @click="$parent.sortBy('company_id')">Empresa</th>
            <th @click="$parent.sortBy('type')">Tipo</th>
            <th @click="$parent.sortBy('estado')">Ult. Estado</th>
            <th @click="$parent.sortBy('conexion')">Ult. Conexion</th>
            <th @click="$parent.sortBy('imei')">IMEI</th>
            <th></th>
        </tr>
    </thead>
    <tbody v-for="(item, index) in tdata" :key="index">
        <tr>
            <td>{{ item.track_id }}</td>
            <td>{{ item.patente }}</td>
            <td>
                <template v-if="item.driver">
                    {{ item.driver.nombre }}
                </template>
                <template v-else>
                    -
                </template>
            </td>
            <td>
                <template v-if="item.company">
                    {{ item.company.nombre }}
                </template>
                <template v-else>
                    -
                </template>
            </td>
            <td>
                <template v-if="item.vehicle_type">
                    {{ item.vehicle_type.tipo }}
                </template>
                <template v-else>
                    -
                </template>
            </td>
            <td>
                <template v-if="item.latest_log">
                    {{ item.latest_log.estado }}
                </template>
                <template v-else>
                    -
                </template>
            </td>
            <td>
                <template v-if="item.latest_log">
                    {{ item.latest_log.conexion }}
                </template>
                <template v-else>
                    -
                </template>
            </td>
            <td>{{ item.imei }}</td>
            <td>
                <button @click="$parent.showCreateModal(item)" class="btn-table"><i class="fa fa-pencil fa-fw"></i></button>
            </td>
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