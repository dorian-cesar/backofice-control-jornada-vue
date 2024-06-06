<template>
<table ref="table">
    <thead>
        <tr>
            <th @click="$parent.sortBy('id')">ID</th>
            <th @click="$parent.sortBy('nombre')">Nombre</th>
            <th @click="$parent.sortBy('rut')">RUT</th>
            <th @click="$parent.sortBy('vehicle')">Tracker ID</th>
            <th @click="$parent.sortBy('smartcard')">Tarjeta</th>
        </tr>
    </thead>
    <tbody>
        <template v-for="(item, index) in tdata" :key="index">
            <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.first_name }} {{ item.last_name }}</td>
                <td>{{ item.personnel_number }}</td>
                <td>{{ item.tracker_id }}</td>
                <td>{{ item.hardware_key }}</td>
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