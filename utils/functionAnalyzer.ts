/**
 * Function analyzer utility for automatically determining function types,
 * subject/object nouns, verbs, and generating examples based on function definitions.
 */

/**
 * Analyzes a function definition to extract semantic data and determine appropriate types
 * @param name Function name in camelCase or PascalCase
 * @param schema Optional schema definition for the function
 * @returns Analysis results including type, format, verb, subject, object, and examples
 */
export async function analyzeFunctionDefinition(name: string, schema?: any, payload?: any) {
  const { verb, subject, object } = parseFunctionName(name);
  
  const type = determineFunctionType(verb, schema);
  
  const format = determineOutputFormat(schema);
  
  const examples = await generateExamples(schema, verb, subject, object, payload);
  
  let verbForms = null;
  let nounForms = {
    subject: null,
    object: null
  };
  
  if (payload) {
    if (verb) {
      try {
        const verbResult = await payload.jobs.queue({
          task: 'conjugateVerbs',
          input: { verb },
        });
        const verbJob = await payload.jobs.runByID({ id: verbResult.id });
        verbForms = verbJob?.output || null;
      } catch (error) {
        console.error('Error conjugating verb:', error);
      }
    }
    
    if (subject) {
      try {
        const subjectResult = await payload.jobs.queue({
          task: 'inflectNouns',
          input: { noun: subject },
        });
        const subjectJob = await payload.jobs.runByID({ id: subjectResult.id });
        nounForms.subject = subjectJob?.output || null;
      } catch (error) {
        console.error('Error inflecting subject noun:', error);
      }
    }
    
    if (object) {
      try {
        const objectResult = await payload.jobs.queue({
          task: 'inflectNouns',
          input: { noun: object },
        });
        const objectJob = await payload.jobs.runByID({ id: objectResult.id });
        nounForms.object = objectJob?.output || null;
      } catch (error) {
        console.error('Error inflecting object noun:', error);
      }
    }
  }
  
  return { 
    type,
    format,
    verb,
    subject,
    object,
    examples,
    verbForms,
    nounForms,
    confidence: calculateConfidence(verb, subject, type, format)
  };
}

/**
 * Parses a function name to extract verb and noun components
 * @param name Function name in camelCase or PascalCase
 * @returns Object containing verb, subject, and object
 */
export function parseFunctionName(name: string) {
  const normalizedName = name.charAt(0).toLowerCase() + name.slice(1);
  
  const prefixesToIgnore = ['get', 'set', 'is', 'has', 'can', 'should'];
  
  let processedName = normalizedName;
  for (const prefix of prefixesToIgnore) {
    if (normalizedName.startsWith(prefix) && 
        normalizedName.length > prefix.length && 
        normalizedName[prefix.length] === normalizedName[prefix.length].toUpperCase()) {
      processedName = normalizedName.slice(prefix.length);
      processedName = processedName.charAt(0).toLowerCase() + processedName.slice(1);
      break;
    }
  }
  
  const commonVerbs = [
    'generate', 'create', 'build', 'make', 'get', 'fetch', 'retrieve',
    'update', 'modify', 'change', 'delete', 'remove', 'calculate',
    'compute', 'process', 'convert', 'transform', 'validate', 'check',
    'verify', 'send', 'receive', 'analyze', 'summarize', 'extract',
    'search', 'find', 'filter', 'sort', 'review', 'approve', 'reject',
    'monitor', 'track', 'manage', 'handle', 'predict', 'forecast',
    'recommend', 'suggest', 'compare', 'merge', 'format', 'parse'
  ];
  
  let verb = '';
  let remainingName = processedName;
  
  for (const commonVerb of commonVerbs) {
    if (processedName.startsWith(commonVerb) && 
        (processedName.length === commonVerb.length || 
         processedName[commonVerb.length] === processedName[commonVerb.length].toUpperCase())) {
      verb = commonVerb;
      remainingName = processedName.slice(commonVerb.length);
      break;
    }
  }
  
  if (!verb) {
    const firstUpperCaseIndex = processedName.split('').findIndex((char, i) => 
      i > 0 && char === char.toUpperCase()
    );
    
    if (firstUpperCaseIndex > 0) {
      verb = processedName.slice(0, firstUpperCaseIndex);
      remainingName = processedName.slice(firstUpperCaseIndex);
    } else {
      verb = processedName; // The entire name is the verb
      remainingName = '';
    }
  }
  
  let subject = '';
  let object = '';
  
  if (remainingName) {
    remainingName = remainingName.charAt(0).toLowerCase() + remainingName.slice(1);
    
    const nextUpperCaseIndex = remainingName.split('').findIndex((char, i) => 
      i > 0 && char === char.toUpperCase()
    );
    
    if (nextUpperCaseIndex > 0) {
      subject = remainingName.slice(0, nextUpperCaseIndex);
      object = remainingName.slice(nextUpperCaseIndex);
      object = object.charAt(0).toLowerCase() + object.slice(1);
    } else {
      subject = remainingName;
    }
  }
  
  return { verb, subject, object };
}

/**
 * Maps common verbs to function types
 * @param verb Extracted verb from function name
 * @param schema Optional schema to help determine type
 * @returns Function type (Generation, Code, Human, Agent)
 */
