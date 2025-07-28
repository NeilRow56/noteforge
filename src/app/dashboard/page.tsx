import { PageWrapper } from '@/components/page-wrapper'

export default async function Page() {
  return (
    <PageWrapper breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}>
      <h1>Notebooks</h1>
    </PageWrapper>
  )
}
