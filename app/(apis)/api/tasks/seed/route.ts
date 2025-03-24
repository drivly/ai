import { seedDatabase } from "@/scripts/seed"


export const GET = async () => {
  seedDatabase()
}
