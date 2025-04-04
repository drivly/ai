import { withSitesNavbar } from '@/components/sites/with-sites-navbar'
import { ComponentType } from 'react'

export const withModelsNavbar = <TProps extends { params: Promise<{ domain?: string; provider?: string; model?: string; integration?: string; action?: string }> }>(
  Component: ComponentType<TProps>
) => {
  const WrappedComponent = (props: any) => {
    return <Component {...props} />
  }
  
  const NavbarWrappedComponent = withSitesNavbar(WrappedComponent)
  
  return (props: TProps) => {
    return <NavbarWrappedComponent params={props.params} />
  }
}
