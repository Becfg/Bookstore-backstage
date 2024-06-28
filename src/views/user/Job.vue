<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Job } from './type';
import { deleteJob, getJobList, postJob } from '@/apis/job';
import { ElMessage, ElTable } from 'element-plus';
import jobStore from '@/stores/job';

defineOptions({
  name: 'Job',
})

const tableData = ref<Job[]>([])

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Job[]>([])
const handleSelectionChange = (val: Job[]) => {
  multipleSelection.value = []
  //@ts-ignore
  val.forEach((item: Job) => multipleSelection.value.push(item.id))
  console.log(multipleSelection.value);
}

const visible = ref(false);
const jobForm = ref<Job>({
  name: '',
});

const handleAdd = () => {
  jobForm.value = {
    name: '',
  }
  visible.value = true;
}
const handleDelete = async () => {
  // @ts-ignore
  const jobToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

  for (const job of jobToDelete) {
    try {
      const res = await deleteJob(job.id as number);
      // @ts-ignore
      if (res && res?.id) {
        ElMessage.success(`Deleted job with id: ${job.id}`);
      } else {
        ElMessage
          .error(`Failed to delete job with id: ${job.id}`)
      }
    } catch (error) {
      ElMessage.error(`Failed to delete job with id: ${job.id}`);
    }
  }
  // @ts-ignore
  tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));

  console.log(tableData.value);
};

const submit = async (cb: Function) => {
  await cb(jobForm.value);
  await getJobs();
  visible.value = false;
}

const getJobs = async () => {
  const res = await getJobList();
  tableData.value = res as Job[];
  jobStore.value = tableData.value;
}

onMounted(() => {
  if (jobStore.value.length < 1) {
    getJobs();
  } else {
    tableData.value = jobStore.value;
  }
})
</script>

<template>
  <div class="job-list flex pa-5 flex-col gap-5">
    <div class="options">
      <el-button type="primary" @click="handleAdd">Add</el-button>
      <el-button type="danger" @click="handleDelete">Remove</el-button>
    </div>

    <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'id', order: 'ascending' }"
      style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column property="id" sortable label="ID" />
      <el-table-column property="name" label="Name" />
    </el-table>

    <el-dialog v-model="visible" :show-close="false" width="500">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header flex flex-row justify-between items-center">
          <h4 :id="titleId" :class="titleClass">{{ 'Add job' }}</h4>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left">
              <CircleCloseFilled />
            </el-icon>
            Close
          </el-button>
        </div>
      </template>

      <el-form label-width="auto" :model="jobForm" style="max-width: 600px">
        <el-form-item label="Name">
          <el-input v-model="jobForm.name" />
        </el-form-item>
      </el-form>

      <template #footer="">
        <el-button type="primary" @click="submit(postJob)">
          Submit
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>