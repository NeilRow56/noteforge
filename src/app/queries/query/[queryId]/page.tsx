import { Editor } from '@/components/editor'

import React from 'react'
import { Toolbar } from '../_components/toolbar'

type Params = Promise<{
  queryId: string
}>

export default async function QueryIdPage({ params }: { params: Params }) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Toolbar />
      <Editor />
    </div>
  )
}
