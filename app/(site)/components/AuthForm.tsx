'use client'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '@/app/components/input/Input'
import { error } from 'console'
import Button from '@/app/components/Button'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { toast } from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
type Variant = 'LOGIN' | 'REGISTER'
const AuthForm = () => {
  const session = useSession()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (session?.status === 'authenticated') {
      console.log('authenticated')
      router.push('/users')
    }
  }, [session.status])

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') setVariant('REGISTER')
    else setVariant('LOGIN')
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = data => {
    setIsLoading(true)

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => {
          setIsLoading(false)
        })
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then(callback => {
          if (callback?.error) {
            toast.error('Invalid credentials')
          }

          if (callback?.ok && !callback?.error) {
            toast.success('Logged in!')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)

    signIn(action, {
      redirect: false,
    })
      .then(callback => {
        if (callback?.error) {
          toast.error('Something went wrong!')
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!')
        }
      })
      .finally(() => setIsLoading(false))
  }
  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 sm:rounded-lg sm:px-10 shadow'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              disabled={isLoading}
              label='Name'
              register={register}
              id='name'
              errors={errors}
            />
          )}

          <Input
            disabled={isLoading}
            label='Email'
            type='email'
            register={register}
            id='email'
            errors={errors}
          />
          <Input
            disabled={isLoading}
            label='Password'
            type='password'
            register={register}
            id='password'
            errors={errors}
          />
          <div>
            <Button type='submit' fullWidth disabled={isLoading}>
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        {/* Continue with */}
        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex justify-center items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>
        </div>
        {/* SocialButton */}
        <div className='mt-6 flex gap-2'>
          <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
          <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
        </div>

        <div className='mt-6 flex gap-2 justify-center text-sm px-2 text-gray-500'>
          <div>{variant === 'LOGIN' ? 'New to Messenger?' : 'Already have account'}</div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
