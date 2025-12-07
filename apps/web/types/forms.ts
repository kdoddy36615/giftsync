export interface ItemFormData {
  name: string
  status: 'required' | 'optional'
  notes: string
  valueTag: string | null
}

export interface CreateItemInput extends ItemFormData {
  listId: string
}

export interface UpdateItemInput extends ItemFormData {
  itemId: string
}
