import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        token: null,
        level: null,
        name: null,
    }),
    actions: {
        setTokenAndAccessLevel(token, level, name) {
            this.token = token;
            this.level = level;
            this.name = name;
        },
        clearTokenAndAccessLevel() {
            this.token = null;
            this.level = null;
            this.name = null;
        }
    },
    created() {
        const storedState = localStorage.getItem(this.$id);
        if (storedState) {
            Object.assign(this, JSON.parse(storedState));
        }
        // Save state to localStorage whenever it changes
        this.$watch(
            () => ({
                token: this.token,
                level: this.level,
                name: this.name
            }),
            (newValue) => {
                localStorage.setItem(this.$id, JSON.stringify(newValue));
            },
            { deep: true }
        );
    }
});
