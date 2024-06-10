<template>
    <div class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nuevo Usuario</h5>
            <button type="button" class="close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="form-group">
                <label for="rut">RUT:</label>
                <input class="form-control" id="rut" type="text" v-model="user.rut" required>
              </div>
              <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input class="form-control" id="nombre" type="text" v-model="user.nombre" required>
              </div>
              <div class="form-group">
                <label for="fecha">Fecha:</label>
                <input class="form-control" id="fecha" type="date" v-model="user.fecha" required>
              </div>
              <div class="form-group">
                <label for="rfid">Código RFID:</label>
                <input class="form-control" id="rfid" type="text" v-model="user.rfid" required>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          rut: '',
          nombre: '',
          fecha: '',
          rfid: ''
        }
      };
    },
    methods: {
      saveUser() {
        // Implementa la lógica para guardar el nuevo usuario
        console.log('Guardando nuevo usuario:', this.user);
        // Luego puedes cerrar el modal
        this.closeModal();
      },
      closeModal() {
        this.$emit('close');
      }
    }
  };
  </script>
  