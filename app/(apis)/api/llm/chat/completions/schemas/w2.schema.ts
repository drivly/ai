export const W2 = {
  type: 'object',
  properties: {
    employeeFirstName: {
      type: 'string',
    },
    employeeLastName: {
      type: 'string',
    },
    employeeAddress: {
      type: 'string',
    },
    employeeCity: {
      type: 'string',
    },
    employeeState: {
      type: 'string',
    },
    employeeZip: {
      type: 'string',
    },
    employeeSSN: {
      type: 'string',
    },
    wagesBox1: {
      type: 'number',
    },
    taxWithheldBox2: {
      type: 'number',
    },
    ssWagesBox3: {
      type: 'number',
    },
    ssWithheldBox4: {
      type: 'number',
    },
    medicareWagesBox5: {
      type: 'number',
    },
    medicareWithheldBox6: {
      type: 'number',
    },
    employerEIN: {
      type: 'string',
    },
    employerName: {
      type: 'string',
    },
    employerAddress: {
      type: 'string',
    },
    employerCity: {
      type: 'string',
    },
    employerState: {
      type: 'string',
    },
    employerZip: {
      type: 'string',
    },
    taxYear: {
      type: 'string',
    },
  },
  required: [
    'employeeFirstName',
    'employeeLastName',
    'employeeAddress',
    'employeeCity',
    'employeeState',
    'employeeZip',
    'employeeSSN',
    'wagesBox1',
    'taxWithheldBox2',
    'ssWagesBox3',
    'ssWithheldBox4',
    'medicareWagesBox5',
    'medicareWithheldBox6',
    'employerEIN',
    'employerName',
    'employerAddress',
    'employerCity',
    'employerState',
    'employerZip',
    'taxYear',
  ],
  additionalProperties: false,
}
