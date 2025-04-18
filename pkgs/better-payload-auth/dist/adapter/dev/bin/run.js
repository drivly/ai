import { betterAuth } from 'better-auth';
import { payloadAdapter } from '../..';
import { getPayload } from '../../dev/index';
import { generateSchema } from '../../generate-schema';
import { getPayloadPath } from '../../generate-schema/utils';
const PAYLOAD_TEST_DIR_PATH = getPayloadPath('./test/test_payload1');
const PAYLOAD_TEST_DIR_PATH2 = getPayloadPath('./test/test_payload2');
const PAYLOAD_TEST_DIR_PATH3 = getPayloadPath('./test/test_payload3');
const auth = betterAuth({
    database: payloadAdapter(await getPayload()),
    emailAndPassword: {
        enabled: true
    }
});
await generateSchema({
    plugins: [
        {
            id: 'admin',
            schema: {
                admin: {
                    fields: {
                        name: {
                            type: 'string',
                            required: true
                        },
                        id: {
                            type: 'string',
                            required: true
                        },
                        isAdmin: {
                            type: 'boolean',
                            required: true
                        },
                        status: {
                            type: 'string',
                            required: false
                        },
                        date: {
                            type: 'date'
                        },
                        number: {
                            type: 'number'
                        },
                        str_array: {
                            type: 'string[]'
                        },
                        num_array: {
                            type: 'number[]'
                        }
                    }
                }
            }
        }
    ]
}, {
    outputDir: PAYLOAD_TEST_DIR_PATH3
}).then(()=>{
    process.exit(0);
}).catch((err)=>{
    console.error(err);
    process.exit(1);
});

//# sourceMappingURL=run.js.map