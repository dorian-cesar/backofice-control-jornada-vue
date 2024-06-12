<template>
  <div class="modal fade" id="usuarioModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">{{ conductor.id ? 'Editar Usuario' : 'Nuevo Usuario' }}</h5>
                  <button type="button" class="close" @click="closeModal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
                  <form @submit.prevent="saveConductor">
                      <div class="form-group">
                          <label for="rut">RUT</label>
                          <input type="text" class="form-control" v-model="conductor.rut" required>
                      </div>
                      <div class="form-group">
                          <label for="nombre">Nombre</label>
                          <input type="text" class="form-control" v-model="conductor.nombre" required>
                      </div>
                      <div class="form-group">
                          <label for="fecha">Fecha</label>
                          <input type="date" class="form-control" v-model="conductor.fecha" required>
                      </div>
                      <div class="form-group">
                          <label for="rfid">Código RFID</label>
                          <input type="text" class="form-control" v-model="conductor.rfid" required>
                      </div>
                      <button type="submit" class="btn btn-primary">Guardar</button>
                  </form>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
      conductor: Object
  },
  methods: {
      saveConductor() {
          this.$emit('saved', this.conductor); // Emite el evento 'saved' con los datos del conductor.
      },
      closeModal() {
          this.$emit('close'); // Emite el evento 'close' para cerrar el modal.
      }
  }
};
</script>
