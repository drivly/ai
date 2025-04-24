'use server'

export interface ProjectStatus {
  id: string
  type: string
  attributes: {
    aggregate_state: 'operational' | 'downtime' | 'degraded' | 'maintenance'
  }
}

export type ProjectStatusResponse = ProjectStatus['attributes']['aggregate_state']

export const getProjectStatus = async (statusPageId: string): Promise<ProjectStatusResponse> => {
  const response = await fetch(`https://betteruptime.com/api/v2/status-pages/${statusPageId}`, {
    headers: {
      Authorization: `Bearer ${process.env.BETTERSTACK_API_TOKEN}`,
    },
  })
  const uptimeData = (await response.json()) as { data: ProjectStatus }

  return uptimeData.data.attributes.aggregate_state
}
