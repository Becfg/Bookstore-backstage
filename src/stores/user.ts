import { User } from '@/views/user/type'
import { useStorage } from '@vueuse/core'
export const user = useStorage<User[]>('user', [])
