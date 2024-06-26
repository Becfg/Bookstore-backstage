import { Job } from '@/views/user/type';
import { useStorage } from '@vueuse/core'

const jobStore = useStorage<Job[]>('job', []);

export default jobStore;