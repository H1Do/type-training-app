<template>
    <div>AuthPage</div>
    <CButton @click="handleClick">asdf</CButton>
</template>

<script setup lang="ts">
import CButton from '@/components/UI/CButton.vue';

const handleClick = () => {
    console.log('Button clicked');
};
</script>

<style scoped lang="scss"></style>
