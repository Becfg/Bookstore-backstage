import { Book } from '@/views/book/type';
import { useStorage } from '@vueuse/core'

const bookListStore = useStorage<Book[]>('bookList', []);

export default bookListStore;