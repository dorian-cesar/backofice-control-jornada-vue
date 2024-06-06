<template>
<table ref="table">
    <thead>
        <tr>
            <th @click="$parent.sortBy('id')">ID</th>
            <th @click="$parent.sortBy('rut')">RUT</th>
            <th @click="$parent.sortBy('nombre')">Nombre</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <template v-for="(item, index) in tdata" :key="index">
            <tr :class="item.estado?'':'inactive'">
                <td>{{ item.id }}</td>
                <td>{{ item.rut }}</td>
                <td>{{ item.nombre }}</td>
                <td>
                    <button @click="$parent.showCreateModal(item)" class="btn-table"><i class="fa fa-pencil fa-fw"></i></button>
                    <button @click="$parent.toggle(item)" class="btn-table"><i :class="item.activo?'':'inactive'" class="fa fa-eye fa-fw"></i></button>
                </td>
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