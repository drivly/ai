'use server'

export interface ProjectStatus {
  id: string
  type: string
  attributes: {
    aggregate_state: 'operational' | 'downtime' | 'degraded' | 'maintenance'
  }
}

export type ProjectStatusResponse = ProjectStatus['attributes']['aggregate_state'] | 'offline'

export const getProjectStatus = async (statusPageId: string): Promise<ProjectStatusResponse> => {
  try {
    const response = await fetch(`https://betteruptime.com/api/v2/status-pages/${statusPageId}`, {
      headers: {
        Authorization: `Bearer ${process.env.BETTERSTACK_API_TOKEN}`,
      },
      cache: 'force-cache',
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch project status: ${response.status} ${response.statusText}`)
    }

    const uptimeData = (await response.json()) as { data: ProjectStatus }

    return uptimeData.data.attributes.aggregate_state
  } catch (error) {
    console.error(error)
    return 'offline'
  }
}
