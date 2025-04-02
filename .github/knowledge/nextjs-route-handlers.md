# Next.js 15+ Route Handler Patterns

## Dynamic Route Segments

When implementing route handlers for dynamic segments in Next.js 15+, use the following pattern:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { [param]: string } }
) {
  // Access dynamic parameter with params.[param]
}
```

Key points:
- The second parameter must be destructured with the `params` property
- The type must be an object with a `params` property, not a context object
- For routes like `app/[slug]/route.ts`, use `{ params: { slug: string } }`
- For routes like `app/[provider]/callback/route.ts`, use `{ params: { provider: string } }`

## Common Errors

If you see this error:
```
Type error: Route has an invalid export:
  Type is not a valid type for the function's second argument.
```

Check that:
1. You're using the correct destructuring pattern `{ params }: { params: { ... } }`
2. You're not using `context` as a parameter name
3. The params object matches your route segment names exactly

## References
- [Next.js Documentation - Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Documentation - Dynamic Route Segments](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
