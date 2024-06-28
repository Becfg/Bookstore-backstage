<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { SaleCreate, SaleUpdate, SalesDetail, SalesDetails } from './type';
import { deleteSale, deleteSaleDetail, getSaleDetailRefer, getSaleList, postSale, putSale } from '@/apis/business/sale';
import { userStore } from '@/stores/user';
import { ElMessage, ElTable } from 'element-plus';
import bookListStore from '@/stores/book/bookList';

const tableData = ref<SaleCreate[]>([])
const saleFrom = ref<SaleCreate>({
    date: '',
    salespersonId: 0
})
const saleDetailFrom = ref<SaleUpdate>({
    date: '',
    salespersonId: 0,
    salesDetail: {
        id: 0,
        saleId: 0,
        bookId: 0,
        quantity: 0,
        price: 0
    }
})

const salesDetail = ref<{ [key: number]: SalesDetail[] }>({})

const visible = ref(false)
const inVisible = ref(false)

const dialTitleMap = ref({
    'add sale': 'Add Sale',
    'edit sale': 'Edit Sale',
    'delete sale': 'Delete Sale',
    'add sale detail': 'Add Sale Detail',
    'edit sale detail': 'Edit Sale Detail',
    'delete sale detail': 'Delete Sale Detail'
})
const dialTitle = ref('add sale')

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


onMounted(async () => {
    getSales();
})

const salesPersonMap = computed(() => {
    let map: any = {};
    userStore.value.forEach(item => {
        map[item.id as number] = item.name;
    })
    return map;
})


const getSales = async (id?: number) => {
    const res = await getSaleList();
    tableData.value = res as SaleCreate[];
    if (id) {
        salesDetail.value[id] = await getSaleDetailRefer(id) as SalesDetail[];
    }
}

const handleAddSale = () => {
    saleFrom.value = {
        date: '',
        salespersonId: 0
    }
    dialTitle.value = 'add sale';
    visible.value = true;
}
const handleDeleteSale = async () => {
    // @ts-ignore
    const saleToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

    for (const sale of saleToDelete) {
        try {
            const res = await deleteSale(sale.id as number);
            // @ts-ignore
            if (res && res?.id) {
                ElMessage.success(`Deleted sale with id: ${sale.id}`);
            } else {
                ElMessage
                    .error(`Failed to delete sale with id: ${sale.id}`)
            }
        } catch (error) {
            ElMessage.error(`Failed to delete sale with id: ${sale.id}`);
        }
    }
    // @ts-ignore
    tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));
}

const handleAddSaleDetial = (row: SaleUpdate) => {
    saleDetailFrom.value = {
        id: row.id,
        date: row.date,
        salespersonId: row.salespersonId,
        salesDetail: {
            bookId: 0,
            quantity: 0,
            price: 0
        }
    }

    dialTitle.value = 'add sale detail';
    inVisible.value = true;

}

const handleDeleteSaleDetial = async (id: number) => {
    console.log(id);
    multipleSelectionIn.value.forEach(async item => {
        await deleteSaleDetail(item, id)
    })
    await getSales(id)
}

