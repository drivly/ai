# Package

## Example Usage

```typescript
import { Package } from "apis.do/models/components";

let value: Package = {};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`                                                                                          | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `createdAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `updatedAt`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `tenant`                                                                                      | *string*                                                                                      | :heavy_minus_sign:                                                                            | ID of related projects document                                                               |
| `name`                                                                                        | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `package`                                                                                     | [components.PackagePackage](../../models/components/packagepackage.md)                        | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `collections`                                                                                 | [components.Collections](../../models/components/collections.md)[]                            | :heavy_minus_sign:                                                                            | N/A                                                                                           |