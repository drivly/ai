import { Plugin } from 'payload'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { isSuperAdmin } from '../../../../lib/hooks/isSuperAdmin'

export type MultiTenantPluginOptions = {
  tenantSelectorLabel?: string
  collections?: Record<string, Record<string, any>>
}

export const createMultiTenantPlugin = (options: MultiTenantPluginOptions = {}): Plugin => {
  const {
    tenantSelectorLabel = 'Project',
    collections = {
      functions: {},
      workflows: {},
      agents: {},
    },
  } = options

  return multiTenantPlugin({
    tenantSelectorLabel,
    collections,
    userHasAccessToAllTenants: isSuperAdmin,
    tenantsSlug: 'tenants',
  })
}
