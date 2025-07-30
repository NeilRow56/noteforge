'use client'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/store/use-editor-store'
import { LucideIcon, Undo2Icon } from 'lucide-react'

interface ToolbarButtonProps {
  onClick?: () => void
  isActive?: boolean
  icon: LucideIcon
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
        isActive && 'bg-neutral-200/80'
      )}
    >
      <Icon className='size-4' />
    </button>
  )
}

export const Toolbar = () => {
  const { editor } = useEditorStore()

  console.log('Toolbar editor:', { editor })
  const sections: {
    label: string
    icon: LucideIcon
    onClick: () => void
    isActive?: boolean
  }[][] = [
    [
      {
        label: 'Undo',
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run()
      }
    ]
  ]
  return (
    <div className='flex min-h-[40px] items-center gap-x-0.5 overflow-x-auto rounded-[24px] bg-[#F1F4F9] px-2.5'>
      {sections[0].map(item => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  )
}
