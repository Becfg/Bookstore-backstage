import { BookCategory } from '@/views/book/type';
import { useStorage } from '@vueuse/core'

const bookCategoryStore = useStorage<BookCategory[]>('BookCategory', []);

export default bookCategoryStore;