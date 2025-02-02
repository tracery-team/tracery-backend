/**
 * Function that calculates the Levenshtein distance between two strings.
 *
 * @param {string} s1 - The first string.
 * @param {string} s2 - The second string.
 * @returns {number} - The Levenshtein distance between two strings.
 */
export function levenshtein(s1: string, s2: string): number {
  if (s1 === s2) {
    return 0
  }

  const s1_len = s1.length
  const s2_len = s2.length
  if (s1_len === 0) {
    return s2_len
  }
  if (s2_len === 0) {
    return s1_len
  }

  let v0 = new Array(s1_len + 1)
  let v1 = new Array(s1_len + 1)

  for (let i = 0; i < s1_len + 1; i++) {
    v0[i] = i
  }

  for (let j = 1; j <= s2_len; j++) {
    v1[0] = j
    const char_s2 = s2[j - 1]

    for (let i = 0; i < s1_len; i++) {
      const char_s1 = s1[i]
      const cost = char_s1 === char_s2 ? 0 : 1
      const m_min = Math.min(v0[i + 1] + 1, v1[i] + 1, v0[i] + cost)
      v1[i + 1] = m_min
    }

    ;[v0, v1] = [v1, v0]
  }

  return v0[s1_len]
}

/**
 * Function that filters and sorts an array based on a distance function,
 * keeping elements within the specified maxDistance threshold.
 *
 * @template T
 * @param {T[]} elements - The array of elements.
 * @param {(element: T) => number} distanceFn - Function that computes the distance of an element.
 * @param {number} maxDistance - The maximum allowed distance for an element to be included.
 * @returns {T[]} - The filtered and sorted array of elements.
 */
export const applySearch = <T>(
  elements: T[],
  distanceFn: (element: T) => number,
  maxDistance: number = 20,
) => {
  const filteredElements = elements
    .map(element => {
      return Object.freeze({
        element,
        distance: distanceFn(element),
      })
    })
    .filter(({ distance }) => distance <= maxDistance)
  filteredElements.sort(({ distance: distanceA }, { distance: distanceB }) => {
    const weight = distanceA - distanceB
    return weight
  })
  return filteredElements.map(({ element }) => element)
}
