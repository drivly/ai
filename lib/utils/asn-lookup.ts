import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { parse } from 'csv-parse/sync'

let asnData: Map<string, string> | null = null
let asnDataPromise: Promise<Map<string, string>> | null = null

/**
 * Interface for ASN record
 */
interface ASNRecord {
  asn: string
  organization: string
}

/**
 * Loads and parses the ASN to organization mapping data
 * @returns Promise resolving to Map of ASN to organization name
 */
async function loadASNData(): Promise<Map<string, string>> {
  try {
    const asnDataPath = join(process.cwd(), 'node_modules', '@ip-location-db', 'asn', 'asn-ipv4.csv')

    const fileContent = await readFile(asnDataPath, 'utf-8')
    const records = parse(fileContent, {
      columns: ['start_ip', 'end_ip', 'asn', 'organization'],
      skip_empty_lines: true,
      trim: true,
      from_line: 2, // Skip header
    })

    const asnMap = new Map<string, string>()
    records.forEach((record: any) => {
      if (record.asn && record.organization) {
        asnMap.set(record.asn, record.organization)
      }
    })

    return asnMap
  } catch (error) {
    console.error('Error loading ASN data:', error)
    return new Map<string, string>()
  }
}

/**
 * Gets the organization name for a given ASN
 * @param asn ASN number as string
 * @returns Promise resolving to organization name or null if not found
 */
export async function getOrganizationByASN(asn: string): Promise<string | null> {
  if (!asn) return null

  if (!asnData) {
    if (!asnDataPromise) {
      asnDataPromise = loadASNData()
    }
    asnData = await asnDataPromise
  }

  return asnData.get(asn) || null
}
