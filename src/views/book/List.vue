<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Book } from './type';
import bookListStore from '@/stores/book/bookList';
import { deleteBook, getBookList, postBook, putBook } from '@/apis/book/bookList';
import bookCategoryStore from '@/stores/book/bookCategory';
import { ElMessage, ElTable } from 'element-plus';

defineOptions({
    name: 'bookList',
})

const tableData = ref<Book[]>([])
const dolgTitleMap = ref({
    "add": 'Add Book',
    "edit": 'Edit Book',
    "detail": 'Book detail',
    "dele": 'Delete Book'
})
const dolgTitle = ref<string>('');

const visible = ref(false);
const bookForm = ref<Book>({
    name: '',
    author: '',
    publisher: '',
    ISBN: '',
    version: '',
    price: 0,
    categoryId: 0
});

const handleClick = (row: Book, type: string) => {
    dolgTitle.value = type;
    bookForm.value = JSON.parse(JSON.stringify(row));
    visible.value = true;
}

const handleAdd = () => {
    dolgTitle.value = 'add';

    bookForm.value = {
        name: '',
        author: '',
        publisher: '',
        ISBN: '',
        version: '',
        price: 0,
        categoryId: 0
    }
    visible.value = true;
}

const handleDelete = async () => {
    // @ts-ignore
    const bookToDelete = tableData.value.filter(item => multipleSelection.value.includes(item.id));

    for (const book of bookToDelete) {
        try {
            const res = await deleteBook(book.id as number);
            // @ts-ignore
            if (res && res?.id) {
                ElMessage.success(`Deleted book with id: ${book.id}`);
            } else {
                ElMessage
                    .error(`Failed to delete book with id: ${book.id}`)
            }
        } catch (error) {
            ElMessage.error(`Failed to delete book with id: ${book.id}`);
        }
    }
    // @ts-ignore
    tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item.id));
    bookListStore.value = tableData.value;

    // console.log(tableData.value);
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Book[]>([])
const handleSelectionChange = (val: Book[]) => {
    multipleSelection.value = []
    //@ts-ignore
    val.forEach((item: Book) => multipleSelection.value.push(item.id))
    console.log(multipleSelection.value);

}

const submit = async (cb: Function) => {
    await cb(bookForm.value);
    await getbooks();
    visible.value = false;
}

const getbooks = async () => {
    const res = await getBookList();
    tableData.value = res as Book[];
    bookListStore.value = tableData.value;
}

onMounted(() => {
    if (bookListStore.value.length < 1) {
        getbooks();
    } else {
        tableData.value = bookListStore.value;
    }
})

const categoryMap = computed(() => {
    let map: any = {};
    bookCategoryStore.value.forEach(item => {
        map[item.id as number] = item.name;
    })
    return map;
})

const bookCategory = computed(() => {
    const List = bookCategoryStore.value;
    return List.map((item: any) => {
        return {
            label: item.name,
            value: item.id
        }
    })
})

</script>

<template>
    <div class="book-list flex pa-5 flex-col gap-5">
        <div class="options">
            <el-button type="primary" @click="handleAdd">Add</el-button>
            <el-button type="danger" @click="handleDelete">remove</el-button>
        </div>

        <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'id', order: 'ascending' }"
            style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column property="name" label="Name" />
            <el-table-column property="author" label="Author" />
            <el-table-column property="publisher" label="Publisher" />
            <el-table-column property="ISBN" label="ISBN" />
            <el-table-column property="version" label="Version" />
            <el-table-column property="price" label="Price" />
            <el-table-column label="Category">
                <template #default="{ row }">{{ categoryMap[row.categoryId] }}</template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleClick(row, 'detail')">
                        Detail
                    </el-button>
                    <el-button link type="primary" @click="handleClick(row, 'edit')">
                        Edit
                    </el-button>
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

            <el-form label-width="auto" :model="bookForm" style="max-width: 600px">
                <el-form-item label="Name">
                    <el-input v-model="bookForm.name" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Author">
                    <el-input v-model="bookForm.author" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Book Publisher">
                    <el-input v-model="bookForm.publisher" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="ISBN">
                    <el-input v-model="bookForm.ISBN" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Version">
                    <el-input v-model="bookForm.version" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Price">
                    <el-input v-model="bookForm.price" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
                <el-form-item label="Category">
                    <el-tree-select v-model="bookForm.categoryId" :data="bookCategory" :render-after-expand="false"
                        style="width: 240px" :disabled="dolgTitle === 'detail'" />
                </el-form-item>
            </el-form>

            <template #footer="">
                <el-button v-if="dolgTitle !== 'detail'" type="primary" @click="submit(dolgTitle === 'add' ? postBook
                    : putBook)">
                    Submit
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>