import { Suspense } from 'react'
import { ResetPasswordForm } from './_components/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
