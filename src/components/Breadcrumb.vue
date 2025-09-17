<template>
  <nav aria-label="Breadcrumb">
    <ul class="flex space-x-3 items-center">
      <li>
        <router-link
          to="/admin/curriculum"
          class="flex items-center space-x-2 text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 -mt-[4px]"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2 12.204c0-2.289 0-3.433.52-4.381c.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2s2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715S22 9.915 22 12.203v1.522c0 3.9 0 5.851-1.172 7.063S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.626 2 13.725z"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M11.25 18a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0z"
            />
          </svg>
          <p class="leading-none font-bold">หน้าหลัก</p>
        </router-link>
      </li>

      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        :aria-current="index === breadcrumbs.length - 1 ? 'page' : null"
      >
        <div class="flex items-center">
          <svg
            class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>

          <template v-if="index === breadcrumbs.length - 1">
            <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2">{{
              crumb.name
            }}</span>
          </template>
          <template v-else>
            <router-link
              :to="crumb.path"
              class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2"
            >
              {{ crumb.name }}
            </router-link>
          </template>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
  return route.matched
    .filter((r) => r.meta && r.meta.breadcrumb)
    .map((r) => ({
      name: r.meta.breadcrumb,
      path: r.path,
    }));
});
</script>

