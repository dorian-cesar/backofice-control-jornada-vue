<template>
    <header>
      <template class="navcontent-left">
        <router-link @click="$root.closeBars()" to="/"><div class="navlink">Dashboard</div></router-link>
      </template>
      <template class="navcontent-right">
        <div :class="$root.newAlerta?'notification-on':''" @click="toggleNotif();$root.newAlerta=false" class="navlink"><i :class="$root.newAlerta?'fa fa-bell fa-fw':'fa fa-bell-o fa-fw'"></i> Alertas </div>
        <div @click="toggleUserbar()" class="navlink"><i class="fa fa-user fa-fw"></i> {{ nombre }} <i class="fa fa-chevron-down fa-fw"></i></div>
      </template>
    </header>
    <component v-if="mostrarUserbar" :is="'UserBar'"></component>
    <component v-if="mostrarSidebar" :is="'SideBar'"></component>
    <div class="menubutton" @click="toggleSidebar()">
        <i class="fa fa-bars fa-fw"></i>Menú
    </div>

    <div v-if="mostrarNotif" class="notification-area">
      <template v-for="(item,index) in $root.alertNew" :key="index">
        <Notificacion :data="item"/>
      </template>
    </div>

</template>

<script>
import UserBar from '@/components/UserBar.vue';
import SideBar from '@/components/SideBar.vue';
import Notificacion from '@/components/Notificacion.vue'
import { useAuthStore } from '@/store/auth';
export default {
    components: {
        UserBar,
        SideBar,
		    Notificacion,
    },
    props: {
        urldata: Object
    },
    data() {
      return {
        mostrarUserbar: false,
        mostrarSidebar: false,
        mostrarNotif: false,
        nombre: useAuthStore().name,
      }
    },
    methods: {
      async toggleNotif() {
        this.mostrarNotif = !this.mostrarNotif;
        this.mostrarUserbar = false;
      },
      toggleUserbar() {
        this.mostrarUserbar = !this.mostrarUserbar;
        this.mostrarNotif = false;
      },
      toggleSidebar() {
        if(this.mostrarSidebar){
            document.getElementsByClassName('content')[0].classList.remove('opened');
        } else {
            document.getElementsByClassName('content')[0].classList.add('opened');
        }
        this.mostrarSidebar = !this.mostrarSidebar;
      },
    }
}
</script>

<style scoped>
.notification-on {
  background-color:var(--critico-bg-color);
}

.notification-area {
  position: fixed;
  top: var(--navbar-height);
  right: 0px;
  width: 400px;
  max-width: 400px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  z-index: 996;
  animation: slideDown .15s;
}

@keyframes slideDown {
  from {
    top: -400px;
  }
  to {
    top: var(--navbar-height);
  }
}

header {
  background-color: var(--navbar-bg-color);
  width: 100%;
  height: var(--navbar-height);
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: calc(var(--sidebar-width)/2);
  box-shadow: 0px 0px 4px black;
  z-index: 997;
}

.navcontent-left {
  float: left;
  display: flex;
  justify-content: space-between;
}

.navcontent-right {
  float: right;
  display: flex;
  justify-content: space-between;
}

a {
  color: antiquewhite;
  font-weight: bold;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  text-decoration: none;
}

.navlink {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  color: antiquewhite;
  font-weight: bold;
  cursor: pointer;
  font-size: larger;
  transition: all .2s;
  border-bottom: 0px solid var(--sidebar-bg-color);
}

.navlink:hover {
  background-color: var(--navbar-select-color);
  border-bottom: 5px solid var(--sidebar-bg-color);
}
</style>