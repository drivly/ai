import React from 'react'

// Theme configuration object for Nextra
const themeConfig = {
  // Control what appears in the sidebar navigation
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  // Only include files from the docs path
  docsRepositoryBase: 'https://github.com/drivly/ai/tree/main',
  // Exclude external links from search
  search: {
    includeExtraContent: false,
  },
  // Set allowed paths for documentation
  navigation: {
    includedPaths: ['/docs/**/*'],
    excludedPaths: ['/sites/**/*', '/demo/**/*'],
  },
  // Enable or disable specific features
  features: {
    showAllSidebar: false,
  },
}

export default themeConfig
