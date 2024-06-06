<template>
    <div class="viewContent">
        <br>
        <div class="dashContent">
            <router-link to="/mapa/"><DashboardItem :icon="'fa-globe'" :text="'Mapa'"></DashboardItem></router-link>
            <router-link to="/estados/1"><DashboardItem :icon="'fa-calendar'" :text="'Control Jornadas'"></DashboardItem></router-link>
            <router-link to="/logs/1"><DashboardItem :icon="'fa-tachometer'" :text="'Infracciones'"></DashboardItem></router-link>
            <router-link to="/conductores/1"><DashboardItem :icon="'fa-address-card'" :text="'Conductores'"></DashboardItem></router-link>
            <router-link to="/vehiculos/1/track_id/desc"><DashboardItem :icon="'fa-bus'" :text="'Vehiculos'"></DashboardItem></router-link>
            <!--<DashboardItem :icon="'fa-history'" :text="'Historial'"></DashboardItem>-->
            <!--<DashboardItem :icon="'fa-clock-o'" :text="'Estado'"></DashboardItem>-->
            <template v-if="level>=5">
                <!--<router-link to="/empresas/1"><DashboardItem :icon="'fa-building'" :text="'Empresas'"></DashboardItem></router-link>
                <router-link to="/tipos/1"><DashboardItem :icon="'fa-car'" :text="'Tipos de Vehiculo'"></DashboardItem></router-link>
                <router-link to="/tarjetas/1"><DashboardItem :icon="'fa-id-card-o'" :text="'Tarjetas'"></DashboardItem></router-link>-->
                <template v-if="level>=10">
                    <router-link to="/usuarios/1"><DashboardItem :icon="'fa-users'" :text="'Usuarios'"></DashboardItem></router-link>
                </template>
            </template>
            <router-link to="/Horario/1/"><DashboardItem :icon="'fa-hourglass'" :text="'Control Horario'"></DashboardItem></router-link>
        </div>
    </div>
</template>
<script>
import { useAuthStore } from '@/store/auth';
import DashboardItem from '@/components/DashboardItem.vue';
import LoadingScreen from '@/components/LoadingScreen.vue'

export default {
    data() {
        return {
            level: useAuthStore().level,
        }
    },
    components: {
        DashboardItem,
    },
}
</script>

<style scoped>
a {
    text-decoration: none;
}
.dashContent {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}

@media (max-width: 1280px) {
    .dashContent{
        justify-content: flex-start;
    }
}

</style>