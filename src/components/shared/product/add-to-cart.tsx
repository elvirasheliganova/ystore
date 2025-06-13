'use client'

import { Cart, CartItem } from "types";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import { Plus, Minus, Loader } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import  { addItemToCart, removeItemFromCart}  from "src/lib/actions/cart.actions";


const AddToCart = ({cart,item}: {cart?: Cart,item: Omit<CartItem, 'cartId'>}) => {

  const router = useRouter()

  const [ isPending, startTransition ] = useTransition()

  const handleAddToCart = async () => {

    startTransition(async () => {

    const res= await addItemToCart(item)
    if(!res.success) {
    
      toast.error(res.message)
      console.log('Error')
  return
  }
    toast(
      res.message,
      {
      action: {
      label: 'Go to cart',
      onClick: () => router.push('/cart')}
       })
      })
    }


const handleRemoveFromCart = async() => {

  startTransition(async () => {
    const res = await removeItemFromCart(item.productId)

    toast(
      res.message,
   )
   return
})
}

const existItem = (cart && cart.items)?.find((x) => x.productId === item.productId)

return existItem ?

   (
  <div>
  <Button  type='button' disabled={isPending} onClick={handleRemoveFromCart}>
     { isPending ? (
      <Loader className="w-4 h-4 animate-spin" />
     ) : (
     <Minus className="w-4 h-4"/> )}
  </Button>
  <span className="px-2">{existItem.qty}</span>

  <Button  type='button' disabled={isPending} onClick={handleAddToCart}>
  { isPending ? (
      <Loader className="w-4 h-4 animate-spin" />
     ) : (
     <Plus className="w-4 h-4"/> )}
  </Button>
  </div>
 ) : (
  <Button className='w-full' type='button' onClick={handleAddToCart}>
    { isPending ? (
      <Loader className="w-4 h-4 animate-spin" />
     ) : (
     <Plus className="w-4 h-4"/> )}
      Add to cart
  </Button>)
}

 
export default AddToCart