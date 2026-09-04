interface Program {
  statements: Statement[]
  events: Map<Trigger, EventHandler>
}

interface EventHandler {
  trigger: Trigger
  ctx: ObjectValue
  body: Statement[]
}

type Statement =
  | VariableDeclaration
  | PrintStatement
  | IfStatement
  | WhileStatement
  | AssignmentStatement;

type PrimitiveValue = string | number | boolean | null;

type ObjectValue = {
  [key: string]: Value
};

type Value = PrimitiveValue | ObjectValue;

interface VariableDeclaration {
  type: 'Var'
  name: string
  value: Expression
}

interface PrintStatement {
  type: 'Print'
  value: Expression
}

interface IfStatement {
  type: 'If'
  conditional: Expression
  body: Statement[]
  elseBody?: Statement[]
}

interface WhileStatement {
  type: 'While'
  conditional: Expression
  body: Statement[]
}

type Trigger =
  | 'OnLoad'
  | 'OnPlayerJoin'
  | 'OnPlayerLeave'
  | 'OnDeath'
  | 'OnPlayerDeath'
  | 'OnRoundStart'
  | 'OnTurnStart'
  | 'OnTokenMove'
  | 'BeforeRoll'
  | 'AfterRoll'
  | 'BeforeAtk'
  | 'AfterAtk'
  | 'BeforeDmg'
  | 'AfterDmg'

interface AssignmentStatement {
  type: 'Assignment'
  name: string
  operator: AssignmentOperator
  value: Expression
}

type AssignmentOperator = '=' | '+=' | '-=' | '*=' | '/=';
type ComparisonOperator = '==' | '!=' | '<' | '>' | '<=' | '>=';
type LogicalOperator = '&&' | '||';
type MathOperator = '+' | '-' | '*' | '/' | '%';

type Expression =
  | LiteralExpression
  | VariableExpression
  | BinaryExpression
  | UnaryExpression
  | ComparisonExpression
  | LogicalExpression
  | MemberExpression
  | CallExpression;

interface LiteralExpression {
  type: 'Literal'
  value: string | number | boolean
}

interface VariableExpression {
  type: 'Variable'
  name: string
}

interface BinaryExpression {
  type: 'BinaryExpression'
  operator: MathOperator
  left: Expression
  right: Expression
}

interface UnaryExpression {
  type: 'UnaryExpression'
  operator: '!' | '-'
  operand: Expression
}

interface ComparisonExpression {
  type: 'ComparisonExpression'
  operator: ComparisonOperator
  left: Expression
  right: Expression
}

interface LogicalExpression {
  type: 'LogicalExpression'
  operator: LogicalOperator
  left: Expression
  right: Expression
}

interface MemberExpression {
  type: 'MemberExpression'
  object: Expression
  property: string
}

interface CallExpression {
  type: 'CallExpression'
  callee: Expression
  arguments: Expression[]
}

type TokenType =
  | 'Var'
  | 'Number'
  | 'String'
  | 'Boolean'
  | 'Identifier'
  | 'Equals'
  | 'NotEqual'
  | 'IsEqual'
  | 'Operator'
  | 'LessThan'
  | 'GreaterThan'
  | 'LessThanEqual'
  | 'GreaterThanEqual'
  | 'LParen'
  | 'RParen'
  | 'LBrace'
  | 'RBrace'
  | 'If'
  | 'Else'
  | 'While'
  | 'Conjunction'
  | 'Print'
  | 'Semicolon'
  | 'Colon'
  | 'Comma'
  | 'Dot'
  | 'PlusEquals'
  | 'MinusEquals'
  | 'TimesEquals'
  | 'DivideEquals'
  | 'Exclamation'
  | 'Exit'
  | 'Event';

interface Token {
  type: TokenType;
  value: string;
}

interface TokenList {
  tokens?: Token[];
  tokenError?: string;
}

interface ParserReturn {
  program?: Program;
  parserError?: string;
}
