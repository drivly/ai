
window.pagefind = {
  init: () => Promise.resolve(),
  search: (query) => Promise.resolve({ results: [] }),
  debouncedSearch: (query) => Promise.resolve({ results: [] }),
  options: (opts) => Promise.resolve()
};