export function determineFunctionType(verb: string, schema?: any) {
  const verbTypeMappings: Record<string, string> = {
    'generate': 'Generation',
    'create': 'Generation',
    'build': 'Generation',
    'make': 'Generation',
    'write': 'Generation',
    'compose': 'Generation',
    'describe': 'Generation',
    'summarize': 'Generation',
    'explain': 'Generation',
    
    'calculate': 'Code',
    'compute': 'Code',
    'process': 'Code',
    'convert': 'Code',
    'transform': 'Code',
    'format': 'Code',
    'parse': 'Code',
    
    'approve': 'Human',
    'review': 'Human',
    'validate': 'Human',
    'assess': 'Human',
    'judge': 'Human',
    'evaluate': 'Human',
    
    'monitor': 'Agent',
    'manage': 'Agent',
    'handle': 'Agent',
    'coordinate': 'Agent',
    'operate': 'Agent',
    'orchestrate': 'Agent'
  };
  
  if (verb && verbTypeMappings[verb.toLowerCase()]) {
    return verbTypeMappings[verb.toLowerCase()];
  }
  
  if (schema) {
    const schemaStr = JSON.stringify(schema);
    if (
      schemaStr.includes('code') || 
      schemaStr.includes('script') || 
      schemaStr.includes('function')
    ) {
      return 'Code';
    }
    
    if (
      schemaStr.includes('approve') || 
      schemaStr.includes('review') || 
      schemaStr.includes('feedback')
    ) {
      return 'Human';
    }
    
    if (
      schemaStr.includes('agent') || 
      schemaStr.includes('monitor') || 
      schemaStr.includes('manage')
    ) {
      return 'Agent';
    }
  }
  
  return 'Generation';
}

/**
 * Determines the appropriate output format based on schema analysis
 * @param schema Schema object to analyze
 * @returns Output format (Object, ObjectArray, Text, TextArray, Markdown, Code, Video)
 */
export function determineOutputFormat(schema?: any) {
  if (!schema) {
    return 'Text'; // Default to Text if no schema
  }
  
  if (Array.isArray(schema)) {
    if (typeof schema[0] === 'object') {
      return 'ObjectArray';
    } else {
      return 'TextArray';
    }
  }
  
  if (schema.items || schema.elements || schema.array) {
    return 'ObjectArray';
  }
  
  const schemaStr = JSON.stringify(schema);
  if (
    schemaStr.includes('code') || 
    schemaStr.includes('script') || 
    schemaStr.includes('function')
  ) {
    return 'Code';
  }
  
  if (
    schemaStr.includes('markdown') || 
    schemaStr.includes('formatted') || 
    schemaStr.includes('richText')
  ) {
    return 'Markdown';
  }
  
  if (
    schemaStr.includes('video') || 
    schemaStr.includes('media') || 
    schemaStr.includes('animation')
  ) {
    return 'Video';
  }
  
  const hasNestedObjects = Object.values(schema).some(value => 
    typeof value === 'object' && value !== null && !Array.isArray(value)
  );
  
  if (hasNestedObjects) {
    return 'Object';
  }
  
  return 'Object';
}

/**
 * Generates example arguments based on schema and semantic components
 * @param schema Schema for the function
 * @param verb Extracted verb
 * @param subject Extracted subject
 * @param object Extracted object
 * @returns Array of example argument objects
 */
export async function generateExamples(schema?: any, verb?: string, subject?: string, object?: string, payload?: any) {
  if (!payload) {
    return []; // Can't generate examples without payload
  }
  
  try {
    const placeholderFunction = {
      name: verb && subject ? `${verb}${subject.charAt(0).toUpperCase() + subject.slice(1)}${object ? object.charAt(0).toUpperCase() + object.slice(1) : ''}` : 'placeholder',
      shape: schema || {},
    };
    
    return [
      { example: 'placeholder', semantic: true },
    ];
  } catch (error) {
    console.error('Error generating examples:', error);
    return [];
  }
}

/**
 * Calculates confidence score for the analysis results
 * @param verb Extracted verb
 * @param subject Extracted subject
 * @param type Determined function type
 * @param format Determined output format
 * @returns Confidence score (0-1)
 */
export function calculateConfidence(verb: string, subject: string, type: string, format: string) {
  let score = 0;
  
  if (verb) {
    score += 0.3;
  }
  
  if (subject) {
    score += 0.2;
  }
  
  const verbTypeMappings: Record<string, string> = {
    'generate': 'Generation',
    'create': 'Generation',
    'calculate': 'Code',
    'compute': 'Code',
    'approve': 'Human',
    'review': 'Human',
    'monitor': 'Agent',
    'manage': 'Agent',
  };
  
  if (verb && verbTypeMappings[verb.toLowerCase()] === type) {
    score += 0.3;
  } else {
    score += 0.1; // Lower confidence if type is derived from fallback
  }
  
  if (format !== 'Text') { // Text is our default, so higher confidence for non-default
    score += 0.2;
  } else {
    score += 0.1;
  }
  
  return Math.min(score, 1); // Cap at 1
}
