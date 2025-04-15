import { CodeBlock } from './code-block'

export function BlogContent() {
  return (
    <div className='prose prose-lg dark:prose-invert max-w-none'>
      <h2>Bringing AI Back to Code: Introducing Functions.do</h2>
      <p>
        AI is powerful—but as any developer knows, integrating it into real applications is often frustrating. You get brittle outputs, endless prompt tweaking, and unexpected
        failures. That's where <strong>Functions.do</strong> comes in.
      </p>
      <p>
        Functions.do transforms generative AI into <strong>structured, predictable functions</strong>—like building blocks you can trust. No more parsing vague responses. No more
        wrapping fragile prompts. Just clean, reliable, strongly-typed outputs you can plug directly into your app.
      </p>
      <h3>Why It Matters</h3>
      <p>Developers want to harness AI without giving up control. With Functions.do:</p>
      <ul>
        <li>
          You get <strong>predictable schemas</strong>, not unpredictable blobs.
        </li>
        <li>You write code, not magic incantations.</li>
        <li>You build fast, integrate cleanly, and scale confidently.</li>
      </ul>
      <h3>How It Works</h3>
      <p>You can call Functions.do in three simple ways:</p>
      <ol>
        <li>
          <strong>Dynamic Prototyping</strong>
          <CodeBlock code='const result = await Ai.categorizeDocument(doc);' language='typescript' />
        </li>
        <li>
          <strong>Cloud-Managed Schemas</strong>
          <CodeBlock code='npx functions.do pull' language='bash' />
        </li>
        <li>
          <strong>Local-to-Cloud Control</strong> (coming soon)
          <CodeBlock code='npx functions.do push' language='bash' />
        </li>
      </ol>

      <h3>Get Started</h3>
      <p>
        Whether you're building prototypes or production systems, Functions.do gives you the power of AI—
        <strong>without the chaos</strong>.
      </p>
      <p>
        👉 <a href='#'>Join our developer community</a> or <a href='#'>check out the docs</a> to get started.
      </p>
      <p>Welcome to the next era of AI development. It feels a lot like coding—and that's the point.</p>
    </div>
  )
}
