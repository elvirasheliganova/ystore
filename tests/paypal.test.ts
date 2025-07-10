import { generateAccessToken, paypal } from "../src/lib/paypal";




//Test to generate access token from paypal
test('generates a PayPal access token', async () => {
  const tokenResponse = await generateAccessToken();
  console.log(tokenResponse);
  // Should be a string that is not empty
  expect(typeof tokenResponse).toBe('string');
  expect(tokenResponse.length).toBeGreaterThan(0);
});

//Test to create a paypal order

test('creates a PayPal order', async () => {
  const token = await generateAccessToken();
  const price = 10.0; // Example price for testing

  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);

  // Ensure the order response contains expected fields
  expect(orderResponse).toHaveProperty('id');
  expect(orderResponse).toHaveProperty('status');
  expect(orderResponse.status).toBe('CREATED'); // PayPal returns 'CREATED' for new orders
});

// Test to capture payment with mock order

test('simulate capturing a payment from an order', async () => {
  const orderId = '100';

  const mockCapturePayment = jest
  .spyOn(paypal, 'capturePayment')
  .mockResolvedValue({
    status:'COMPLETED',
  });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty('status', 'COMPLETED');

  mockCapturePayment.mockRestore()


})