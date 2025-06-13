import { getUserById } from '@/lib/actions/user.actions';
import { auth } from 'auth';
import { Metadata } from 'next'
import  PaymentMethodForm  from 'app/(root)/payment-method/payment-method-form'

export const metadata: Metadata = {
  title: 'Payment method'
}

const PaymentMethodPage = async () => {

  const session = await auth()
  const userId = session?.user?.id
  if(!userId) throw new Error('User Id not found')
  const user = await getUserById(userId)

  return ( 
  <>
    <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
  </>
  )
  }
 
export default PaymentMethodPage;