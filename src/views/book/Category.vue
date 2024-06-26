<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BookCategory } from './type';
import { deleteCategory, getbookCategoryList, postBookCategory } from '@/apis/book/bookCategory';
import { ElMessage, ElTable } from 'element-plus';
import bookCategoryStore from '@/stores/book/bookCategory';

defineOptions({
    name: 'bookCategory',
})
const tableData = ref<BookCategory[]>([])

const bookCategoryForm = ref<BookCategory>({
    name: '',
});

const visible = ref(false)

const handleAdd = () => {
    bookCategoryForm.value = {
        name: '',
    }
    visible.value = true;
}

const handleDelete = async () => {
    // @ts-ignore
    const categoryToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

    for (const category of categoryToDelete) {
        try {
            const res = await deleteCategory(category.id as number);
            // @ts-ignore
            if (res && res?.id) {
                ElMessage.success(`Deleted category with id: ${category.id}`);
            } else {
                ElMessage
                    .error(`Failed to delete category with id: ${category.id}`)
            }
        } catch (error) {
            ElMessage.error(`Failed to delete category with id: ${category.id}`);
        }
    }
    // @ts-ignore
    tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));
    bookCategoryStore.value = tableData.value;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<BookCategory[]>([])
const handleSelectionChange = (val: BookCategory[]) => {
    multipleSelection.value = []
    //@ts-ignore
    val.forEach((item: BookCategory) => multipleSelection.value.push(item.id))
    console.log(multipleSelection.value);
}

const submit = async (cb: Function) => {
    await cb(bookCategoryForm.value);
    await getbookCategorys();
    visible.value = false;
}
const getbookCategorys = async () => {
    const res = await getbookCategoryList();
    tableData.value = res as BookCategory[];
    bookCategoryStore.value = tableData.value;
}

onMounted(() => {
    if (bookCategoryStore.value.length < 1) {
        getbookCategorys();
    } else {
        tableData.value = bookCategoryStore.value;
    }
})
</script>

<template>
    <div class="book-category flex pa-5 flex-col gap-5">
        <div class="options">
            <el-button type="primary" @click="handleAdd">Add</el-button>
            <el-button type="danger" @click="handleDelete">remove</el-button>
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
                    <h4 :id="titleId" :class="titleClass">{{ 'Add Book Category' }}</h4>
                    <el-button type="danger" @click="close">
                        <el-icon class="el-icon--left">
                            <CircleCloseFilled />
                        </el-icon>
                        Close
                    </el-button>
                </div>
            </template>

            <el-form label-width="auto" :model="bookCategoryForm" style="max-width: 600px">
                <el-form-item label="Name">
                    <el-input v-model="bookCategoryForm.name" />
                </el-form-item>
            </el-form>

            <template #footer="">
                <el-button type="primary" @click="submit(postBookCategory)">
                    Submit
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>