import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

/**
 * Toggles the same `data-app-theme` attribute `ThemeToggle` and `globals.css`
 * read — absent means "follow system," matching the real app's own default.
 * This is the whole mechanism; no React state, just the DOM attribute.
 */
function applyTheme(theme: string) {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-app-theme')
  } else {
    document.documentElement.setAttribute('data-app-theme', theme)
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'system',
  },

  decorators: [
    (Story, context) => {
      applyTheme(context.globals.theme)
      return <Story />
    },
  ],
};

export default preview;
