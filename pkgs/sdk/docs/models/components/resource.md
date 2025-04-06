# Resource

## Example Usage

```typescript
import { Resource } from "apis.do/models/components";

let value: Resource = {};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`                                                                                          | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `createdAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `updatedAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `tenant`                                                                                      | *string*                                                                                      | :heavy_minus_sign:                                                                            | ID of related projects document                                                               |
| `yaml`                                                                                        | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `data`                                                                                        | [components.Data](../../models/components/data.md)                                            | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `embedding`                                                                                   | [components.Embedding](../../models/components/embedding.md)                                  | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `subjectOf`                                                                                   | *string*[]                                                                                    | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `objectOf`                                                                                    | *string*[]                                                                                    | :heavy_minus_sign:                                                                            | N/A                                                                                           |