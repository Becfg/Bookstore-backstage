<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { MonthlyCounting } from './type';
import { deleteMonthlyCounting, getMonthlyCountingList, postMonthlyCounting, putMonthlyCounting } from '@/apis/business/monthlyCounting';
import { userStore } from '@/stores/user';
import bookListStore from '@/stores/book/bookList';
import { ElMessage, ElTable } from 'element-plus';

const elName = 'monthlyCounting'

defineOptions({
    name: elName
})


const tableData = ref<MonthlyCounting[]>()
const monthlyCountingFrom = ref<MonthlyCounting>({
    bookId: 0,
    operatorId: 0,
    countRealNumbers: 0
})

const visible = ref(false)

const dialTitleMap = ref({
    'add monthlyCounting': 'Add monthlyCounting',
    'edit monthlyCounting': 'Edit monthlyCounting',
    'delete monthlyCounting': 'Delete monthlyCounting',
})
const dialTitle = ref('add monthlyCounting')


onMounted(async () => {
    getMonthlyCounting();
})

const getMonthlyCounting = async (id?: number) => {
    const res = await getMonthlyCountingList();
    tableData.value = res as MonthlyCounting[];
}

const operatorMap = computed(() => {
    let map: any = {};
    userStore.value.forEach(item => {
        map[item.id as number] = item.name;
    })
    return map;
})
const userSelect = computed(() => {
    const List = userStore.value;
    return List.map((item: any) => {
        return {
            label: item.name,
            value: item.id
        }
    })
})
const bookSelect = computed(() => {
    const List = bookListStore.value;
    return List.map((item: any) => {
        return {
            label: item.name,
            value: item.id
        }
    })
})

const handleAddMonthlyCounting = () => {
    monthlyCountingFrom.value = {
        bookId: 0,
        operatorId: 0,
        countRealNumbers: 0
    }
    dialTitle.value = 'add monthlyCounting';
    visible.value = true;
}

const handleDeleteMonthlyCounting = async () => {
    // @ts-ignore
    const monthlyCountingToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

    for (const monthlyCounting of monthlyCountingToDelete) {
        try {
            const res = await deleteMonthlyCounting(monthlyCounting.id as number);
            // @ts-ignore
            if (res && res?.id) {
                ElMessage.success(`Deleted ${elName} with id: ${monthlyCounting.id}`);
            } else {
                ElMessage
                    .error(`Failed to delete ${elName} with id: ${monthlyCounting.id}`)
            }
        } catch (error) {
            ElMessage.error(`Failed to delete ${elName} with id: ${monthlyCounting.id}`);
        }
    }
    // @ts-ignore
    tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));
}

const handleMonthlyCountingClick = (row: MonthlyCounting) => {
    dialTitle.value = 'edit monthlyCounting';
    monthlyCountingFrom.value = row;
    visible.value = true;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<MonthlyCounting[]>([])
const handleSelectionChange = (val: MonthlyCounting[]) => {
    multipleSelection.value = []
    //@ts-ignore
    val.forEach((item: Vendor) => multipleSelection.value.push(item.id))
    console.log(multipleSelection.value);
}

const submitmonthlyCountingFrom = async () => {
    let form: any;

    let func: Function | null = null;
    switch (dialTitle.value) {
        case 'add monthlyCounting':
            form = monthlyCountingFrom.value;
            func = postMonthlyCounting
            break;
        case 'edit monthlyCounting':

            form = monthlyCountingFrom.value;
            delete form.currentInventory
            delete form.lastMonthInventory
            delete form.MonthSArrival
            delete form.saleOfTheMonth
            delete form.waxingAndWaning

            func = putMonthlyCounting
            break;
        case 'delete monthlyCounting':
            func = deleteMonthlyCounting
            break;
        default:
            break;
    }

    if (func) {
        try {

            await func(form);
            await getMonthlyCounting();

            visible.value = false;

        } catch (error) {

        }
    }
}

</script>

<template>
    <div class="sale-list flex pa-5 flex-col gap-5">
        <div class="options">
            <el-button type="primary" @click="handleAddMonthlyCounting">Add</el-button>
            <el-button type="danger" @click="handleDeleteMonthlyCounting">Remove</el-button>
        </div>

        <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'id', order: 'ascending' }"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column property="id" sortable label="ID" />
            <el-table-column property="month" label="Month" />
            <el-table-column property="operatorId" label="Operator ID">
                <template #default="{ row }">
                    {{ operatorMap[row.operatorId] }}
                </template>
            </el-table-column>
            <el-table-column property="countRealNumbers" label="Count Real Numbers" />
            <el-table-column property="currentInventory" label="Yesterday Inventory" />
            <el-table-column property="lastMonthInventory" label="Today'S Arrival" />
            <el-table-column property="MonthSArrival" label="Sale Today" />
            <el-table-column property="saleOfTheMonth" label="Current Inventory" />
            <el-table-column property="waxingAndWaning" label="Waxing And Waning" />
            <el-table-column fixed="right" label="Operations" width="120">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleMonthlyCountingClick(row)">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="visible" :show-close="false" width="500">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header flex flex-row justify-between items-center">
                    <h4 :id="titleId" :class="titleClass">{{ dialTitleMap[dialTitle] }}</h4>
                    <el-button type="danger" @click="close">
                        <el-icon class="el-icon--left">
                            <CircleCloseFilled />
                        </el-icon>
                        Close
                    </el-button>
                </div>
            </template>

            <el-form label-width="auto" :model="monthlyCountingFrom" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="monthlyCountingFrom.id" disabled />
                </el-form-item>

                <el-form-item label="Month">
                    <el-date-picker v-model="monthlyCountingFrom.month" type="datetime" placeholder="Pick a month"
                        format="YYYY/MM" value-format="YYYY-MM" :disabled="dialTitle.split(' ')[0] === 'edit'" />
                </el-form-item>
                <el-form-item label="Operator Id">
                    <el-tree-select v-model="monthlyCountingFrom.operatorId" :data="userSelect"
                        :render-after-expand="false" style="width: 240px" />
                </el-form-item>
                <el-form-item label="book Id">
                    <el-tree-select v-model="monthlyCountingFrom.bookId" :data="bookSelect" :render-after-expand="false"
                        style="width: 240px" />
                </el-form-item>
                <el-form-item label="Count Real Numbers">
                    <el-input v-model.number="monthlyCountingFrom.countRealNumbers" />
                </el-form-item>
            </el-form>

            <template #footer="{ row }">
                <el-button type="primary" @click="submitmonthlyCountingFrom()">
                    Submit
                </el-button>
            </template>
        </el-dialog>

    </div>
</template>

<style scoped></style>