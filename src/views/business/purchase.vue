<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { PurchaseCreate, PurchaseDetail, PurchaseDetails, PurchaseUpdate } from './type';
import { deletePurchase, deletePurchaseDetail, getPurchaseDetailRefer, getPurchaseList, postPurchase, putPurchase } from '@/apis/business/purchase';
import { ElMessage, ElTable } from 'element-plus';
import { userStore } from '@/stores/user';
import { vendorStore } from '@/stores/vendor';
import bookListStore from '@/stores/book/bookList';


const tableData = ref<PurchaseCreate[]>([])
const purchaseFrom = ref<PurchaseCreate>({
    vendorId: 0,
    operatorId: 0
})
const purchaseDetailFrom = ref<PurchaseUpdate>({
    date: '',
    vendorId: 0,
    operatorId: 0,
    purchaseDetails: {
        id: 0,
        bookId: 0,
        price: 0,
        quantity: 0,
    }
})

const purchaseDetail = ref<{ [key: number]: PurchaseDetail[] }>({})

const visible = ref(false)
const inVisible = ref(false)

const dialTitleMap = ref({
    'add purchase': 'Add purchase',
    'edit purchase': 'Edit purchase',
    'delete purchase': 'Delete purchase',
    'add purchase detail': 'Add purchase Detail',
    'edit purchase detail': 'Edit purchase Detail',
    'delete purchase detail': 'Delete purchase Detail'
})
const dialTitle = ref('add purchase')

const userSelect = computed(() => {
    const List = userStore.value;
    return List.map((item: any) => {
        return {
            label: item.name,
            value: item.id
        }
    })
})

