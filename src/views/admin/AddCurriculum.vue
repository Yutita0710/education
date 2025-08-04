<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">เพิ่มข้อมูลหลักสูตร</h1>

    <form @submit.prevent="saveCurriculum">
      <!-- ชื่อหลักสูตร -->
      <div class="mb-4">
        <label class="block font-medium mb-1">ชื่อหลักสูตร</label>
        <input 
          v-model="form.name" 
          type="text"
          required
          class="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <!-- รายละเอียด -->
      <div class="mb-4">
        <label class="block font-medium mb-1">รายละเอียด</label>
        <textarea 
          v-model="form.description"
          rows="3"
          class="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- ระดับการศึกษา -->
      <div class="mb-4">
        <label class="block font-medium mb-1">ระดับการศึกษา</label>
        <select 
          v-model="form.degree_id"
          required
          class="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- เลือกระดับการศึกษา --</option>
          <option
            v-for="degree in degrees"
            :key="degree.id"
            :value="degree.id"
          >
            {{ degree.name }}
          </option>
        </select>
      </div>

      <!-- ปีเริ่มต้น -->
      <div class="mb-4">
        <label class="block font-medium mb-1">ปีเริ่มต้น</label>
        <input 
          v-model="form.start_year" 
          type="number"
          min="2500"
          max="2600"
          required
          class="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <!-- ปีสิ้นสุด -->
      <div class="mb-4">
        <label class="block font-medium mb-1">ปีสิ้นสุด</label>
        <input 
          v-model="form.end_year" 
          type="number"
          min="2500"
          max="2600"
          required
          class="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <!-- สถาบันการศึกษา -->
      <div class="mb-4">
        <label class="block font-medium mb-1">สถาบันการศึกษา</label>
        <select 
          v-model="form.college_id"
          required
          class="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- เลือกระดับการศึกษา --</option>
          <option
            v-for="college in colleges"
            :key="college.id"
            :value="college.id"
          >
            {{ college.name }}
          </option>
        </select>
      </div>

      <!-- สถานะ -->
      <div class="mb-4">
        <label class="block font-medium mb-1">สถานะ</label>
        <select 
          v-model="form.active"
          class="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">ใช้งาน</option>
          <option value="0">ไม่ใช้งาน</option>
        </select>
      </div>

      <div class="flex gap-2">
        <button 
          type="submit"
          :disabled="isLoading"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">บันทึก</span>
          <span v-else>กำลังบันทึก...</span>
        </button>
        
        <button 
          type="button"
          @click="router.back()"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { addEducation, getColleges, getDegrees } from "@/services/apiService";
import Swal from "sweetalert2";

const router = useRouter();
const degrees = ref([]);
const colleges = ref([]);
const isLoading = ref(false);

// ใช้ reactive สำหรับ form data
const form = reactive({
  name: "",
  description: "",
  degree_id: "",
  start_year: "",
  end_year: "",
  college_id: "",
  active: 1
});

async function saveCurriculum() {
  // Basic validation
  if (!form.name.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'กรุณากรอกชื่อหลักสูตร',
      confirmButtonColor: '#3B82F6'
    });
    return;
  }

  if (!form.degree_id) {
    Swal.fire({
      icon: 'warning',
      title: 'กรุณาเลือกระดับการศึกษา',
      confirmButtonColor: '#3B82F6'
    });
    return;
  }

  if (parseInt(form.end_year) <= parseInt(form.start_year)) {
    Swal.fire({
      icon: 'warning',
      title: 'ปีสิ้นสุดต้องมากกว่าปีเริ่มต้น',
      confirmButtonColor: '#3B82F6'
    });
    return;
  }

  isLoading.value = true;

  try {
    // Convert string values to numbers where needed
    const submitData = {
      ...form,
      degree_id: parseInt(form.degree_id),
      start_year: form.start_year.toString(),
      end_year: form.end_year.toString(),
      college_id: parseInt(form.college_id),
      active: parseInt(form.active)
    };

    await addEducation(submitData);
    
    await Swal.fire({
      icon: 'success',
      title: 'บันทึกข้อมูลสำเร็จ!',
      text: 'ข้อมูลหลักสูตรถูกเพิ่มเรียบร้อยแล้ว',
      timer: 1500,
      showConfirmButton: false
    });

    router.push("/admin/curriculum");
  } catch (err) {
    console.error(err);
    
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      confirmButtonColor: '#EF4444'
    });
  } finally {
    isLoading.value = false;
  }
}

async function fetchDegrees() {
  try {
    const res = await getDegrees();
    degrees.value = res.data?.data || [];
  } catch (err) {
    console.error("Error fetching degrees:", err);
    
    Swal.fire({
      icon: 'error',
      title: 'ไม่สามารถโหลดข้อมูลระดับการศึกษา',
      text: 'กรุณาลองใหม่อีกครั้ง',
      confirmButtonColor: '#EF4444'
    });
  }
}
async function fetchColleges() {
  try {
    const res = await getColleges();
    colleges.value = res.data?.data || [];
  } catch (err) {
    console.error("Error fetching degrees:", err);
    
    Swal.fire({
      icon: 'error',
      title: 'ไม่สามารถโหลดข้อมูลสถานศึกษา',
      text: 'กรุณาลองใหม่อีกครั้ง',
      confirmButtonColor: '#EF4444'
    });
  }
}

onMounted(() => {
  fetchDegrees();
  fetchColleges();
});
</script>