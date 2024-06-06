// Inicia el Web
import { ref } from 'vue';

const socket = new WebSocket('wss://masgps.witservices.io/api-v2/event/subscription');

const receivedMessages = ref([]);

const handleMessage = (event) => {
  const message = JSON.parse(event.data);
  receivedMessages.value.push(message);
};

socket.addEventListener('message', handleMessage);

export { socket, receivedMessages };