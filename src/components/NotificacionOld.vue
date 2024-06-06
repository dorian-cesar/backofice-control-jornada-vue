<template>
<div class="plate" :class="data.severity<=2?niveles[data.severity]:''">
    <h4><i class="fa fa-exclamation-triangle fa-fw"></i> {{ niveles[data.severity] }}</h4>
    <p>{{ data.vehicle_log&&data.vehicle_log.vehicle?data.vehicle_log.vehicle.patente:'' }} {{ data.content }}</p>
    <h4>{{ data.formatted_updated_at }}</h4>
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
}
</script>

<style scoped>
.plate {
    background-color: var(--alerta-bg-color);
    box-sizing: border-box;
    color: var(--text-color);
    text-shadow: 0px 0px 3px black;
    border: 1px solid #b9bdff21;
    width: 100%;
    height: 80px;
    max-height: 80px;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 20px;
}

.Advertencia {
    background-color: var(--advertencia-bg-color);
}

.Critico {
    background-color: var(--critico-bg-color);
}

.plate h4 {
    color: var(--text-color);
    font-weight: bold;
    display: block;
}

.plate p {
    text-align: justify;
}
</style>