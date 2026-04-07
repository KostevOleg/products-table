import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { CartItem } from '../../models/cart-model'

type CartState = {
  items: CartItem[]
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>({
    items: []
  }),
  withMethods((store)=>{
    return {
    updateCart(prod:CartItem){
        patchState(store, (state)=>{
            const existing = state.items.find(i=> i.id === prod.id)
            if(existing){
                return {
                    items : state.items.map(i =>
                        i.id === prod.id
                            ? { ...i, quantity: i.quantity + prod.quantity }
                            : i
                        )
                }
            } 

        return{
            items: [...state.items, prod]
        }
        })
    },
    clearCart(){
        patchState(store, ()=>{
            return {items : []}
        })
    },
    decreaseQuantity(id:number){
        patchState(store, (state)=>({
            items: state.items.map((item)=> item.id === id ? {... item, quantity: item.quantity -1} : item)
            .filter(el => el.quantity > 0)
        }))
    },
    increaseQuantity(id: number){
        patchState(store, (state)=>({
            items: state.items.map((item)=> item.id === id ? {... item, quantity: item.quantity +1} : item)
        }))
    },
    removeFromCart(id: number){
        patchState(store, (state)=>({
            items : state.items.filter(el => el.id !== id )
        }))
    }
}    
  })
)