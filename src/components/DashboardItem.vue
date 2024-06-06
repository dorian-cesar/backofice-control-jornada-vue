<template>
    <div @click="$root.loadScreen=true" class="dashitem">
        <div>
            <i :class="icon" class="fa fa-4x fa-fw"></i>
            <p>{{ text }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        icon: String,
        text: String,
    }
}
</script>

<style scoped>
.dashitem {
    background-color: var(--sidebar-bg-color);
    width: 180px;
    min-width: 180px;
    max-width: 180px;
    aspect-ratio: 1/1;
    box-sizing: border-box;
    outline: 1px solid black;
    border-radius: 5px;
    text-align: center;
    color: var(--text-color);
    font-size: 1.3rem;
    margin: 10px;
    cursor: pointer;
	display: grid;
	align-items: center;
    box-shadow: 0px 0px 3px black;
    text-shadow: 0px 0px 3px black;
    border: 1px solid #b9bdff21;
    animation: scaleUp .15s;
    transition: all .1s;
}

.dashitem:hover {
    background-color: var(--navbar-bg-color);
    border: 1px solid #b9bcffb9;
    text-decoration: underline;
    outline: 1px solid white;
    padding-bottom: 15px;
    transform: scale(1.05);
}

@keyframes scaleUp {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

.dashitem::content {
    margin: auto;
}
</style>