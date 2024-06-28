import { User } from '@/views/user/type'
import { useStorage } from '@vueuse/core'
export const userStore = useStorage<User[]>('userStore', [])
export const userInfoStore = useStorage<{
  username: string
}>('userInfoStore', {
  username: ''
})
