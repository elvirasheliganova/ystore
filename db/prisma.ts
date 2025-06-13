// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import { PrismaClient } from '@/prisma/client';
// import ws from 'ws';

// console.log(process.env.DATABASE_URL)

// // Sets up WebSocket connections, which enables Neon to use WebSocket communication.
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`;

// // Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
// const pool = new Pool({ connectionString });

// // Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
// const adapter = new PrismaNeon(pool);

// // Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
// export const prisma = new PrismaClient({ adapter }).$extends({
//   result: {
//     product: {
//       price: {
//         compute(product) {
//           return product.price.toString();
//         },
//       },
//       rating: {
//         compute(product) {
//           return product.rating.toString();
//         },
//       },
//     },
//   },
// });
import { PrismaClient }  from '../generated/prisma'
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

import ws from 'ws';

neonConfig.webSocketConstructor = ws;

console.log(process.env.DATABASE_URL)

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

//const pool = new Pool({ connectionString });
const adapter = new PrismaNeon({connectionString}); // no 'new'

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toFixed(2); // 👈 
        },
      },
    //product: {
      //price: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
       // compute(product: { price: { toString: () => any; }; }) {
    //   return product.price.toString();
       // },
      //},
      rating: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        compute(product: { rating: { toString: () => any; }; }) {
          return product.rating.toString();
        },
      },
    },
  },
});