const vendorSelect = computed(() => {
    const List = vendorStore.value;
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

onMounted(async () => {
    getPurchases();
})

const operatorMap = computed(() => {
    let map: any = {};
    userStore.value.forEach(item => {
        map[item.id as number] = item.name;
    })
    return map;
})

const vendorMap = computed(() => {
    let map: any = {};
    vendorStore.value.forEach(item => {
        map[item.id as number] = item.name;
    })
    return map;
})

const getPurchases = async (id?: number) => {
    const res = await getPurchaseList();
    tableData.value = res as PurchaseCreate[];
    if (id) {
        purchaseDetail.value[id] = await getPurchaseDetailRefer(id) as PurchaseDetail[];
    }
}

const handleAddPurchase = () => {
    purchaseFrom.value = {
        vendorId: 0,
        operatorId: 0
    }
    dialTitle.value = 'add purchase';
    visible.value = true;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<number[]>([])
const handleSelectionChange = (val: PurchaseCreate[]) => {
    multipleSelection.value = []
    //@ts-ignore
    val.forEach((item: PurchaseCreate) => multipleSelection.value.push(item.id))
    console.log(multipleSelection.value);
}

const multipleTableRefIn = ref<InstanceType<typeof ElTable>>()
const multipleSelectionIn = ref<number[]>([])
const handleSelectionChangeIn = (val: PurchaseDetail[]) => {
    multipleSelectionIn.value = []
    val.forEach((item: PurchaseDetail) => multipleSelectionIn.value.push(item.id as number))
    console.log(multipleSelectionIn.value);
}

const handleDeletePurchase = async () => {
    // @ts-ignore
    const purchaseToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

    for (const purchase of purchaseToDelete) {
        try {
            const res = await deletePurchase(purchase.id as number);
            // @ts-ignore
            if (res && res?.id) {
                ElMessage.success(`Deleted purchase with id: ${purchase.id}`);
            } else {
                ElMessage
                    .error(`Failed to delete purchase with id: ${purchase.id}`)
            }
        } catch (error) {
            ElMessage.error(`Failed to delete purchase with id: ${purchase.id}`);
        }
    }
    // @ts-ignore
    tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));
}

const handleAddPurchaseDetial = (row: PurchaseUpdate) => {
    purchaseDetailFrom.value = {
        id: row.id,
        date: row.date,
        vendorId: row.vendorId,
        operatorId: row.operatorId,
        purchaseDetails: {
            bookId: 0,
            price: 0,
            quantity: 0,
        }
    }

    dialTitle.value = 'add purchase detail';
    inVisible.value = true;
}

const handleDeletePurchaseDetial = async (id: number) => {
    console.log(id);
    multipleSelectionIn.value.forEach(async item => {
        await deletePurchaseDetail(item, id)
    })
    await getPurchases(id)
}

const submitPurchaseFrom = async () => {
    let form: any;

    let func: Function | null = null;
    switch (dialTitle.value) {
        case 'add purchase':
            form = purchaseFrom.value;
            func = postPurchase
            break;
        case 'edit purchase':
            form = purchaseFrom.value;
            delete form.theTotalAmount
            func = putPurchase
            console.log(form);

            break;
        case 'add purchase detail':
        case 'edit purchase detail':
            form = purchaseDetailFrom.value
            func = putPurchase
            break;
        case 'delete purchase':
            func = deletePurchase
            break;
        default:
            break;
    }

    if (func) {
        try {

            await func(form);
            await getPurchases(form.id);

            visible.value = false;
            inVisible.value = false;

        } catch (error) {

        }
    }
}

const handlePurchaseClick = (row: PurchaseCreate) => {
    dialTitle.value = 'edit purchase';
    purchaseFrom.value = row;
    visible.value = true;
};

const handlePurchaseDetailClick = (row: PurchaseDetails) => {
    dialTitle.value = 'edit purchase detail';

    purchaseDetailFrom.value.id = row.purchase?.id;
    purchaseDetailFrom.value.date = row.purchase?.date;
    purchaseDetailFrom.value.operatorId = row.purchase?.operatorId as number;
    purchaseDetailFrom.value.vendorId = row.purchase?.vendorId as number;
    purchaseDetailFrom.value.purchaseDetails!.id = row.id;
    purchaseDetailFrom.value.purchaseDetails!.bookId = row.book?.id;
    purchaseDetailFrom.value.purchaseDetails!.quantity = row.quantity;
    purchaseDetailFrom.value.purchaseDetails!.price = row.price;

    inVisible.value = true;
}

const handleDetailOpenClick = async (row, expandedRows: any[]) => {
    if (expandedRows.length < 1 || purchaseDetail.value[row.id] && purchaseDetail.value[row.id].length > 0) {
        return;
    }
    purchaseDetail.value[row.id] = await getPurchaseDetailRefer(row.id) as PurchaseDetail[];
}

</script>

<template>
    <div class="sale-list flex pa-5 flex-col gap-5">
        <div class="options">
            <el-button type="primary" @click="handleAddPurchase">Add</el-button>
            <el-button type="danger" @click="handleDeletePurchase">Remove</el-button>
        </div>

        <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'id', order: 'ascending' }"
            @selection-change="handleSelectionChange" @expand-change="handleDetailOpenClick">
            <el-table-column type="selection" />

            <el-table-column type="expand">
                <template #default="{ row }">
                    <div class="sale-detail-list pt-5 pb-5 pl-15 pr-15 flex flex-col gap-5">
                        <div class="options">
                            <el-button type="primary" @click="handleAddPurchaseDetial(row)">Add</el-button>
                            <el-button type="danger" @click="handleDeletePurchaseDetial(row.id)">Remove</el-button>
                        </div>

                        <el-table ref="multipleTableRefIn" :data="purchaseDetail[row.id]" style="width: 100%"
                            @selection-change="handleSelectionChangeIn">
                            <el-table-column type="selection" />
                            <el-table-column property="id" sortable label="ID" />
                            <el-table-column property="quantity" label="Quantity" />
                            <el-table-column property="price" label="Price" />
                            <el-table-column label="Book">
                                <template #default="{ row }">
                                    {{ row.book.name }}
                                </template>
                            </el-table-column>

                            <el-table-column fixed="right" label="Operations">
                                <template #default="{ row }">
                                    <el-button link type="primary"
                                        @click="handlePurchaseDetailClick(row)">Edit</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="id" sortable label="ID" />
            <el-table-column property="date" label="Date" />
            <el-table-column label="Vendor ID">
                <template #default="{ row }">
                    {{ vendorMap[row.vendorId] }}
                </template>
            </el-table-column>
            <el-table-column label="Operator ID">
                <template #default="{ row }">
                    {{ operatorMap[row.operatorId] }}
                </template>
            </el-table-column>
            <el-table-column property="theTotalAmount" label="The tota a mount" />
            <el-table-column fixed="right" label="Operations">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handlePurchaseClick(row)">Edit</el-button>
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

            <el-form label-width="auto" :model="purchaseFrom" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="purchaseFrom.id" disabled />
                </el-form-item>

                <el-form-item label="Date">
                    <el-date-picker v-model="purchaseFrom.date" type="datetime" placeholder="Pick a Date"
                        format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s" />
                </el-form-item>
                <el-form-item label="Operator Id">
                    <el-tree-select v-model="purchaseFrom.operatorId" :data="userSelect" :render-after-expand="false"
                        style="width: 240px" />
                </el-form-item>
                <el-form-item label="Vendor Id">
                    <el-tree-select v-model="purchaseFrom.vendorId" :data="vendorSelect" :render-after-expand="false"
                        style="width: 240px" />
                </el-form-item>
            </el-form>

            <template #footer="{ row }">
                <el-button type="primary" @click="submitPurchaseFrom()">
                    Submit
                </el-button>
            </template>
        </el-dialog>

        <!-- 子表 -->
        <el-dialog v-model="inVisible" :show-close="false" width="500">
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

            <el-form label-width="auto" :model="purchaseDetailFrom" style="max-width: 600px">
                <el-form-item label="Date">
                    <el-date-picker v-model="purchaseDetailFrom.date" type="datetime" placeholder="Pick a Date"
                        format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s" disabled />
                </el-form-item>
                <el-form-item label="Operator ID">
                    <el-tree-select v-model="purchaseDetailFrom.operatorId" :data="userSelect"
                        :render-after-expand="false" style="width: 240px" disabled />
                </el-form-item>
                <el-form-item label="Vendor ID">
                    <el-tree-select v-model="purchaseDetailFrom.vendorId" :data="vendorSelect"
                        :render-after-expand="false" style="width: 240px" disabled />
                </el-form-item>
                <el-form-item label="Purchase ID">
                    <el-input v-model="purchaseDetailFrom.id" disabled />
                </el-form-item>
                <el-form-item label="Purchase Detail ID">
                    <el-input v-model="purchaseDetailFrom.purchaseDetails!.id" disabled />
                </el-form-item>
                <el-form-item label="Purchase detail book">
                    <el-tree-select v-model.number="purchaseDetailFrom.purchaseDetails!.bookId" :data="bookSelect"
                        :render-after-expand="false" style="width: 240px" />
                </el-form-item>
                <el-form-item label="Purchase detail quantity">
                    <el-input v-model.number="purchaseDetailFrom.purchaseDetails!.quantity" />
                </el-form-item>
                <el-form-item label="Purchase detail price">
                    <el-input v-model.number="purchaseDetailFrom.purchaseDetails!.price" />
                </el-form-item>
            </el-form>

            <template #footer="{ row }">
                <el-button type="primary" @click="submitPurchaseFrom()">
                    Submit
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>