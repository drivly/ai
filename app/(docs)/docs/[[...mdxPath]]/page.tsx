import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '@/mdx-components'

export const generateStaticParams = async () => {
  try {
    const paramsPromise = generateStaticParamsFor('mdxPath')()
    const params = await Promise.resolve(paramsPromise)
    
    return params.filter((param: any) => {
      if (!param.mdxPath || !Array.isArray(param.mdxPath)) return true
      return !param.mdxPath.includes('sdks')
    })
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

type Props = {
  params: Promise<{ mdxPath: string[] }>
}

export async function generateMetadata(props: Props) {
  try {
    const params = await props.params
    if (params.mdxPath && params.mdxPath.includes('sdks')) {
      return { title: 'SDK Documentation' }
    }
    const { metadata } = await importPage(params.mdxPath)
    return metadata
  } catch (error) {
    console.error('Error generating metadata:', error)
    return { title: 'Documentation' }
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: Props) {
  try {
    const params = await props.params
    
    if (params.mdxPath && params.mdxPath.includes('sdks')) {
      return (
        <Wrapper toc={[]} metadata={{ title: 'SDK Documentation' }}>
          <div className="nextra-body">
            <h1>SDK Documentation</h1>
            <p>Please refer to the SDK documentation for more information.</p>
          </div>
        </Wrapper>
      )
    }
    
    const result = await importPage(params.mdxPath)
    const { default: MDXContent, toc, metadata } = result
    return (
      <Wrapper toc={toc} metadata={metadata}>
        <MDXContent {...props} params={params} />
      </Wrapper>
    )
  } catch (error) {
    console.error('Error rendering page:', error)
    return (
      <Wrapper toc={[]} metadata={{ title: 'Error' }}>
        <div className="nextra-body">
          <h1>Error Loading Page</h1>
          <p>There was an error loading this page. Please try again later.</p>
        </div>
      </Wrapper>
    )
  }
}
