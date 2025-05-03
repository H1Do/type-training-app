import { ref, onMounted, onUnmounted } from 'vue';

export function useTrainingTimer(interval = 200) {
    const now = ref(Date.now());
    let timer: number;

    onMounted(() => {
        timer = window.setInterval(() => {
            now.value = Date.now();
        }, interval);
    });

    onUnmounted(() => {
        clearInterval(timer);
    });

    return now;
}
