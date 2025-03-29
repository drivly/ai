import type { Website } from '@/site.config'
import { websiteKeys } from '@/site.config'
import { notFound } from 'next/navigation'
import '@/app/(sites)/sites/styles.css'
import DotdoSection from "@/components/landing/dotdo-section"
import HeroSection from "@/components/landing/hero-section"
import Particles from "@/components/magicui/particles"

// need to be able to render the specific website from the slug and throw not found if the slug is not found
export default async function HomePage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params

  const site = domain as Website

  if (site && !websiteKeys.includes(site)) {
    return notFound()
  }

  return (
    <>
      <div className="hero-glow-container">
        <h1 className="text-3xl font-bold mb-6">{domain}</h1>
        <HeroSection />
      </div>
      <DotdoSection />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />
    </>
  )
}
