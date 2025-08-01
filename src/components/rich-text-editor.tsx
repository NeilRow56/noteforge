'use client'

import {
  useEditor,
  EditorContent,
  useEditorState,
  type JSONContent
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Text from '@tiptap/extension-text'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline as Underline2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  PrinterIcon,
  Highlighter
} from 'lucide-react'
import { updateNote } from '@/server/notes'

interface RichTextEditorProps {
  content?: JSONContent[]
  noteId?: string
}

const RichTextEditor = ({ content, noteId }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Document,
      Paragraph,
      Text,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],

    immediatelyRender: false,
    autofocus: true,
    editable: true,
    injectCSS: false,
    onUpdate: ({ editor }) => {
      if (noteId) {
        const content = editor.getJSON()
        updateNote(noteId, { content })
      }
    },
    content: content ?? {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Getting started' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Welcome to the ' },
            {
              type: 'text',
              text: 'Simple Editor',
              marks: [{ type: 'italic' }]
            },
            { type: 'text', text: ' template! This template integrates ' },
            { type: 'text', text: 'open source', marks: [{ type: 'bold' }] },
            {
              type: 'text',
              text: ' UI components and Tiptap extensions licensed under '
            },
            { type: 'text', text: 'MIT', marks: [{ type: 'bold' }] },
            { type: 'text', text: '.' }
          ]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Integrate it by following the ' },
            {
              type: 'text',
              text: 'Tiptap UI Components docs',
              marks: [{ type: 'code' }]
            },
            { type: 'text', text: ' or using our CLI tool.' }
          ]
        },
        {
          type: 'codeBlock',
          content: [{ type: 'text', text: 'npx @tiptap/cli init' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Features' }]
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A fully responsive rich text editor with built-in support for common formatting and layout tools. Type markdown '
                },
                { type: 'text', text: '**', marks: [{ type: 'bold' }] },
                { type: 'text', text: ' or use keyboard shortcuts ' },
                { type: 'text', text: '⌘+B', marks: [{ type: 'code' }] },
                { type: 'text', text: ' for most all common markdown marks.' }
              ]
            }
          ]
        }
      ]
    }
  })

  const editorState = useEditorState({
    editor,
    selector: ctx => {
      if (!ctx.editor) return {}
      return {
        isBold: ctx.editor?.isActive('bold'),
        canBold: ctx.editor?.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor?.isActive('italic'),
        canItalic: ctx.editor?.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor?.isActive('strike'),
        canStrike: ctx.editor?.can().chain().focus().toggleStrike().run(),
        isUnderline: ctx.editor?.isActive('underline'),
        canUnderline: ctx.editor?.can().chain().focus().toggleUnderline().run(),
        isHighlight: ctx.editor?.isActive('highlight'),
        canHighlight: ctx.editor?.can().chain().focus().toggleHighlight().run(),
        isCode: ctx.editor?.isActive('code'),
        canCode: ctx.editor?.can().chain().focus().toggleCode().run(),
        isParagraph: ctx.editor?.isActive('paragraph'),
        isHeading1: ctx.editor?.isActive('heading', { level: 1 }),
        isHeading2: ctx.editor?.isActive('heading', { level: 2 }),
        isHeading3: ctx.editor?.isActive('heading', { level: 3 }),
        isBulletList: ctx.editor?.isActive('bulletList'),
        isOrderedList: ctx.editor?.isActive('orderedList'),
        isCodeBlock: ctx.editor?.isActive('codeBlock'),
        isBlockquote: ctx.editor?.isActive('blockquote'),
        canUndo: ctx.editor?.can().chain().focus().undo().run(),
        canRedo: ctx.editor?.can().chain().focus().redo().run()
      }
    }
  })

  const getActiveHeading = () => {
    if (editorState?.isHeading1) return 'H1'
    if (editorState?.isHeading2) return 'H2'
    if (editorState?.isHeading3) return 'H3'
    return 'H1'
  }

  return (
    <div className='bg-card text-card-foreground w-full max-w-7xl overflow-hidden rounded-lg border'>
      {/* Toolbar */}
      <div className='bg-muted/50 flex items-center gap-1 border-b p-2'>
        {/* Undo/Redo */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editorState?.canUndo}
          className='text-muted-foreground hover:text-foreground hover:bg-accent size-8 p-0'
        >
          <Undo className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editorState?.canRedo}
          className='text-muted-foreground hover:text-foreground hover:bg-accent size-8 p-0'
        >
          <Redo className='h-4 w-4' />
        </Button>
        <div className='bg-border mx-1 h-6 w-px' />
        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-foreground hover:bg-accent h-8 gap-1 px-2'
            >
              {getActiveHeading()}
              <ChevronDown className='h-3 w-3' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-popover border'>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
            >
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
            >
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
            >
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className='text-popover-foreground hover:bg-accent hover:text-accent-foreground'
            >
              Paragraph
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Lists */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isBulletList
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isOrderedList
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
        <div className='bg-border mx-1 h-6 w-px' />
        {/* Text Formatting */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editorState?.canBold}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isBold
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editorState?.canItalic}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isItalic
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editorState?.canStrike}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isStrike
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Strikethrough className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleCode().run()}
          disabled={!editorState?.canCode}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isCode
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          disabled={!editorState?.canUnderline}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isUnderline
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Underline2 className='h-4 w-4' />
        </Button>
        <div className='bg-border mx-1 h-6 w-px' />
        <div className='bg-border mx-1 h-6 w-px' />
        {/* Alignment */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          className={editor?.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          <AlignLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          className={
            editor?.isActive({ textAlign: 'center' }) ? 'is-active' : ''
          }
        >
          <AlignCenter className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          className={
            editor?.isActive({ textAlign: 'right' }) ? 'is-active' : ''
          }
        >
          <AlignRight className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          className={
            editor?.isActive({ textAlign: 'right' }) ? 'is-active' : ''
          }
        >
          <AlignRight className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleHighlight().run()}
          disabled={!editorState?.canHighlight}
          className={`hover:bg-accent size-8 p-0 ${
            editorState?.isHighlight
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Highlighter className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='sm'
          className='text-muted-foreground hover:text-foreground hover:bg-accent size-8 p-0'
          onClick={() => window.print()}
        >
          <PrinterIcon className='h-4 w-4' />
        </Button>
        {/* Spacer */}
        <div className='flex-1' />
      </div>

      {/* Editor Content */}
      <div className='bg-card min-h-96 p-6'>
        <EditorContent
          editor={editor}
          className='prose prose-neutral dark:prose-invert [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_code]:bg-muted max-w-none focus:outline-none [&_.ProseMirror]:min-h-96 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:px-1 [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:p-4'
        />
      </div>
    </div>
  )
}

export default RichTextEditor
