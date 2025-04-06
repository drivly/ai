import { SitesNavbar } from "@/components/sites/navbar/sites-navbar";
import { Fragment } from "react";

export default function SitesLayout({ children, params }: { children: React.ReactNode, params: Promise<{ domain?: string | undefined; }> }) {
  return (
    <Fragment>
      <SitesNavbar params={params} />
      <main className='flex-1 overflow-x-hidden'>
        {children}
      </main>
    </Fragment>
  )
}