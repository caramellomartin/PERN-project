import { type PropsWithChildren } from 'react'

export default function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <div className=' text-center my-4 p-2 rounded-md bg-rose-600 text-white font-bold uppercase'>
      {children}
    </div>
  )
}
