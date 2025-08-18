<script setup>
import { ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const selected = ref(null)
const options = [
  { value: 1, label: 'Apple' },
  { value: 2, label: 'Banana' },
  { value: 3, label: 'Cherry' },
  { value: 4, label: 'Durian' },
  { value: 5, label: 'Mango' }
]
</script>

<template>
  <div class="w-64">
    <v-select
      v-model="selected"
      :options="options"
      label="label"
      placeholder="ค้นหา..."
      :filterable="true"
      class="custom-vselect"
    />
  </div>
</template>