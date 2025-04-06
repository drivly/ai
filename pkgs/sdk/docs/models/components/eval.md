# Eval

## Example Usage

```typescript
import { Eval } from "apis.do/models/components";

let value: Eval = {};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`                                                                                          | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `createdAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `updatedAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `tenant`                                                                                      | *string*                                                                                      | :heavy_minus_sign:                                                                            | ID of related projects document                                                               |
| `name`                                                                                        | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `description`                                                                                 | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `input`                                                                                       | [components.Input](../../models/components/input.md)                                          | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `expected`                                                                                    | [components.Expected](../../models/components/expected.md)                                    | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `tags`                                                                                        | [components.Tags](../../models/components/tags.md)[]                                          | :heavy_minus_sign:                                                                            | N/A                                                                                           |