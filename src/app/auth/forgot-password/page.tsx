import { Suspense } from 'react'
import { ForgotPasswordForm } from './_components/forgot-password-form'

const ForgotPasswordPage = async () => {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
