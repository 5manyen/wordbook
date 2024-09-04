export const wordData = [
  {
    userId: 1,
    words: {
      EN: [
        {
          id: 1,
          text: 'atlas',
          type: 'noun',
          description: 'The seal has an atlas.'
        },
        {
          id: 2,
          text: 'rebellious',
          type: 'adjective',
          description: 'The rebellious seals destroyed almost everything.'
        },
        {
          id: 3,
          text: 'shift',
          type: 'verb',
          description: 'The seal is shifted to the other pool.'
        }
      ],
      NL: [
        {
          id: 4,
          text: 'zeehond',
          type: 'noun',
          description: 'Het is een zeehond.'
        }
      ]
    },
    languages: ['EN', 'NL']
  },
  {
    userId: 2,
    words: {
      NL: [
        {
          id: 5,
          text: 'klaarmaken',
          type: 'verb',
          description: 'to prepare'
        }
      ],
      ES: [
        {
          id: 6,
          text: 'despacito',
          type: 'adverb',
          description: 'slowly, gently'
        }
      ]
    },
    languages: ['NL', 'ES']
  }
];

export const wordTypeData = {
  noun: {
    text: 'Noun',
    color: 'light-blue-lighten-3'
  },
  verb: {
    text: 'Verb',
    color: 'green-lighten-1'
  },
  adjective: {
    text: 'Adjective',
    color: 'amber-lighten-3'
  },
  adverb: {
    text: 'Adverb',
    color: 'pink-lighten-2'
  },
  idiom: {
    text: 'Idiom',
    color: 'brown'
  },
  other: {
    text: 'Other',
    color: 'grey'
  }
};
