<script setup lang="ts">
import { deleteUser, getUserList, postUser, putUser } from '@/apis/user';
import { ElMessage, ElTable } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Job, User } from './type';
import { userStore } from '@/stores/user';
import jobStore from '@/stores/job';

defineOptions({
  name: 'userList',
})

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = []
  //@ts-ignore
  val.forEach((item: User) => multipleSelection.value.push(item.id))
  console.log(multipleSelection.value);

}

const tableData = ref<User[]>([])
const dolgTitleMap = ref({
  'add': 'Add User',
  'edit': 'Edit User',
  'dele': 'Delete User'
})
const dolgTitle = ref('add');

const handleClick = (row: User) => {
  console.log(row);
  dolgTitle.value = 'edit';
  userForm.value = JSON.parse(JSON.stringify(row));
  visible.value = true;
}

onMounted(() => {
  if (userStore.value.length < 1) {
    getUsers();
  } else {
    tableData.value = userStore.value;
  }
})

const getUsers = async () => {
  const res = await getUserList();
  tableData.value = res as User[];
  userStore.value = tableData.value;
}

const visible = ref(false);
const userForm = ref<User>({
  name: '',
  jobId: '',
  phoneNumber: '',
  passwd: ''
});

const submit = async (cb: Function) => {
  await cb(userForm.value);
  await getUsers();
  visible.value = false;
}
const handleAdd = async () => {
  dolgTitle.value = 'add';

  userForm.value = {
    name: '',
    jobId: '',
    phoneNumber: '',
    passwd: ''
  }
  visible.value = true;
}

const jobMap = computed(() => {
  let map: any = {};
  jobStore.value.forEach(item => {
    map[item.id as number] = item.name;
  })
  return map;
})

const jobSelect = computed(() => {
  const List = jobStore.value;
  return List.map((item: any) => {
    return {
      label: item.name,
      value: item.id
    }
  })
})

const handleDelete = async () => {
  // @ts-ignore
  const usersToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

  for (const user of usersToDelete) {
    try {
      const res = await deleteUser(user.id as number);
      // @ts-ignore
      if (res && res?.id) {
        ElMessage.success(`Deleted user with id: ${user.id}`);
      } else {
        ElMessage
          .error(`Failed to delete user with id: ${user.id}`)
      }
    } catch (error) {
      ElMessage.error(`Failed to delete user with id: ${user.id}`);
    }
  }
  // @ts-ignore
  tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));

  // console.log(tableData.value);
};

</script>

<template>
  <div class="user-list flex pa-5 flex-col gap-5">
    <div class="options">
      <el-button type="primary" @click="handleAdd">Add</el-button>
      <el-button type="danger" @click="handleDelete">Remove</el-button>
    </div>

    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column property="name" label="Name" />
      <el-table-column property="job" label="Job">
        <template #default="{ row }">{{ jobMap[row.jobId] }}</template>
      </el-table-column>
      <el-table-column property="phoneNumber" label="Phone" />
      <el-table-column fixed="right" label="Operations">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleClick(row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :show-close="false" width="500">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header flex flex-row justify-between items-center">
          <h4 :id="titleId" :class="titleClass">{{ dolgTitleMap[dolgTitle] }}</h4>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left">
              <CircleCloseFilled />
            </el-icon>
            Close
          </el-button>
        </div>
      </template>

      <el-form label-width="auto" :model="userForm" style="max-width: 600px">
        <el-form-item label="Name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="job">
          <el-tree-select v-model="userForm.jobId" :data="jobSelect" :render-after-expand="false"
            style="width: 240px" />
        </el-form-item>
        <el-form-item label="phone Number">
          <el-input v-model="userForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="userForm.passwd" />
        </el-form-item>
      </el-form>

      <template #footer="">
        <el-button type="primary" @click="submit(dolgTitle === 'add' ? postUser : putUser)">
          Submit
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style></style>