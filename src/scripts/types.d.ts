interface Program {
  params: Variable[]
  trigger: Trigger
  body: any[]
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

type Trigger = {
  name: string
  subtTriggers: SubTrigger[]
};

type SubTrigger = {
  name: string
};

type Variable = {
  name: string
  value: any
};

type Token = {
  type: 'Var' |
  'Number' |
  'String' |
  'Identifier' |
  'Params' |
  'Trigger' |
  'Equals' |
  'NotEqual' |
  'IsEqual' |
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
  'Colon' |
  'Comma' |
  'PlusEquals' |
  'MinusEquals' |
  'TimesEquals' |
  'DivideEquals' |
  'Exclamation' |
  'Shutdown'
  value: string
};

interface TokenList {
  tokens?: Token[]
  tokenError?: string
};

interface ParserReturn {
  program?: Program
  parserError?: string
}
