<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { DailyCounting } from './type';
import { deleteDailyCounting, getDailyCountingList, postDailyCounting, putDailyCounting } from '@/apis/business/dailyCounting';
import { userStore } from '@/stores/user';
import bookListStore from '@/stores/book/bookList';
import { ElMessage, ElTable } from 'element-plus';

const elName = 'dailyCounting'

defineOptions({
    name: elName
})


const tableData = ref<DailyCounting[]>()
const dailyCountingFrom = ref<DailyCounting>({
    bookId: 0,
    operatorId: 0,
    countRealNumbers: 0
})

const visible = ref(false)

const dialTitleMap = ref({
    'add dailyCounting': 'Add dailyCounting',
    'edit dailyCounting': 'Edit dailyCounting',
    'delete dailyCounting': 'Delete dailyCounting',
})
const dialTitle = ref('add dailyCounting')


onMounted(async () => {
    getDailyCounting();
})

const getDailyCounting = async (id?: number) => {
    const res = await getDailyCountingList();
    tableData.value = res as DailyCounting[];
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

const handleAddDailyCounting = () => {
    dailyCountingFrom.value = {
        bookId: 0,
        operatorId: 0,
        countRealNumbers: 0
    }
    dialTitle.value = 'add dailyCounting';
    visible.value = true;
}

const handleDeleteDailyCounting = async () => {
    // @ts-ignore
    const dailyCountingToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

    for (const dailyCounting of dailyCountingToDelete) {
        try {
            const res = await deleteDailyCounting(dailyCounting.id as number);
            // @ts-ignore
            if (res && res?.id) {
                ElMessage.success(`Deleted ${elName} with id: ${dailyCounting.id}`);
            } else {
                ElMessage
                    .error(`Failed to delete ${elName} with id: ${dailyCounting.id}`)
            }
        } catch (error) {
            ElMessage.error(`Failed to delete ${elName} with id: ${dailyCounting.id}`);
        }
    }
    // @ts-ignore
    tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));
}

const handleDailyCountingClick = (row: DailyCounting) => {
    dialTitle.value = 'edit dailyCounting';
    dailyCountingFrom.value = row;
    visible.value = true;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<DailyCounting[]>([])
const handleSelectionChange = (val: DailyCounting[]) => {
    multipleSelection.value = []
    //@ts-ignore
    val.forEach((item: Vendor) => multipleSelection.value.push(item.id))
    console.log(multipleSelection.value);
}

const submitdailyCountingFrom = async () => {
    let form: any;

    let func: Function | null = null;
    switch (dialTitle.value) {
        case 'add dailyCounting':
            form = dailyCountingFrom.value;
            func = postDailyCounting
            break;
        case 'edit dailyCounting':
            form = dailyCountingFrom.value;
            delete form.yesterdayInventory
            delete form.todaySArrival
            delete form.saleToday
            delete form.currentInventory
            delete form.waxingAndWaning

            func = putDailyCounting
            break;
        case 'delete dailyCounting':
            func = deleteDailyCounting
            break;
        default:
            break;
    }

    if (func) {
        try {

            await func(form);
            await getDailyCounting();

            visible.value = false;

        } catch (error) {

        }
    }
}

</script>

<template>
    <div class="sale-list flex pa-5 flex-col gap-5">
        <div class="options">
            <el-button type="primary" @click="handleAddDailyCounting">Add</el-button>
            <el-button type="danger" @click="handleDeleteDailyCounting">Remove</el-button>
        </div>

        <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'id', order: 'ascending' }"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column property="id" sortable label="ID" />
            <el-table-column property="date" label="Date" />
            <el-table-column property="operatorId" label="Operator ID">
                <template #default="{ row }">
                    {{ operatorMap[row.operatorId] }}
                </template>
            </el-table-column>
            <el-table-column property="countRealNumbers" label="Count Real Numbers" />
            <el-table-column property="yesterdayInventory" label="Yesterday Inventory"  />
            <el-table-column property="todaySArrival" label="Today'S Arrival"  />
            <el-table-column property="saleToday" label="Sale Today" width="100" />
            <el-table-column property="currentInventory" label="Current Inventory" />
            <el-table-column property="waxingAndWaning" label="Waxing And Waning"  />
            <el-table-column fixed="right" label="Operations">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleDailyCountingClick(row)">Edit</el-button>
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

            <el-form label-width="auto" :model="dailyCountingFrom" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="dailyCountingFrom.id" disabled />
                </el-form-item>

                <el-form-item label="Date">
                    <el-date-picker v-model="dailyCountingFrom.date" type="datetime" placeholder="Pick a Date"
                        format="YYYY/MM/DD" value-format="YYYY-MM-DD" :disabled="dialTitle.split(' ')[0] === 'edit'" />
                </el-form-item>
                <el-form-item label="Operator Id">
                    <el-tree-select v-model="dailyCountingFrom.operatorId" :data="userSelect"
                        :render-after-expand="false" style="width: 240px" />
                </el-form-item>
                <el-form-item label="book Id">
                    <el-tree-select v-model="dailyCountingFrom.bookId" :data="bookSelect" :render-after-expand="false"
                        style="width: 240px" />
                </el-form-item>
                <el-form-item label="Count Real Numbers">
                    <el-input v-model.number="dailyCountingFrom.countRealNumbers" />
                </el-form-item>
            </el-form>

            <template #footer="{ row }">
                <el-button type="primary" @click="submitdailyCountingFrom()">
                    Submit
                </el-button>
            </template>
        </el-dialog>

    </div>
</template>

<style scoped></style>