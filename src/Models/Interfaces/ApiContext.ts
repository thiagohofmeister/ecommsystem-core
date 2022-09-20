export interface ApiContext {
  storeId?: string
  user?: {
    id?: string
    email?: string
    roleType: string
  }
}
