<template>
  <div class="sidebar">
    <div @click="togglePanelC" class="sidelink">
      <i class="fa fa-fw" :class="mostrarPanelC ? 'fa-chevron-right' : 'fa-chevron-down'"></i> Panel de Control</div>
    <router-link to="/mapa/"><div v-if="mostrarPanelC" class="sidesublink"><i class="fa fa-globe fa-fw"></i> Mapa</div></router-link>
    <router-link to="/logs/"><div v-if="mostrarPanelC" class="sidesublink"><i class="fa fa-check fa-fw"></i> Infracciones</div></router-link>
    <!--<div v-if="mostrarPanelC" class="sidesublink"><i class="fa fa-bell-o fa-fw"></i> Notificaciones</div>-->
    <div @click="toggleConductores" class="sidelink">
      <i class="fa fa-fw" :class="mostrarConductores ? 'fa-chevron-right' : 'fa-chevron-down'"></i> Conductores</div>
    <router-link to="/conductores/1"><div v-if="mostrarConductores" class="sidesublink"><i class="fa fa-address-card fa-fw"></i> Perfiles</div></router-link>
    <router-link to="/vehiculos/1"><div v-if="mostrarConductores" class="sidesublink"><i class="fa fa-bus fa-fw"></i> Vehiculos</div></router-link>
    <!--<div v-if="mostrarConductores" class="sidesublink"><i class="fa fa-history fa-fw"></i> Historial</div>
    <div @click="toggleVisual" class="sidelink">
      <i class="fa fa-fw" :class="mostrarVisual ? 'fa-chevron-right' : 'fa-chevron-down'"></i> Visualización</div>
    <router-link to="/mapainter/"><div v-if="mostrarVisual" class="sidesublink"><i class="fa fa-map-marker fa-fw"></i> Mapa Interactivo</div></router-link>-->
    <!--<div v-if="mostrarVisual" class="sidesublink"><i class="fa fa-clock-o fa-fw"></i> Estado</div>-->
    <div @click="toggleInformes" class="sidelink">
      <i class="fa fa-fw" :class="mostrarInformes ? 'fa-chevron-right' : 'fa-chevron-down'"></i> Informes</div>
    <!--<div v-if="mostrarInformes" class="sidesublink"><i class="fa fa-file fa-fw"></i> Informe General</div>-->
    <div v-if="mostrarInformes" class="sidesublink"><i class="fa fa-file-text fa-fw"></i> Informe de Velocidad</div>
    <div v-if="mostrarInformes" class="sidesublink"><i class="fa fa-file-text-o fa-fw"></i> Informe de Marcación</div>
    <!--<div v-if="mostrarInformes" class="sidesublink"><i class="fa fa-folder-open fa-fw"></i> Historial de Informes</div>-->
    <template v-if="level>=5">
      <div @click="toggleConfig" class="sidelink"><i class="fa fa-fw" :class="mostrarConfiguracion ? 'fa-chevron-right' : 'fa-chevron-down'"></i> Configuración</div>
      <!--<router-link to="/empresas/1"><div v-if="mostrarConfiguracion" class="sidesublink"><i class="fa fa-building fa-fw"></i> Empresas</div></router-link>
      <router-link to="/tipos/1"><div v-if="mostrarConfiguracion" class="sidesublink"><i class="fa fa-car fa-fw"></i> Tipos</div></router-link>
      <router-link to="/tarjetas/1"><div v-if="mostrarConfiguracion" class="sidesublink"><i class="fa fa-id-card-o fa-fw"></i> Tarjetas</div></router-link>-->
      <template v-if="level>=10">
        <router-link to="/usuarios/1"><div v-if="mostrarConfiguracion" class="sidesublink"><i class="fa fa-users fa-fw"></i> Usuarios</div></router-link>
      </template>
    </template>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
export default {
    props: {
        urldata: Object
    },
    data() {
      return {
        mostrarConductores: false,
        mostrarVisual: false,
        mostrarInformes: false,
        mostrarPanelC: true,
        mostrarConfiguracion: false,
        level: useAuthStore().level,
      }
    },
    methods: {
      toggleAll() {
        this.mostrarConductores = false;
        this.mostrarVisual = false;
        this.mostrarInformes = false;
        this.mostrarPanelC = false;
        this.mostrarConfiguracion = false;
      },
      toggleConductores() {
        this.mostrarConductores = !this.mostrarConductores;
      },
      toggleVisual() {
        this.mostrarVisual = !this.mostrarVisual;
      },
      toggleInformes() {
        this.mostrarInformes = !this.mostrarInformes;
      },
      togglePanelC() {
        this.mostrarPanelC = !this.mostrarPanelC;
      },
      toggleConfig() {
        this.mostrarConfiguracion = !this.mostrarConfiguracion;
      },
    }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
.sidebar {
    background-color: var(--sidebar-bg-color);
    height: calc(100vh - var(--navbar-height));
    width: var(--sidebar-width);
    position: fixed;
    top: var(--navbar-height);
    overflow: auto;
    animation: slideRight .15s;
}

@keyframes slideRight {
  from {
    left: calc(var(--sidebar-width)*-1);
  }
  to {
    left: 0;
  }
}

.sidelink {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: antiquewhite;
  font-weight: bold;
  font-size: large;
  cursor: pointer;
  width: 90%;
  margin-left: auto;
  border-bottom-left-radius: 15px;
  border-top-left-radius: 15px;
}

.sidesublink {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  color: antiquewhite;
  font-weight: bold;
  cursor: pointer;
  width: 80%;
  margin-left: auto;
  border-bottom-left-radius: 15px;
  border-top-left-radius: 15px;
}

.sidelink:hover {
  background-color: var(--main-bg-color);
}

.sidesublink:hover {
  background-color: var(--main-bg-color);
  text-decoration: underline;
}
</style>