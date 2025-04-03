import { readFileSync } from 'fs'
import { join } from 'path'
import { parse } from 'csv-parse/sync'

let asnData: Map<string, string> | null = null

/**
 * Interface for ASN record
 */
interface ASNRecord {
  asn: string
  organization: string
}

/**
 * Loads and parses the ASN to organization mapping data
 * @returns Map of ASN to organization name
 */
function loadASNData(): Map<string, string> {
  try {
    const asnDataPath = join(process.cwd(), 'node_modules', '@ip-location-db', 'asn', 'asn-ipv4.csv')
    
    const fileContent = readFileSync(asnDataPath, 'utf-8')
    const records = parse(fileContent, {
      columns: ['start_ip', 'end_ip', 'asn', 'organization'],
      skip_empty_lines: true,
      trim: true,
      from_line: 2 // Skip header
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
 * @returns Organization name or null if not found
 */
export function getOrganizationByASN(asn: string): string | null {
  if (!asn) return null
  
  if (!asnData) {
    asnData = loadASNData()
  }
  
  return asnData.get(asn) || null
}
