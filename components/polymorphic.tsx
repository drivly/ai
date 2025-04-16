import Link from 'next/link'
import { ElementType } from 'react'

/**
 * Wrapper component that renders a specified component and props.
 *
 * @template TAs - The element type of the component to render.
 * @param {Object} props - The props for the component.
 * @param {TAs} [props.as] - The element type to render. Defaults to `Link`.
 * @returns {React.ReactElement} - The rendered component.
 */

export const Wrapper = <TAs extends ElementType = typeof Link>(props: { as?: TAs } & React.ComponentProps<TAs>): React.ReactElement => {
  const { as: Component = Link, ...rest } = props
  return <Component {...rest} />
}
