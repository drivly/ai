export const hashObjectId = (id: string) => {}

/**
 * Parses a MongoDB ObjectId and returns an array containing:
 *  - The timestamp (first 4 bytes) as a base-10 integer.
 *  - The counter (last 3 bytes) as a base-10 integer.
 *
 * The standard ObjectId is a 12-byte (24 hex character) string with the layout:
 *   [timestamp (4 bytes)][machine id + pid (5 bytes)][counter (3 bytes)]
 *
 * In a single Node.js process, the machine id and pid are static. Therefore, this
 * function extracts only the parts that change: the timestamp and the counter.
 *
 * @param {string} objectId - A 24-character hexadecimal string representing the ObjectId.
 * @returns {number[]} An array where:
 *                     - The first element is the timestamp (as a base-10 int).
 *                     - The second element is the counter (as a base-10 int).
 * @throws {Error} If the provided objectId is not a valid 24-character hexadecimal string.
 */
export function parseObjectId(objectId: string): number[] {
  // Validate the ObjectId: it should be exactly 24 hexadecimal characters.
  if (!/^[a-fA-F0-9]{24}$/.test(objectId)) {
    throw new Error('Invalid ObjectId format. It must be a 24-character hex string.')
  }

  // Extract the timestamp portion (first 4 bytes = 8 hex characters)
  const timestampHex = objectId.substring(0, 8)
  // Convert the hex string to a base-10 integer.
  const timestamp = parseInt(timestampHex, 16)

  // Extract the counter portion (last 3 bytes = 6 hex characters)
  const counterHex = objectId.substring(18, 24)
  // Convert the hex string to a base-10 integer.
  const counter = parseInt(counterHex, 16)

  return [timestamp, counter]
}
