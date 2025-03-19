import { AI } from 'functions.do'

export const ai = AI({
  conjugateVerbs: {
    action: 'active tense like Create',
    act: 'third person singular present tense like Creates',
    activity: 'gerund like Creating',
    event: 'past tense like Created',
    subject: 'subject like Creator',
    object: 'object like Creation',
    inverse: 'opposite like Destroy',
    inverseAct: 'third person singular present tense like Destroys',
    inverseActivity: 'gerund like Destroying',
    inverseEvent: 'past tense like Destroyed',
    inverseSubject: 'subject like Destroyer',
    inverseObject: 'object like Destruction',
  },

  inflectNouns: {
    singular: 'singular noun like User',
    plural: 'plural noun like Users',
    possessive: `possessive noun like User's`,
    pluralPossessive: `possessive plural noun like Users'`,
    verb: 'verb like Use',
    act: 'third person singular present tense like Uses',
    activity: 'gerund like Using',
    event: 'past tense like Used',
  },
})
