export const updateOptionParams = (key: string, value: string, search: URLSearchParams) => {
  const queryParams = { ...Object.fromEntries(search) }

  if (queryParams[key] === value) {
    if (key === 'make' && queryParams['model']) {
      delete queryParams['model']
    }
    delete queryParams[key]
  } else {
    queryParams[key] = value
  }

  return queryParams
}
