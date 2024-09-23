'use client'
import store from '@/redux/store'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Provider } from 'react-redux'

export default function App ({ children }: { children: React.ReactNode }) {
  return (
    <SkeletonTheme baseColor='#d9d9d9'>
      <Provider store={store}>{children}</Provider>
    </SkeletonTheme>
  )
}
