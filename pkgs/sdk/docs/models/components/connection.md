# Connection

## Example Usage

```typescript
import { Connection } from "apis.do/models/components";

let value: Connection = {};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`                                                                                          | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `createdAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `updatedAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `tenant`                                                                                      | *string*                                                                                      | :heavy_minus_sign:                                                                            | ID of related projects document                                                               |
| `name`                                                                                        | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `user`                                                                                        | *string*                                                                                      | :heavy_minus_sign:                                                                            | ID of related users document                                                                  |
| `integration`                                                                                 | *string*                                                                                      | :heavy_minus_sign:                                                                            | ID of related integrations document                                                           |
| `status`                                                                                      | [components.ConnectionStatus](../../models/components/connectionstatus.md)                    | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `metadata`                                                                                    | [components.Metadata](../../models/components/metadata.md)                                    | :heavy_minus_sign:                                                                            | N/A                                                                                           |