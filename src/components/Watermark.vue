<template>
    <div class="watermark">
        <a href="https://www.wit.la">
            <p><i class="fa fa-power-off fa-fw"></i>&nbsp;Wit.la</p>
            <p><i class="fa fa-copyright fa-fw"></i>&nbsp;Copyright 2024</p>
            <p><i class="fa fa-registered fa-fw"></i>&nbsp;Todos los derechos reservados</p>
        </a>
    </div>
    <div ref="confdiv" class="confdiv">
        <i @click="hueShift()" class="fa fa-adjust fa-2x fa-fw widget-generic"></i>
        <i @click="soundToggle()" :class="$root.soundCtrl?'fa-volume-up':'fa-volume-off'" class="fa fa-fw fa-2x widget-generic"></i>
        <i @click="openWhatsApp()" class="fa fa-whatsapp fa-fw fa-2x widget-whatsapp"></i>
    </div>
</template>

<script>
export default {
    data() {
        return {
            skin: 'false',
        }
    },
    mounted() {
        if(localStorage.skin){
            this.skin = localStorage.skin;
            this.checkHue();
        }
    },
    watch: {
        skin(setting){
            localStorage.skin = setting;
            this.checkHue();
        }
    },
    methods: {
        // Abre un enlace a wa.me
        openWhatsApp() {
            const phoneNumber = '56963381392';
            const message = 'Necesito ayuda con el sistema de control de jornada';
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        },
        // Activa o desactiva el sonido de notificacion
        soundToggle(){
            this.$root.soundCtrl = !this.$root.soundCtrl;
        },
        // Activa o desactiva el filtro de color
        hueShift(){
            if(this.skin==='true'){
                this.skin = 'false';
            } else {
                this.skin = 'true'
            }
        },
        // Cambia el filtro de color
        checkHue(){
            if(this.skin==='true'){
                this.$refs.confdiv.style.filter = 'hue-rotate(-160deg)';
                document.documentElement.style.filter = 'hue-rotate(160deg)';
            } else {
                this.$refs.confdiv.style.filter = 'none';
                document.documentElement.style.filter = 'none';
            }
        }
    }
}
</script>

<style scoped>
.widget-whatsapp {
    background-color: #25D366;
    border-radius: 100%;
    color: var(--text-color);
    margin: 2px;
    height: max-content;
    padding: 5px;
    aspect-ratio: 1/1;
    transition: all .2s;
    outline: 1px solid black;
}
.widget-whatsapp:hover {
    background-color: #045e25;
    outline: 1px solid white;
    border-radius: 10%;
}
.widget-generic {
    background-color: rgba(104, 104, 104, 0.534);
    border-radius: 100%;
    color: var(--text-color);
    margin: 2px;
    height: max-content;
    padding: 5px;
    aspect-ratio: 1/1;
    transition: all .2s;
    outline: 1px solid black;
}
.widget-generic:hover {
    background-color: rgba(24, 24, 24, 0.733);
    outline: 1px solid white;
    border-radius: 10%;
}
.watermark {
    position: fixed;
    width: max-content;
    max-width: 80vw;
    right: 10px;
    bottom: 10px;
    text-shadow: 0px 0px 4px black;
    text-align: right;
    font-style: normal;
    border-radius: 5px;
    padding: 0.2rem;
    cursor: pointer;
    z-index: 5000;
    font-size: 1rem;
    transition: all .2s;
}

.watermark:hover {
    background-color: var(--navbar-bg-color);
}

.confdiv {
    position: fixed;
    width: max-content;
    left: 10px;
    bottom: 10px;
    text-shadow: 0px 0px 4px black;
    font-style: normal;
    border-radius: 5px;
    padding: 0.2rem;
    font-size: 1.3rem;
    cursor: pointer;
    z-index: 5001;
}

a {
    text-decoration: none;
    color: var(--text-color);
}

p {
    display: inline;
    font-style: normal;
    color: var(--text-color);
}

a:hover {
    color: var(--sidebar-bg-color);
}

</style>