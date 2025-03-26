import type { ElementType } from 'react'

/**
 * Wrapper component that renders a specified component and props.
 *
 * @template TAs - The element type of the component to render.
 * @param {Object} props - The props for the component.
 * @param {TAs} [props.as] - The element type to render. Defaults to `div`.
 * @returns {React.ReactElement} - The rendered component.
 */
export const Wrapper = <TAs extends ElementType = 'div'>(props: { as?: TAs } & React.ComponentPropsWithRef<TAs>): React.ReactElement => {
  const { as: Component = 'div', ...rest } = props
  return <Component {...rest} />
}
