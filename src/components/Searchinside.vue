<template>
  <div class="mb-4 relative">
    <label class="block font-bold mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Input Search -->
    <input
      v-model="search"
      type="text"
      :placeholder="placeholder"
      @input="filterItems"
      @focus="showDropdown = true"
      @blur="hideDropdown"
      class="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-200"
      :required="required"
    />

    <!-- Dropdown -->
    <ul
      v-show="showDropdown && filteredItems.length"
      class="absolute z-50 w-full max-h-60 bg-white border border-gray-200 rounded-xl overflow-y-auto shadow-lg mt-1"
    >
      <li
        v-for="item in filteredItems"
        :key="item.id"
        @mousedown.prevent="selectItem(item)"
        class="px-4 py-2 cursor-pointer hover:bg-blue-100 rounded-lg"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  placeholder: { type: String, default: "กรุณาเลือกระดับการศึกษา..." },
  required: { type: Boolean, default: false },
  fetchFunction: { type: Function, required: true }, // async function ดึงข้อมูล
});

const emit = defineEmits(["select"]);

const search = ref("");
const items = ref([]);
const filteredItems = ref([]);
const showDropdown = ref(false);

// ดึงข้อมูลจาก API
const loadItems = async () => {
  try {
    const res = await props.fetchFunction(search.value.trim());
    items.value = res || [];
    filteredItems.value = [...items.value];
  } catch (err) {
    console.error("Error loading items:", err);
  }
};

const filterItems = () => {
  const query = search.value.toLowerCase().trim();
  if (!query) {
    filteredItems.value = [...items.value];
  } else {
    filteredItems.value = items.value.filter((i) =>
      i.name.toLowerCase().includes(query)
    );
  }
};

const selectItem = (item) => {
  search.value = item.name;
  showDropdown.value = false;
  emit("select", item);
};

const hideDropdown = () => {
  setTimeout(() => (showDropdown.value = false), 150);
};

// โหลดครั้งแรก
onMounted(() => {
  loadItems();
});

// คอยโหลดใหม่เมื่อ search เปลี่ยน (optional)
watch(search, () => {
  filterItems();
});
</script>
