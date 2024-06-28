import { useStorage } from '@vueuse/core'

const tokenStore = useStorage('tokenStore', null);

export default tokenStore;