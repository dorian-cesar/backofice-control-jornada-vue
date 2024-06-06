<template>
<div class="userbar">
    <div class="userlink">Informacion</div>
    <div @click="logout()" class="userlink">Cerrar Sesion</div>
</div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
import { socket } from '@/WebSocket.js';
import api from '@/api';

export default {
  methods: {
    logout() {
      socket.close();
      const token = useAuthStore().token;
      if(token!=null){
      api.post('/logout', null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        useAuthStore().clearTokenAndAccessLevel();
        this.$root.navEnable = false;
        this.$router.go();
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
      }
    }
  },
};
</script>

<style scoped>
.userbar {
    background-color: var(--sidebar-bg-color);
    height: fit-content;
    width: var(--userbar-width);
    position: fixed;
    right:0;
    top: var(--navbar-height);
    box-shadow: 0px 0px 3px black;
    z-index: 996;
    animation: slideDown .15s;
}

@keyframes slideDown {
  from {
    top: 0;
  }
  to {
    top: var(--navbar-height);
  }
}

.userlink {
  display: flex;
  align-items: center;
  justify-content: right;
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: antiquewhite;
  font-weight: bold;
  font-size: large;
  cursor: pointer;
  width: 100%;
}

.userlink:hover {
  text-decoration: underline;
  background-color: var(--navbar-bg-color);
}
</style>