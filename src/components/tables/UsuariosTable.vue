<template>
<table ref="table">
    <thead>
        <tr>
            <th @click="$parent.sortBy('id')">ID</th>
            <th @click="$parent.sortBy('name')">Nombre</th>
            <th @click="$parent.sortBy('email')">Correo</th>
            <th @click="$parent.sortBy('level')">Nivel</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <template v-for="(item, index) in tdata" :key="index">
            <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.level }}</td>
                <td>
                    <button @click="$parent.showCreateModal(item)" class="btn-table"><i class="fa fa-pencil fa-fw"></i></button>
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