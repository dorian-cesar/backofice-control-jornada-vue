<template>
<table ref="table">
    <thead>
        <tr>
            <th @click="$parent.sortBy('id')">ID</th>
            <th @click="$parent.sortBy('sim')">Numero SIM</th>
            <th @click="$parent.sortBy('vehicle')">Vehiculo</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in tdata" :key="index">
            <td>{{ item.id }}</td>
            <td>{{ item.sim }}</td>
            <td>
                <template v-if="item.vehicle">
                    {{ item.vehicle.patente }}
                </template>
                <template v-else>
                    -
                </template>
            </td>
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