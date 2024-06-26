import { useStorage } from '@vueuse/core'

const token = useStorage('token', null);

export default token;