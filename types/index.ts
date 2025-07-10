import { z } from 'zod';
import { 
  cartItemSchema, 
  insertCartSchema, 
  insertOrderItemSchema, 
  insertOrderSchema, 
  insertProductSchema, 
  shippingAddressSchema,
  paymentResultSchema,
} from "@/lib/validator";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  createdAt: Date;
  rating: string;
  numReviews: number;
};

export type Cart = z.infer<typeof insertCartSchema>

export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export type OrderItem = z.infer<typeof insertOrderItemSchema>

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: {name: string, email: string}

}

export type PaymentResult = z.infer<typeof paymentResultSchema>
