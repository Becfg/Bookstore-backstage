import { getRequest } from "../menu"

export interface MenusRequest {
  userId: string
}

export interface menuItemData {
  name: string
  path: string
  component?: string
  meta?: Map<string, string> | undefined
  children?: menuItemData[]
}

export const fetchMenus = async (req: MenusRequest) => {
  return await getRequest('/system/menus', req)
}
