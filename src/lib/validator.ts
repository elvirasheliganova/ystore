import { z } from 'zod'
import { PAYMENT_METHODS } from './constants';
//import { formatNumberWithDecimals } from './utils'

// const currency = z
// .string()
// .refine((value) =>/ ^\d+(\.\d{2})?$/.test(formatNumberWithDecimals(Number(value))),
// 'Price must have exactly two decimal places')

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(value),
    "Price Must have two Decimal Places",
  );
//Schema for inserting products

export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name should have at least 3 characters'),
    slug: z.string().min(3, 'Slug should have at least 3 characters'),
    category: z.string().min(3, 'Category should have at least 3 characters'),
    brand: z.string().min(3, 'Brand should have at least 3 characters'),
    description: z.string().min(3, 'Description should have at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Product must have at least one image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency

  })
  //Schema for updating Product

  export const updateProductSchema = insertProductSchema.extend({
    id: z.string().min(1, 'Id is required')
  });

  //Schema for signing users in 

  export const signInFormSchema = z.object({
    email:z.string().email('Invalid email adddress'),
    password:z.string().min(6, 'Password must be at least 6 characters')
  })

  //Schema for signing users up 

  // export const signUpFormSchema = z.object({
  //   name: z.string().min(6, 'Name must be at least 6 characters'),
  //   email: z.string().email('Invalid email adddress'),
  //   password: z.string().min(6, 'Password must be at least 6 characters'),
  //   confirmPassword: z.string().min(6, 'Password must be at least 6 characters')

  // })
  // .refine((data) => 
  //   data.password === data.confirmPassword,
  // {
  //   message:"Passwords don't match",
  //   path: ['confirmPassword']

  // }
     
  // )

  export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().min(3, 'Email must be at least 3 characters'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    confirmPassword: z
      .string()
      .min(3, 'Confirm password must be at least 3 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

  // Cart Schemas

  export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Product is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    slug: z.string().min(1, 'Slug is required'),
    image: z.string().min(1, 'Image is required'),
    price: currency
  })

export const insertCartSchema = z.object({

  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart id is requared'),
  userId: z.string().optional().nullable()

})

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Street must be at least 3 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  
})

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Pyament method is required'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  });

  export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'User is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
      message: 'Invalid payment method'
  }),
    shippingAddress: shippingAddressSchema
  })

  export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency ,
    qty: z.number()
  })

  export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
  })

  export const updateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().min(3, 'Email must be at least 3 characters')
  })

  export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, 'Id is required'),
    role: z.string().min(1, 'Role is required')
  })