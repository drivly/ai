import DotdoSection from "@/components/landing/dotdo-section"
import HeroSection from "@/components/landing/hero-section"
import Particles from "@/components/magicui/particles"

export default function Page() {
  return (
    <>
      <div className="hero-glow-container">
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

