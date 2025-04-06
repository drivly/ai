import { NextRequest } from 'next/server'

// stripe upgrade page only show UPGRADE button if user is subscribed
// Not show upgrade if on Top Tier Plan
export async function GET(request: NextRequest) {}
