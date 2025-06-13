'use server'

import { CartItem } from 'types'
import { cookies } from 'next/headers'
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from 'auth';
import { cartItemSchema, insertCartSchema } from '../validator';
import { prisma } from '../../../db/prisma'
import { revalidatePath } from 'next/cache';
import { Prisma } from 'generated/prisma';


// Calculate cart prices

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0
  )),
  shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
  taxPrice = round2(itemsPrice * 0.15),
  totalPrice = round2( itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  }
}

export const  addItemToCart = async (data: CartItem) => {
try{
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  //Check for cart cookie
  if (!sessionCartId) throw new Error('Cart session not found')
    //Get user and session Id
  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  //Get cart

  const cart = await getMyCart()

  // Parse and validate submitted item data
  const item = cartItemSchema.parse(data);

  //Find product in database

  const product = await prisma.product.findFirst({
  where: {id: item.productId}
  })

  if (!product) { throw new Error ('Product not found')}

  if(!cart) {
  // Create new cart
  const newCart = insertCartSchema.parse({
    userId: userId,
    items: [item],
    sessionCartId: sessionCartId,
    ...calcPrice([item])
  })
  //Add to database
  await prisma.cart.create({
    data: newCart
  })
  //Revalidate product page

  revalidatePath(`product/${product.slug}`)


  return {
    success: true,
    message: 
   `${product.name}added to the cart`,
  }}
  // else {
  //   // Check for existing item in cart
  //   const existItem = (cart.items as CartItem[]).find(
  //     (x) => x.productId === item.productId
  //   );
  //   // If not enough stock, throw error
  //   if (existItem) {
  //     if (product.stock < existItem.qty + 1) {
  //       throw new Error('Not enough stock');
  //     }
  
  //     // Increase quantity of existing item
  //     (cart.items as CartItem[]).find(
  //       (x) => x.productId === item.productId
  //     )!.qty = existItem.qty + 1;
  //   } else {
  //     // If stock, add item to cart
  //     if (product.stock < 1) throw new Error('Not enough stock');
  //     cart.items.push(item);
  //   }
  
  //   // Save to database
  //   await prisma.cart.update({
  //     where: { id: cart.id },
  //     data: {
  //       items: cart.items as Prisma.CartUpdateitemsInput[],
  //       ...calcPrice(cart.items as CartItem[]),
  //     },
  //   });
  
  //   revalidatePath(`/product/${product.slug}`);
  
  //   return {
  //     success: true,
  //     message: `${product.name} ${
  //       existItem ? 'updated in' : 'added to'
  //     } cart successfully`,
  //   };
  // }
 else {
  //Check if the product exist in the cart
  const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId )

   if(existItem) {
     //Check stock, throw an Error

     if(product.stock < existItem.qty +1 ) {
       throw new Error('Not enough stock')
     } 
    (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty +1
   } else {
  // if item is not exist in cart 
 //Check stock
 if(product.stock < 1) throw new Error('Not enough stock')
  //Add item to cart
   cart.items.push(item)}

  //Save to the database
  await prisma.cart.update({where:{
    id: cart.id
  }, 
  data: {
   items: cart.items as Prisma.CartUpdateitemsInput[],
   ...calcPrice(cart.items as CartItem[])
   }
})
 revalidatePath(`/product/${product.slug}`)

  return {
   success: true,
   message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`
  }
   }
 }
  
catch(error) {
return {
     success: false,
   message: formatError(error)
 }
 }}
 

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value

  //Check for cart cookie
  if (!sessionCartId) throw new Error('Cart session not found')

    //Get user and session Id
  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined 

  //Get cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? {userId: userId} : {sessionCartId: sessionCartId}
  })
  if (!cart) return undefined

  //Convert decimals and return

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })

}

export async function removeItemFromCart (productId: string) {
try{
  //Get session cart Id
const sessionCartId = (await cookies()).get('sessionCartId')?.value
if(!sessionCartId) throw new Error('Cart session not found')
  //Get product from database
const product = await prisma.product.findFirst({
  where:{id:productId}
})
if(!product) throw new Error('Product not found')
  //Get usert cart
const cart = await getMyCart()
if(!cart) throw new Error('Cart not found')
  //Check if cart has item
const existItem = (cart.items as CartItem[]).find((x) => x.productId === productId )
if(!existItem) throw new Error('Item not found')
  //Check if the cart has one item
if(existItem.qty === 1){
  //Remove the item from cart
  cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== productId )
} else {
  //Decrease  quantity of existing items
  (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = existItem.qty - 1
}
  //Update cart in data base

  await prisma.cart.update({
    where:{
      id: cart.id},
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[] ,
      ...calcPrice (cart.items as CartItem[])
    }
    })
    //Revalidate product page
revalidatePath(`/product/${product.slug}`)

return {
  success: true,
  message: `${product.name} ${(cart.items as CartItem[]).find((x) => x.productId === productId)
    ? 'updated'
    : 'removed from'
  } cart successfully` 
}
} catch(error)
{
return {
  success: false,
  message: formatError(error)
}

}}