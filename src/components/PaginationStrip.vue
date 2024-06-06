<template>
<div class="paginate-segment">
    <template v-for="(item, index) in links" :key="index">
    <router-link :class="item.label!=$route.params.page?'btn-paginate':'btn-paginate btn-paginate-sel'" :to="{name: routeName, params: { page: item.url.split('=')[1], sort: this.$route.params.sort, dir: this.$route.params.dir, query: this.$route.params.query}}">
        <div>{{ item.label }}</div>
    </router-link>
    </template>
</div>
</template>

<script>
export default {
    props: {
        links: [Object, String],
        routeName: String,
    }
}
</script>