<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Vendor } from './type';
import { deleteVendor, getVendorList, postVendor, putVendor } from '@/apis/vendor';
import { ElMessage, ElTable } from 'element-plus';
import { vendorStore } from '@/stores/vendor';

const elName = 'vendor'

defineOptions({
    name: elName
})

const tableData = ref<Vendor[]>([])
const dolgTitleMap = ref({
    "add": 'Add Vendor',
    "edit": 'Edit Vendor',
    "detail": 'Vendor detail',
    "dele": 'Delete Vendor'
})
const dolgTitle = ref('add');
const visible = ref(false);

const vendorForm = ref<Vendor>({
    name: '',
    contact: '',
    contactNumber: '',
    email: ''
});

onMounted(() => {
    if (vendorStore.value.length < 1) {
        getVendors();
    } else {
        tableData.value = vendorStore.value;
    }
})

const getVendors = async () => {
    const res = await getVendorList();
    tableData.value = res as Vendor[];
    vendorStore.value = tableData.value;
}

const handleClick = (row: Vendor, type: string) => {
    dolgTitle.value = type;
    vendorForm.value = JSON.parse(JSON.stringify(row));
    visible.value = true;
}

const handleAdd = () => {
    dolgTitle.value = 'add';

    vendorForm.value = {
        name: '',
        contact: '',
        contactNumber: '',
        email: ''
    }
    visible.value = true;
}

const handleDelete = async () => {
    // @ts-ignore
    const vendorToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

    for (const vendor of vendorToDelete) {
        try {
            const res = await deleteVendor(vendor.id as number);
            // @ts-ignore
            if (res && res?.id) {
                ElMessage.success(`Deleted ${elName} with id: ${vendor.id}`);
            } else {
                ElMessage
                    .error(`Failed to delete ${elName} with id: ${vendor.id}`)
            }
        } catch (error) {
            ElMessage.error(`Failed to delete ${elName} with id: ${vendor.id}`);
        }
    }
    // @ts-ignore
    tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));
    // bookListStore.value = tableData.value;

    // console.log(tableData.value);
}

const submit = async (cb: Function) => {
    await cb(vendorForm.value);
    await getVendors();
    visible.value = false;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Vendor[]>([])
const handleSelectionChange = (val: Vendor[]) => {
    multipleSelection.value = []
    //@ts-ignore
    val.forEach((item: Vendor) => multipleSelection.value.push(item.id))
    console.log(multipleSelection.value);
}

</script>

<template>
    <div class="vendor-list flex pa-5 flex-col gap-5">
        <div class="options">
            <el-button type="primary" @click="handleAdd">Add</el-button>
            <el-button type="danger" @click="handleDelete">Remove</el-button>
        </div>

        <el-table ref="multipleTableRef" :data="tableData" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column property="name" label="Name" />
            <el-table-column property="contact" label="Contact" />
            <el-table-column property="contactNumber" label="Contact Number" />
            <el-table-column property="email" label="Email" />
            <el-table-column fixed="right" label="Operations">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleClick(row, 'detail')">
                        Detail
                    </el-button>
                    <el-button link type="primary" @click="handleClick(row, 'edit')">Edit</el-button>
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

            <el-form label-width="auto" :model="vendorForm" style="max-width: 600px">
                <el-form-item label="Name">
                    <el-input v-model="vendorForm.name" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Contact">
                    <el-input v-model.number="vendorForm.contact" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Contact Number">
                    <el-input v-model="vendorForm.contactNumber" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Email">
                    <el-input v-model="vendorForm.email" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
            </el-form>
            <template #footer="">
                <el-button v-if="dolgTitle !== 'detail'" type="primary" @click="submit(dolgTitle === 'add' ? postVendor
                    : putVendor)">
                    Submit
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>