const submitSaleFrom = async () => {
    let form: any;

    let func: Function | null = null;
    switch (dialTitle.value) {
        case 'add sale':
            form = saleFrom.value;
            func = postSale
            break;
        case 'edit sale':
            form = saleFrom.value;
            delete form.theTotalAmount
            func = putSale
            break;
        case 'add sale detail':
        case 'edit sale detail':
            form = saleDetailFrom.value
            func = putSale
            break;
        case 'delete sale':
            func = deleteSale
            break;
        default:
            break;
    }

    if (func) {
        try {

            await func(form);
            await getSales(form.id);

            visible.value = false;
            inVisible.value = false;

        } catch (error) {

        }
    }
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<number[]>([])
const handleSelectionChange = (val: SaleCreate[]) => {
    multipleSelection.value = []
    //@ts-ignore
    val.forEach((item: SaleCreate) => multipleSelection.value.push(item.id))
    console.log(multipleSelection.value);
}

const multipleTableRefIn = ref<InstanceType<typeof ElTable>>()
const multipleSelectionIn = ref<number[]>([])
const handleSelectionChangeIn = (val: SalesDetail[]) => {
    multipleSelectionIn.value = []
    val.forEach((item: SalesDetail) => multipleSelectionIn.value.push(item.id as number))
    console.log(multipleSelectionIn.value);
}


const handleSaleClick = (row: SaleCreate) => {
    dialTitle.value = 'edit sale';
    saleFrom.value = row;
    visible.value = true;
};

const handleSaleDetailClick = (row: SalesDetails) => {
    dialTitle.value = 'edit sale detail';

    saleDetailFrom.value.id = row.sale?.id;
    saleDetailFrom.value.date = row.sale?.date;
    saleDetailFrom.value.salespersonId = row.sale?.salespersonId as number;
    saleDetailFrom.value.salesDetail!.id = row.id;
    saleDetailFrom.value.salesDetail!.bookId = row.book?.id;
    saleDetailFrom.value.salesDetail!.quantity = row.quantity;
    saleDetailFrom.value.salesDetail!.price = row.price;

    inVisible.value = true;
}

const handleDetailOpenClick = async (row, expandedRows: any[]) => {
    if (expandedRows.length < 1 || salesDetail.value[row.id] && salesDetail.value[row.id].length > 0) {
        return;
    }
    salesDetail.value[row.id] = await getSaleDetailRefer(row.id) as SalesDetail[];
}

</script>

<template>
    <div class="sale-list flex pa-5 flex-col gap-5">
        <div class="options">
            <el-button type="primary" @click="handleAddSale">Add</el-button>
            <el-button type="danger" @click="handleDeleteSale">Remove</el-button>
        </div>

        <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'id', order: 'ascending' }"
            @selection-change="handleSelectionChange" @expand-change="handleDetailOpenClick">
            <el-table-column type="selection" />

            <el-table-column type="expand">
                <template #default="{ row }">
                    <div class="sale-detail-list pt-5 pb-5 pl-15 pr-15 flex flex-col gap-5">
                        <div class="options">
                            <el-button type="primary" @click="handleAddSaleDetial(row)">Add</el-button>
                            <el-button type="danger" @click="handleDeleteSaleDetial(row.id)">Remove</el-button>
                        </div>

                        <el-table ref="multipleTableRefIn" :data="salesDetail[row.id]" style="width: 100%"
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
                                    <el-button link type="primary" @click="handleSaleDetailClick(row)">Edit</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="id" sortable label="ID" />
            <el-table-column property="date" label="Date" />
            <el-table-column property="salespersonId" label="Sales person ID">
                <template #default="{ row }">
                    {{ salesPersonMap[row.salespersonId] }}
                </template>
            </el-table-column>
            <el-table-column property="theTotalAmount" label="The tota a mount" />
            <el-table-column fixed="right" label="Operations">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleSaleClick(row)">Edit</el-button>
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

            <el-form label-width="auto" :model="saleFrom" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="saleFrom.id" disabled />
                </el-form-item>

                <el-form-item label="Date">
                    <el-date-picker v-model="saleFrom.date" type="datetime" placeholder="Pick a Date"
                        format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s" />
                </el-form-item>
                <el-form-item label="Sales person ID">
                    <el-tree-select v-model="saleFrom.salespersonId" :data="userSelect" :render-after-expand="false"
                        style="width: 240px" />
                </el-form-item>
            </el-form>

            <template #footer="{ row }">
                <el-button type="primary" @click="submitSaleFrom()">
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

            <el-form label-width="auto" :model="saleDetailFrom" style="max-width: 600px">
                <el-form-item label="Date">
                    <el-date-picker v-model="saleDetailFrom.date" type="datetime" placeholder="Pick a Date"
                        format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s" disabled />
                </el-form-item>
                <el-form-item label="Sales person ID">
                    <el-tree-select v-model="saleDetailFrom.salespersonId" :data="userSelect"
                        :render-after-expand="false" style="width: 240px" disabled />
                </el-form-item>
                <el-form-item label="Sale ID">
                    <el-input v-model="saleDetailFrom.id" disabled />
                </el-form-item>
                <el-form-item label="Sale Detail ID">
                    <el-input v-model="saleDetailFrom.salesDetail!.id" disabled />
                </el-form-item>
                <el-form-item label="Sale detail book">
                    <el-tree-select v-model.number="saleDetailFrom.salesDetail!.bookId" :data="bookSelect"
                        :render-after-expand="false" style="width: 240px" />
                </el-form-item>
                <el-form-item label="Sale detail quantity">
                    <el-input v-model.number="saleDetailFrom.salesDetail!.quantity" />
                </el-form-item>
                <el-form-item label="Sale detail price">
                    <el-input v-model.number="saleDetailFrom.salesDetail!.price" />
                </el-form-item>
            </el-form>

            <template #footer="{ row }">
                <el-button type="primary" @click="submitSaleFrom()">
                    Submit
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>ElMessage,
