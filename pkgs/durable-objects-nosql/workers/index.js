export default function () {
  return {
    name: 'workers',
    async setup() {
      return {
        async teardown() {},
      }
    },
  }
}
