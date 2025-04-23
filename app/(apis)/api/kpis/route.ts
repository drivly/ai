import { API } from '@/lib/api'
import { NextResponse } from 'next/server'

export const GET = API(async (request, { db, user, url }) => {
  try {
    const tenantId = url.searchParams.get('project')
    const goalId = url.searchParams.get('goal')
    const workflowId = url.searchParams.get('workflow')
    const agentId = url.searchParams.get('agent')

    const query: any = {}
    if (tenantId) query.project = tenantId

    if (workflowId || agentId) {
      const goalsQuery: any = {}
      
      if (workflowId) {
        goalsQuery.workflows = { contains: workflowId }
      } else if (agentId) {
        goalsQuery.agents = { contains: agentId }
      }
      
      const goals = await db.goals.find(goalsQuery)
      
      if (Array.isArray(goals.docs) && goals.docs.length > 0) {
        const goalIds = goals.docs.map((g: any) => g.id)
        query['goals.docs'] = { in: goalIds }
      } else {
        return formatNumericsResponse([])
      }
    } else if (goalId) {
      query['goals.docs'] = { contains: goalId }
    }

    const result = await db.kpis.find({
      where: query,
    })

    return formatNumericsResponse(result?.docs || [])
  } catch (error) {
    console.error('Error in KPIs route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
})

function formatNumericsResponse(kpis: any[]) {
  const numericsResponse = {
    metrics: Array.isArray(kpis) ? kpis.map(kpi => ({
      id: kpi.id,
      name: kpi.name,
      value: kpi.value || 0,
      target: kpi.target || undefined,
      unit: kpi.unit || '',
      format: kpi.format || 'number',
      description: kpi.description || `KPI: ${kpi.name}`,
    })) : []
  }
  
  return NextResponse.json(numericsResponse)
}
