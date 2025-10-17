<template>
  <div class="feature-icon">
    <q-icon :name="icon" size="lg" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
}>()
</script>

<style scoped lang="scss">
.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: #003366;
  color: white;
}
</style>