import { BetterAuthError } from 'better-auth';
import { generateSchema } from './generate-schema';
import { createTransform } from './transform';
export const BETTER_AUTH_CONTEXT_KEY = 'payload-db-adapter';
const PAYLOAD_QUERY_DEPTH = 2;
const payloadAdapter = (payloadClient, config = {})=>{
    function debugLog(message) {
        if (config.enableDebugLogs) {
            console.log('[payload-db-adapter]', ...message);
        }
    }
    function errorLog(message) {
        console.error(`[payload-db-adapter]`, ...message);
    }
    function collectionSlugError(model) {
        throw new BetterAuthError(`Collection ${model} does not exist. Please check your payload collection slugs match the better auth schema`);
    }
    const createAdapterContext = (data)=>({
            [BETTER_AUTH_CONTEXT_KEY]: {
                ...data
            }
        });
    async function resolvePayloadClient() {
        const payload = typeof payloadClient === 'function' ? await payloadClient() : await payloadClient;
        if (!payload.config?.custom?.hasBetterAuthPlugin) {
            throw new BetterAuthError(`Payload is not configured with the better-auth plugin. Please add the plugin to your payload config.`);
        }
        return payload;
    }
    return (options)=>{
        const { transformInput, transformOutput, convertWhereClause, convertSelect, convertSort, getModelName, singleIdQuery, multipleIdsQuery } = createTransform(options, config.enableDebugLogs ?? false);
        return {
            id: 'payload',
            async create (data) {
                const start = Date.now();
                const { model, data: values, select } = data;
                const collectionSlug = getModelName(model);
                const transformed = transformInput(values, model, 'create');
                debugLog([
                    'create',
                    {
                        collectionSlug,
                        transformed,
                        select
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    const result = await payload.create({
                        collection: collectionSlug,
                        data: transformed,
                        select: convertSelect(model, select),
                        context: createAdapterContext({
                            model,
                            operation: 'create'
                        }),
                        depth: PAYLOAD_QUERY_DEPTH
                    });
                    const transformedResult = transformOutput(result);
                    debugLog([
                        'create result',
                        {
                            collectionSlug,
                            transformedResult,
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return transformedResult;
                } catch (error) {
                    errorLog([
                        'Error in creating:',
                        model,
                        error
                    ]);
                    return null;
                }
            },
            async findOne (data) {
                const start = Date.now();
                const { model, where, select } = data;
                const collectionSlug = getModelName(model);
                const payloadWhere = convertWhereClause(model, where);
                debugLog([
                    'findOne',
                    {
                        collectionSlug
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    const id = singleIdQuery(payloadWhere);
                    let result = null;
                    if (id) {
                        debugLog([
                            'findOneByID',
                            {
                                collectionSlug,
                                id
                            }
                        ]);
                        const doc = await payload.findByID({
                            collection: collectionSlug,
                            id,
                            select: convertSelect(model, select),
                            context: createAdapterContext({
                                model,
                                operation: 'findOneByID'
                            }),
                            depth: PAYLOAD_QUERY_DEPTH
                        });
                        result = doc;
                    } else {
                        debugLog([
                            'findOneByWhere',
                            {
                                collectionSlug,
                                payloadWhere
                            }
                        ]);
                        const docs = await payload.find({
                            collection: collectionSlug,
                            where: payloadWhere,
                            select: convertSelect(model, select),
                            context: createAdapterContext({
                                model,
                                operation: 'findOneByWhere'
                            }),
                            depth: PAYLOAD_QUERY_DEPTH,
                            limit: 1
                        });
                        result = docs.docs[0];
                    }
                    const transformedResult = result ? transformOutput(result) : null;
                    debugLog([
                        'findOne result',
                        {
                            collectionSlug,
                            transformedResult,
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return transformedResult;
                } catch (error) {
                    errorLog([
                        'Error in findOne: ',
                        error
                    ]);
                    return null;
                }
            },
            async findMany (data) {
                const start = Date.now();
                const { model, where, sortBy, limit, offset } = data;
                const collectionSlug = getModelName(model);
                const payloadWhere = convertWhereClause(model, where);
                debugLog([
                    'findMany',
                    {
                        collectionSlug,
                        sortBy,
                        limit,
                        offset
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    let result = null;
                    const multipleIds = where && multipleIdsQuery(payloadWhere);
                    const singleId = where && singleIdQuery(payloadWhere);
                    if (multipleIds && multipleIds.length > 0) {
                        debugLog([
                            'findManyByMultipleIDs',
                            {
                                collectionSlug,
                                ids: multipleIds
                            }
                        ]);
                        const res = {
                            docs: [],
                            totalDocs: 0
                        };
                        for (const id of multipleIds){
                            const doc = await payload.findByID({
                                collection: collectionSlug,
                                id,
                                depth: PAYLOAD_QUERY_DEPTH,
                                context: createAdapterContext({
                                    model,
                                    operation: 'findManyByMultipleIDs'
                                })
                            });
                            res.docs.push(doc);
                            res.totalDocs++;
                        }
                        result = {
                            docs: res.docs,
                            totalDocs: res.totalDocs
                        };
                    } else if (singleId) {
                        debugLog([
                            'findManyBySingleID',
                            {
                                collectionSlug,
                                id: singleId
                            }
                        ]);
                        const doc = await payload.findByID({
                            collection: collectionSlug,
                            id: singleId,
                            depth: PAYLOAD_QUERY_DEPTH,
                            context: createAdapterContext({
                                model,
                                operation: 'findManyBySingleID'
                            })
                        });
                        result = {
                            docs: doc ? [
                                doc
                            ] : [],
                            totalDocs: doc ? 1 : 0
                        };
                    } else {
                        debugLog([
                            'findManyByWhere',
                            {
                                collectionSlug,
                                payloadWhere
                            }
                        ]);
                        const res = await payload.find({
                            collection: collectionSlug,
                            where: payloadWhere,
                            limit: limit,
                            page: offset ? Math.floor(offset / (limit || 10)) + 1 : 1,
                            sort: convertSort(model, sortBy),
                            depth: PAYLOAD_QUERY_DEPTH,
                            context: createAdapterContext({
                                model,
                                operation: 'findManyByWhere'
                            })
                        });
                        result = {
                            docs: res.docs,
                            totalDocs: res.totalDocs
                        };
                    }
                    const transformedResult = result?.docs.map((doc)=>transformOutput(doc)) ?? null;
                    debugLog([
                        'findMany result',
                        {
                            collectionSlug,
                            transformedResult,
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return transformedResult;
                } catch (error) {
                    errorLog([
                        'Error in findMany: ',
                        error
                    ]);
                    return [];
                }
            },
            async update (data) {
                const start = Date.now();
                const { model, where, update } = data;
                const collectionSlug = getModelName(model);
                const payloadWhere = convertWhereClause(model, where);
                debugLog([
                    'update',
                    {
                        collectionSlug,
                        update
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    let result = null;
                    const id = singleIdQuery(payloadWhere);
                    if (id) {
                        debugLog([
                            'updateByID',
                            {
                                collectionSlug,
                                id
                            }
                        ]);
                        const doc = await payload.update({
                            collection: collectionSlug,
                            id,
                            data: update,
                            depth: PAYLOAD_QUERY_DEPTH,
                            context: createAdapterContext({
                                model,
                                operation: 'updateByID'
                            })
                        });
                        result = doc;
                    } else {
                        debugLog([
                            'updateByWhere',
                            {
                                collectionSlug,
                                payloadWhere
                            }
                        ]);
                        const doc = await payload.update({
                            collection: collectionSlug,
                            where: payloadWhere,
                            data: update,
                            depth: PAYLOAD_QUERY_DEPTH,
                            context: createAdapterContext({
                                model,
                                operation: 'updateByWhere'
                            })
                        });
                        result = doc.docs[0];
                    }
                    const transformedResult = transformOutput(result) ?? null;
                    debugLog([
                        'update result',
                        {
                            collectionSlug,
                            transformedResult,
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return transformedResult;
                } catch (error) {
                    errorLog([
                        'Error in update: ',
                        error
                    ]);
                    return null;
                }
            },
            async updateMany (data) {
                const start = Date.now();
                const { model, where, update } = data;
                const collectionSlug = getModelName(model);
                const payloadWhere = convertWhereClause(model, where);
                debugLog([
                    'updateMany',
                    {
                        collectionSlug,
                        payloadWhere,
                        update
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    const { docs: updateResult } = await payload.update({
                        collection: collectionSlug,
                        where: payloadWhere,
                        data: update,
                        depth: PAYLOAD_QUERY_DEPTH,
                        context: createAdapterContext({
                            model,
                            operation: 'updateMany'
                        })
                    });
                    debugLog([
                        'updateMany result',
                        {
                            collectionSlug,
                            result: updateResult,
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return updateResult?.length || 0;
                } catch (error) {
                    errorLog([
                        'Error in updateMany: ',
                        error
                    ]);
                    return 0;
                }
            },
            async delete (data) {
                const start = Date.now();
                const { model, where } = data;
                const collectionSlug = getModelName(model);
                const payloadWhere = convertWhereClause(model, where);
                debugLog([
                    'delete',
                    {
                        collectionSlug
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    let deleteResult = null;
                    const id = singleIdQuery(payloadWhere);
                    if (id) {
                        debugLog([
                            'deleteByID',
                            {
                                collectionSlug,
                                id
                            }
                        ]);
                        const doc = await payload.delete({
                            collection: collectionSlug,
                            id,
                            depth: PAYLOAD_QUERY_DEPTH,
                            context: createAdapterContext({
                                model,
                                operation: 'deleteByID'
                            })
                        });
                        deleteResult = {
                            doc,
                            errors: []
                        };
                    } else {
                        debugLog([
                            'deleteByWhere',
                            {
                                collectionSlug,
                                payloadWhere
                            }
                        ]);
                        const doc = await payload.delete({
                            collection: collectionSlug,
                            where: payloadWhere,
                            depth: PAYLOAD_QUERY_DEPTH,
                            context: createAdapterContext({
                                model,
                                operation: 'deleteByWhere'
                            })
                        });
                        deleteResult = {
                            doc: doc.docs[0],
                            errors: []
                        };
                    }
                    debugLog([
                        'delete result',
                        {
                            collectionSlug,
                            result: deleteResult,
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return;
                } catch (error) {
                    errorLog([
                        'Error in delete: ',
                        error
                    ]);
                    return;
                }
            },
            async deleteMany (data) {
                const start = Date.now();
                const { model, where } = data;
                const collectionSlug = getModelName(model);
                const payloadWhere = convertWhereClause(model, where);
                debugLog([
                    'deleteMany',
                    {
                        collectionSlug,
                        payloadWhere
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    const deleteResult = await payload.delete({
                        collection: collectionSlug,
                        where: payloadWhere,
                        depth: PAYLOAD_QUERY_DEPTH,
                        context: createAdapterContext({
                            model,
                            operation: 'deleteMany'
                        })
                    });
                    debugLog([
                        'deleteMany result',
                        {
                            collectionSlug,
                            result: deleteResult,
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return deleteResult.docs.length;
                } catch (error) {
                    errorLog([
                        'Error in deleteMany: ',
                        error
                    ]);
                    return 0;
                }
            },
            async count (data) {
                const start = Date.now();
                const { model, where } = data;
                const collectionSlug = getModelName(model);
                const payloadWhere = convertWhereClause(model, where);
                debugLog([
                    'count',
                    {
                        collectionSlug,
                        payloadWhere
                    }
                ]);
                try {
                    const payload = await resolvePayloadClient();
                    if (!collectionSlug || !(collectionSlug in payload.collections)) {
                        collectionSlugError(model);
                    }
                    const result = await payload.count({
                        collection: collectionSlug,
                        where: payloadWhere,
                        depth: PAYLOAD_QUERY_DEPTH,
                        context: createAdapterContext({
                            model,
                            operation: 'count'
                        })
                    });
                    debugLog([
                        'count result',
                        {
                            collectionSlug,
                            result: {
                                totalDocs: result.totalDocs
                            },
                            duration: `${Date.now() - start}ms`
                        }
                    ]);
                    return result.totalDocs;
                } catch (error) {
                    errorLog([
                        'Error in count: ',
                        error
                    ]);
                    return 0;
                }
            },
            createSchema: async (options, file)=>{
                const schemaCode = await generateSchema(options);
                return {
                    code: schemaCode,
                    path: file || 'schema.ts',
                    append: false,
                    overwrite: true
                };
            },
            options: {
                enableDebugLogs: config.enableDebugLogs
            }
        };
    };
};
export { generateSchema, payloadAdapter };

//# sourceMappingURL=index.js.map