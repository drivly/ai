<!-- Start SDK Example Usage [usage] -->
```typescript
import { Api } from "apis.do";

const api = new Api();

async function run() {
  const result = await api.functions.getApiFunctions();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->