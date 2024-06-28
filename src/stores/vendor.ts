import { Vendor } from '@/views/type'
import { useStorage } from '@vueuse/core'
export const vendorStore = useStorage<Vendor[]>('vendorStore', [])
