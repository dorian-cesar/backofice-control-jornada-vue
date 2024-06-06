<template>
<div class="plate" :class="niveles[getLevel(data.speed)]">
    <h4><i class="fa fa-exclamation-triangle fa-fw"></i> {{ niveles[getLevel(data.speed)] }}</h4>
    <span>{{ data.patente }} - Velocidad: {{ data.speed }}Km/h</span>
    <span><b>{{ data.date }}</b></span>
</div>
</template>

<script>
export default {
    props: {
        data: Object,
    },
    data() {
        return {
            niveles: ['Alerta', 'Advertencia', 'Critico'],
        }
    },
    methods: {
        getLevel(speedIn) {
            var lvl = 0;
            if(speedIn >= 115) {
                lvl = 1;
            }
            if(speedIn >= 120) {
                lvl = 2;
            }
            return lvl;
        }
    }
}
</script>

<style scoped>
</style>