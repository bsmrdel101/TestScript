interface Program {
  
}

interface BinaryOperation {
  operator: string
  left: number
  right: number
}

interface Conditional {
  left: number | Variable
  right?: number | Variable
  conjunction?: string
}

interface Statement {
  type: 'If' | 'While'
  conditional: Conditional
  body: any[]
}

type Variable = {
  name: string
  value: string | number | null | Variable
};

type Token = {
  type: 'Var' |
  'Number' |
  'String' |
  'Identifier' |
  'Equals' |
  'Operator' |
  'LessThan' |
  'GreaterThan' |
  'LessThanEqual' |
  'GreaterThanEqual' |
  'LParen' |
  'RParen' |
  'LBrace' |
  'RBrace' |
  'LBracket' |
  'RBracket' |
  'If' |
  'While' |
  'Conjunction' |
  'Print' |
  'Semicolon' |
  'PlusEquals' |
  'MinusEquals' |
  'TimesEquals' |
  'DivideEquals'
  value: string
};

interface TokenList {
  tokens: Token[]
  error?: string
};
