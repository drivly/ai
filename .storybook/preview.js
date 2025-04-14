import "../pkgs/ui/src/globals.css"
import ServerComponentDecorator from './ServerComponentDecorator'

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [ServerComponentDecorator],
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#121212",
        },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
