import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { fetchProjectByDomain } from '@/lib/fetchProjectByDomain';
import { createDynamicPayloadConfig } from '@/lib/createDynamicPayloadConfig';

type Params = {
  domain: string;
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { domain } = await params;
  const project = await fetchProjectByDomain(domain);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  
  const config = await createDynamicPayloadConfig(project);
  return generatePageMetadata({ config: Promise.resolve(config), params: { segments: [] }, searchParams: {} });
}

export default async function ProjectAdminPage({ params }: { params: Promise<Params> }) {
  const { domain } = await params;
  
  const project = await fetchProjectByDomain(domain);
  
  if (!project) {
    notFound();
  }
  
  const config = await createDynamicPayloadConfig(project);
  
  const payload = await getPayload({ config });
  
  return (
    <div>
      <RootPage 
        config={Promise.resolve(config)} 
        params={{ segments: [] }}
        searchParams={{}}
      />
    </div>
  );
}
