import fs from 'node:fs/promises';
import path from 'node:path';
import { generateSchemaBuilderStage } from './generate-schema-builder';
import { getPayloadSchema } from './get-payload-schema';
export const generateSchema = async (BAoptions, options = {
    outputDir: './generated'
})=>{
    const { outputDir } = options;
    const existing_schema_code = await getPayloadSchema(outputDir);
    const new_schema_code = await generateSchemaBuilderStage({
        code: existing_schema_code,
        BAOptions: BAoptions
    });
    const schemaPath = path.resolve(outputDir, 'schema.ts');
    await fs.writeFile(schemaPath, new_schema_code, 'utf8');
    return new_schema_code;
};

//# sourceMappingURL=index.js.map