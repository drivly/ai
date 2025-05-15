
import { MarkdownContent } from '@/components/shared/markdown-content'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { models } from 'language-models'
import { ArrowLeft, BrainCircuit, Clock, Code, DollarSign, ExternalLink, FileText, Image, Zap } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { formatDate } from '../../utils'
import { Endpoint } from './types'

export const metadata = {
  title: 'Do Services-as-Software',
  description: 'Build AI-native businesses with agentic services through simple APIs and SDKs',
  metadataBase: new URL('https://dotdo.ai'),
  alternates: {
    canonical: 'https://dotdo.ai',
  },
} satisfies Metadata

export const revalidate = 3600

async function ModelDetailPage({ params }: { params: { lab: string; model: string } }) {
  const model = models.find((model) => model.permaslug === `${params.lab}/${params.model}`)

  if (!model) {
    return (
      <div className='container mx-auto max-w-6xl p-6'>
        <Link href={`/`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
          <ArrowLeft className='mr-1 h-4 w-4' />
          Back
        </Link>
        <Card className='bg-background/30 border-none backdrop-blur-sm'>
          <CardContent className='flex flex-col items-center justify-center space-y-4 pt-6'>
            <h2 className='text-2xl font-bold'>Model not found</h2>
            <p className='text-muted-foreground'>The model you're looking for doesn't exist or has been removed.</p>
            <Button variant='outline' asChild>
              <Link href='/'>Browse all models</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const endpoint = model.endpoint as Endpoint | undefined
  const providerInfo = endpoint?.providerInfo
  
  console.log('🚀 ~ ModelDetailPage ~ endpoint:', model.providers)
  // Get the blog URL if available from the model description
  const blogUrlMatch = model.description?.match(/\[blog post here\]\((https:\/\/[^\)]+)\)/)
  const blogUrl = blogUrlMatch ? blogUrlMatch[1] : null

  return (
    <div className='container mx-auto max-w-6xl space-y-8 px-3 py-24 md:py-32 xl:px-0'>
      <Link href={`/`} className='hover:text-primary mb-6 inline-flex items-center text-sm text-gray-500 transition-colors'>
        <ArrowLeft className='mr-1 h-4 w-4' />
        Back
      </Link>
      {/* Header Section */}
      <div className='space-y-4'>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-start'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>{model.name}</h1>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline' className='bg-background/20 backdrop-blur-sm'>
                {model.group}
              </Badge>
              {model.inputModalities.map((modality) => (
                <Badge key={`input-${modality}`} variant='secondary' className='bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'>
                  Input: {modality}
                </Badge>
              ))}
              {model.outputModalities.map((modality) => (
                <Badge key={`output-${modality}`} variant='secondary' className='bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'>
                  Output: {modality}
                </Badge>
              ))}
            </div>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <Clock size={14} />
              <span>Released: {formatDate(model.createdAt)}</span>
              <span className='mx-1'>•</span>
              <span>Updated: {formatDate(model.updatedAt)}</span>
            </div>
          </div>
          {blogUrl && (
            <Button variant='outline' asChild className='gap-2'>
              <a href={blogUrl} target='_blank' rel='noopener noreferrer'>
                <span>Read Blog Post</span>
                <ExternalLink size={16} />
              </a>
            </Button>
          )}
        </div>
        <Separator className='bg-border' />
      </div>
      <Card className='bg-background/30 border-none py-0 backdrop-blur-sm'>
        <CardContent>
          <MarkdownContent markdown={model.description} className='prose-base' />
        </CardContent>
      </Card>

      <Separator className='bg-border' />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {model.contextLength && (
          <Card className='bg-background/30 h-full border-none backdrop-blur-sm'>
            <CardContent className='flex gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10'>
                <FileText className='h-5 w-5 text-rose-500' />
              </div>
              <div>
                <h3 className='mb-1 font-medium'>{model.contextLength?.toLocaleString()} Token Context</h3>
                <p className='text-muted-foreground text-sm'>Process and analyze large documents and conversations.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {endpoint?.supportsReasoning && (
          <Card className='bg-background/30 h-full border-none backdrop-blur-sm'>
            <CardContent className='flex gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10'>
                <BrainCircuit className='h-5 w-5 text-violet-500' />
              </div>
              <div>
                <h3 className='mb-1 font-medium'>Hybrid Reasoning</h3>
                <p className='text-muted-foreground text-sm'>Choose between rapid responses and extended, step-by-step processing for complex tasks.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {model.hasTextOutput && (
          <Card className='bg-background/30 h-full border-none backdrop-blur-sm'>
            <CardContent className='flex gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10'>
                <Code className='h-5 w-5 text-blue-500' />
              </div>
              <div>
                <h3 className='mb-1 font-medium'>Advanced Coding</h3>
                <p className='text-muted-foreground text-sm'>Improved capabilities in front-end development and full-stack updates.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {endpoint?.hasChatCompletions && (
          <Card className='bg-background/30 h-full border-none backdrop-blur-sm'>
            <CardContent className='flex gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10'>
                <Zap className='h-5 w-5 text-green-500' />
              </div>
              <div>
                <h3 className='mb-1 font-medium'>Agentic Workflows</h3>
                <p className='text-muted-foreground text-sm'>Autonomously navigate multi-step processes with improved reliability.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {model.inputModalities?.includes('image') && (
          <Card className='bg-background/30 h-full border-none backdrop-blur-sm'>
            <CardContent className='flex gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10'>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className='h-5 w-5 text-cyan-500' />
              </div>
              <div>
                <h3 className='mb-1 font-medium'>Vision Capabilities</h3>
                <p className='text-muted-foreground text-sm'>Process and understand images alongside text inputs.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Separator className='bg-border' />

      {/* Provider Comparison Table */}
      {model.providers && model.providers.length > 0 && (
        <div className='space-y-4 pt-4'>
          <h2 className='text-xl font-semibold'>Available On</h2>
          <Card className='bg-background/30 border-none py-0 backdrop-blur-sm'>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow className='border-border bg-background/50'>
                    <TableHead className='p-4'>Provider</TableHead>
                    <TableHead className='p-4'>Model ID</TableHead>
                    <TableHead className='p-4 text-right'>Context</TableHead>
                    <TableHead className='p-4 text-right'>Max Output</TableHead>
                    <TableHead className='p-4 text-right whitespace-nowrap'>Input Cost</TableHead>
                    <TableHead className='p-4 text-right whitespace-nowrap'>Output Cost</TableHead>
                    <TableHead className='p-4 text-right'>Throughput</TableHead>
                    <TableHead className='p-4 text-right'>Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='divide-border/40 divide-y'>
                  {model.providers.map((provider, index: number) => (
                    <TableRow key={index} className='hover:bg-background/40'>
                      <TableCell className='p-4 font-medium'>{provider.name}</TableCell>
                      <TableCell className='text-foreground/70 font-ibm p-4 text-xs'>{provider.slug || '-'}</TableCell>
                      <TableCell className='p-4 text-right'>{provider.context ? `${(provider.context / 1000).toFixed(0)}K` : '-'}</TableCell>
                      <TableCell className='p-4 text-right'>{provider.maxCompletionTokens ? `${(provider.maxCompletionTokens / 1000).toFixed(0)}K` : '-'}</TableCell>
                      <TableCell className='p-4 text-right'>{provider.inputCost != null ? `$${provider.inputCost.toFixed(2)}/M` : '-'}</TableCell>
                      <TableCell className='p-4 text-right'>{provider.outputCost != null ? `$${provider.outputCost.toFixed(2)}/M` : '-'}</TableCell>
                      <TableCell className='p-4 text-right'>{provider.throughput ? `${provider.throughput.toFixed(1)} t/s` : '-'}</TableCell>
                      <TableCell className='p-4 text-right'>{provider.latency ? `${provider.latency.toFixed(0)} ms` : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      <Separator className='bg-border' />
      <Tabs defaultValue='pricing' className='w-full'>
        <TabsList className='bg-background/20 mb-6 backdrop-blur-sm'>
          <TabsTrigger value='pricing'>Pricing</TabsTrigger>
          {providerInfo && <TabsTrigger value='provider'>Provider</TabsTrigger>}
        </TabsList>

        <TabsContent value='pricing' className='space-y-4'>
          {endpoint?.pricing ? (
            <Card className='bg-background/30 border-none backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <DollarSign size={18} />
                  Standard Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                  {endpoint.pricing.prompt && parseFloat(endpoint.pricing.prompt) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Input Tokens</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.prompt}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per 1K tokens</p>
                      </CardContent>
                    </Card>
                  ) : null}

                  {endpoint.pricing.completion && parseFloat(endpoint.pricing.completion) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Output Tokens</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.completion}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per 1K tokens</p>
                      </CardContent>
                    </Card>
                  ) : null}

                  {endpoint.pricing.image && parseFloat(endpoint.pricing.image) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Image Processing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.image}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per image</p>
                      </CardContent>
                    </Card>
                  ) : null}
                  {endpoint.pricing.request && parseFloat(endpoint.pricing.request) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Request</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.request}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per request</p>
                      </CardContent>
                    </Card>
                  ) : null}
                  {endpoint.pricing.inputCacheRead && parseFloat(endpoint.pricing.inputCacheRead) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Input Cache Read</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.inputCacheRead}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per 1K tokens</p>
                      </CardContent>
                    </Card>
                  ) : null}
                  {endpoint.pricing.inputCacheWrite && parseFloat(endpoint.pricing.inputCacheWrite) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Input Cache Write</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.inputCacheWrite}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per 1K tokens</p>
                      </CardContent>
                    </Card>
                  ) : null}
                  {endpoint.pricing.webSearch && parseFloat(endpoint.pricing.webSearch) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Web Search</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.webSearch}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per search</p>
                      </CardContent>
                    </Card>
                  ) : null}
                  {endpoint.pricing.internalReasoning && parseFloat(endpoint.pricing.internalReasoning) > 0 ? (
                    <Card className='border-border/50 bg-background/20 border'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-base font-medium'>Internal Reasoning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='text-foreground text-xl font-bold'>${endpoint.pricing.internalReasoning}</div>
                        <p className='text-muted-foreground mt-1 text-xs'>per unit</p>
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
                {endpoint.pricing.discount && endpoint.pricing.discount > 0 ? (
                  <div className='mt-4 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-center'>
                    <p className='text-sm font-medium text-green-300'>Applied Discount: {endpoint.pricing.discount * 100}%</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <p className='text-muted-foreground'>Pricing information not available for this model.</p>
          )}

          {endpoint?.variablePricings && endpoint.variablePricings.length > 0 ? (
            <Card className='bg-background/30 mt-6 border-none backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <DollarSign size={18} />
                  Variable Pricing Tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                  {endpoint.variablePricings.map((vp, idx) => {
                    let costDisplay = ''
                    let unit = ''

                    if (vp.request) {
                      costDisplay = `Request: $${vp.request}`
                    } else if (vp.prompt && vp.completions) {
                      costDisplay = `Prompt: $${vp.prompt} / Completion: $${vp.completions}`
                      unit = '(per 1K tokens)'
                    } else if (vp.prompt) {
                      costDisplay = `Prompt: $${vp.prompt}`
                      unit = '(per 1K tokens)'
                    } else if (vp.completions) {
                      costDisplay = `Completion: $${vp.completions}`
                      unit = '(per 1K tokens)'
                    }

                    return (
                      <div key={idx} className='border-border/50 bg-background/20 flex h-full flex-col rounded-md border p-4'>
                        <p className='text-base font-semibold capitalize'>{vp.type.replace(/-/g, ' ')}</p>
                        <p className='text-muted-foreground text-sm'>
                          Threshold: <span className='text-foreground/90 font-medium capitalize'>{vp.threshold}</span>
                        </p>
                        {costDisplay ? (
                          <p className='mt-0.5 text-sm'>
                            {costDisplay} {unit}
                          </p>
                        ) : (
                          <p className='text-muted-foreground mt-0.5 text-sm'>Pricing details not specified.</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {providerInfo && (
          <TabsContent value='provider' className='space-y-4'>
            <Card className='bg-background/30 border-none backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  Provider Information
                  {providerInfo?.isPrimaryProvider ? (
                    <Badge variant='outline' className='border-green-500/70 bg-green-500/10 text-xs text-green-400'>
                      Primary
                    </Badge>
                  ) : null}
                </CardTitle>
                {(providerInfo?.displayName || providerInfo?.name || providerInfo?.headquarters || endpoint?.providerGroup) && (
                  <CardDescription className='flex flex-col gap-0.5 pt-1'>
                    <span>
                      {providerInfo.displayName || providerInfo.name}
                      {providerInfo.headquarters && (providerInfo.displayName || providerInfo.name) ? ` • ${providerInfo.headquarters}` : providerInfo.headquarters}
                    </span>
                    {endpoint.providerGroup && (providerInfo.displayName || providerInfo.name) !== endpoint.providerGroup && (
                      <span className='text-muted-foreground text-xs'>Group: {endpoint.providerGroup}</span>
                    )}
                  </CardDescription>
                )}
                {/* Display Endpoint Name if different and relevant */}
                {endpoint && endpoint.name && endpoint.name !== model.name && endpoint.name !== (providerInfo?.displayName || providerInfo?.name) && (
                  <p className='text-muted-foreground pt-1 text-sm'>
                    Endpoint: <span className='text-foreground/80 font-medium'>{endpoint.name}</span>
                  </p>
                )}
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                {(providerInfo?.baseUrl && providerInfo.baseUrl.toLowerCase() !== 'url') || providerInfo?.statusPageUrl ? (
                  <div className='space-y-1 pb-2'>
                    {providerInfo.baseUrl && providerInfo.baseUrl.toLowerCase() !== 'url' ? (
                      <div className='text-sm'>
                        <span className='font-medium'>Base URL:</span>{' '}
                        <a href={providerInfo.baseUrl} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>
                          {providerInfo.baseUrl}
                        </a>
                      </div>
                    ) : null}
                    {providerInfo.statusPageUrl ? (
                      <div className='text-sm'>
                        <span className='font-medium'>Status Page:</span>{' '}
                        <a href={providerInfo.statusPageUrl} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>
                          {providerInfo.statusPageUrl}
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Model Specifications Accordion - MOVED DATA POLICY AFTER THIS */}
                {endpoint && (
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem value='item-1' className='border-none'>
                      <AccordionTrigger className='py-2 hover:no-underline'>
                        <h3 className='text-foreground/80 text-base font-medium'>Model & Endpoint Specifications</h3>
                      </AccordionTrigger>
                      <AccordionContent className='space-y-2 pt-2'>
                        {(endpoint.isHidden || endpoint.isDeranked || endpoint.isDisabled) && (
                          <div className='flex flex-wrap gap-2 pb-1'>
                            {endpoint.isHidden ? (
                              <Badge variant='destructive' className='border-amber-500/50 bg-amber-500/20 text-amber-400'>
                                Hidden
                              </Badge>
                            ) : null}
                            {endpoint.isDeranked ? (
                              <Badge variant='destructive' className='border-orange-500/50 bg-orange-500/20 text-orange-400'>
                                De-ranked
                              </Badge>
                            ) : null}
                            {endpoint.isDisabled ? <Badge variant='destructive'>Disabled</Badge> : null}
                          </div>
                        )}
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                          {endpoint.id ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Endpoint ID</span>
                              <span className='font-mono text-xs'>{endpoint.id}</span>
                            </div>
                          ) : null}
                          {endpoint.modelVariantPermaslug || endpoint.modelVariantSlug ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Model Variant ID</span>
                              <span className='font-mono text-xs'>{endpoint.modelVariantPermaslug || endpoint.modelVariantSlug}</span>
                            </div>
                          ) : null}
                          {endpoint.providerModelId ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Provider Model ID</span>
                              <span className='font-mono text-xs'>{endpoint.providerModelId}</span>
                            </div>
                          ) : null}
                          {endpoint.variant ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Variant</span>
                              <span className='font-mono'>{endpoint.variant}</span>
                            </div>
                          ) : null}
                          {endpoint.quantization ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Quantization</span>
                              <span className='font-mono'>{endpoint.quantization}</span>
                            </div>
                          ) : null}
                          {endpoint.maxCompletionTokens != null ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Max Output Tokens</span>
                              <span className='font-mono'>{endpoint.maxCompletionTokens.toLocaleString()}</span>
                            </div>
                          ) : null}
                          {endpoint.maxPromptTokens != null ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Max Prompt Tokens</span>
                              <span className='font-mono'>{endpoint.maxPromptTokens.toLocaleString()}</span>
                            </div>
                          ) : null}
                          {endpoint.maxPromptImages != null ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Max Prompt Images</span>
                              <span className='font-mono'>{endpoint.maxPromptImages}</span>
                            </div>
                          ) : null}
                          {endpoint.maxTokensPerImage != null ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Max Tokens Per Image</span>
                              <span className='font-mono'>{endpoint.maxTokensPerImage.toLocaleString()}</span>
                            </div>
                          ) : null}
                          {endpoint.supportedParameters && endpoint.supportedParameters.length > 0 ? (
                            <div className='border-border/50 bg-background/20 flex flex-col rounded-md border p-3 sm:col-span-2'>
                              <span className='mb-1 text-sm font-medium'>Supported Parameters</span>
                              <div className='mt-1 flex flex-wrap gap-1'>
                                {endpoint.supportedParameters.map((param: string, idx: number) => (
                                  <Badge key={idx} variant='secondary' className='bg-background/40 text-xs'>
                                    {param}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          {endpoint.supportsToolParameters !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Tool Parameters</span>
                              <Badge variant={endpoint.supportsToolParameters ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.supportsToolParameters ? 'Supported' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.supportsReasoning !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Reasoning</span>
                              <Badge variant={endpoint.supportsReasoning ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.supportsReasoning ? 'Supported' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.hasChatCompletions !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Chat Completions</span>
                              <Badge variant={endpoint.hasChatCompletions ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.hasChatCompletions ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.hasCompletions !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Text Completions</span>
                              <Badge variant={endpoint.hasCompletions ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.hasCompletions ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.canAbort !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Can Abort Generation</span>
                              <Badge variant={endpoint.canAbort ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.canAbort ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.isFree !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Free Service</span>
                              <Badge variant={endpoint.isFree ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.isFree ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.isSelfHosted !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Self Hosted</span>
                              <Badge variant={endpoint.isSelfHosted ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.isSelfHosted ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.isByok !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>BYOK Enabled</span>
                              <Badge variant={endpoint.isByok ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.isByok ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.moderationRequired !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Moderation Required</span>
                              <Badge variant={endpoint.moderationRequired ? 'destructive' : 'outline'} className='bg-opacity-50'>
                                {endpoint.moderationRequired ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.supportsMultipart !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Multipart Support</span>
                              <Badge variant={endpoint.supportsMultipart ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.supportsMultipart ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.isCloaked !== undefined ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Is Cloaked</span>
                              <Badge variant={endpoint.isCloaked ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.isCloaked ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                          {endpoint.limitRpm != null ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>RPM Limit</span>
                              <span className='font-mono'>{endpoint.limitRpm.toLocaleString()}</span>
                            </div>
                          ) : null}
                          {endpoint.limitRpd != null ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>RPD Limit</span>
                              <span className='font-mono'>{endpoint.limitRpd.toLocaleString()}</span>
                            </div>
                          ) : null}
                          {endpoint.providerRegion ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Provider Region</span>
                              <span className='font-mono'>{endpoint.providerRegion}</span>
                            </div>
                          ) : null}
                          {endpoint.features?.supportsDocumentUrl !== undefined && endpoint.features?.supportsDocumentUrl !== null ? (
                            <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                              <span className='text-sm'>Supports Document URL</span>
                              <Badge variant={endpoint.features.supportsDocumentUrl ? 'default' : 'outline'} className='bg-opacity-50'>
                                {endpoint.features.supportsDocumentUrl ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          ) : null}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* Data Policy - MOVED HERE */}
                {providerInfo?.dataPolicy && (
                  <div className='space-y-2 pt-3'>
                    {' '}
                    {/* Added pt-3 for spacing from accordion */}
                    <h3 className='text-foreground/80 text-base font-medium'>Data Policy</h3>
                    <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                      {providerInfo.dataPolicy.training !== undefined ? (
                        <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                          <span className='text-sm'>Training on Data</span>
                          <Badge variant={providerInfo.dataPolicy.training ? 'destructive' : 'outline'}>{providerInfo.dataPolicy.training ? 'Yes' : 'No'}</Badge>
                        </div>
                      ) : null}
                      {providerInfo.dataPolicy.retainsPrompts !== undefined ? (
                        <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                          <span className='text-sm'>Retains Prompts</span>
                          <Badge variant={providerInfo.dataPolicy.retainsPrompts ? 'destructive' : 'outline'}>{providerInfo.dataPolicy.retainsPrompts ? 'Yes' : 'No'}</Badge>
                        </div>
                      ) : null}
                      {providerInfo.dataPolicy.retentionDays != null ? (
                        <div className='border-border/50 bg-background/20 flex items-center justify-between rounded-md border p-3'>
                          <span className='text-sm'>Retention Period</span>
                          <span className='font-mono'>{providerInfo.dataPolicy.retentionDays} days</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className='flex flex-wrap gap-2 pt-2'>
                  {providerInfo.dataPolicy?.termsOfServiceUrl && (
                    <Button variant='outline' size='sm' asChild>
                      <a href={providerInfo.dataPolicy.termsOfServiceUrl} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1'>
                        Terms of Service <ExternalLink size={14} />
                      </a>
                    </Button>
                  )}
                  {providerInfo.dataPolicy?.privacyPolicyUrl && (
                    <Button variant='outline' size='sm' asChild>
                      <a href={providerInfo.dataPolicy.privacyPolicyUrl} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1'>
                        Privacy Policy <ExternalLink size={14} />
                      </a>
                    </Button>
                  )}
                  {providerInfo.dataPolicy?.dataPolicyUrl && (
                    <Button variant='outline' size='sm' asChild>
                      <a href={providerInfo.dataPolicy.dataPolicyUrl} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1'>
                        Data Policy <ExternalLink size={14} />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default withSitesWrapper({ WrappedPage: ModelDetailPage, minimal: true, explicitDomain: 'models.do', withCallToAction: true })
