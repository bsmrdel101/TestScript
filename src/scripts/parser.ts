export const parser = (tokens: Token[]): ParserReturn => {
  try {
    return {
      program: new Parser(tokens).parse()
    };
  } catch (error) {
    return {
      parserError: error instanceof Error ? error.message : String(error)
    };
  }
};


const triggers: Trigger[] = [
  'OnLoad',
  'OnPlayerJoin',
  'OnPlayerLeave',
  'OnDeath',
  'OnPlayerDeath',
  'OnRoundStart',
  'OnTurnStart',
  'OnTokenMove',
  'BeforeRoll',
  'AfterRoll',
  'BeforeAtk',
  'AfterAtk',
  'BeforeDmg',
  'AfterDmg'
];

const isTrigger = (value: string): value is Trigger => triggers.includes(value as Trigger);

class Parser {
  private position = 0;

  constructor(private readonly tokens: Token[]) {}

  private current(): Token | undefined {
    return this.tokens[this.position];
  }

  private advance(): Token {
    const token = this.tokens[this.position];

    if (!token) {
      throw new Error('Unexpected end of input');
    }

    this.position++;
    return token;
  }

  private check(type: TokenType): boolean {
    return this.current()?.type === type;
  }

  private match(type: TokenType): boolean {
    if (!this.check(type)) {
      return false;
    }

    this.advance();
    return true;
  }

  private expect(type: TokenType): Token {
    const token = this.current();

    if (!token || token.type !== type) {
      throw new Error(
        `Expected ${type}, got ${token?.type ?? 'end of input'}`
      );
    }

    return this.advance();
  }

  parse(): Program {
    const statements: Statement[] = [];
    const events = new Map<Trigger, EventHandler>();

    while (this.current()) {
      if (this.check('Event')) {
        const event = this.parseEvent();
        if (events.has(event.trigger)) {
          throw new Error(`Event "${event.trigger}" is already declared`);
        }

        events.set(event.trigger, event);
        continue;
      }

      statements.push(this.parseStatement());
    }

    return { statements, events };
  }

  private parseStatement(): Statement {
    const token = this.current();

    if (!token) {
      throw new Error('Unexpected end of input');
    }

    switch (token.type) {
      case 'Var':
        return this.parseVariable();
      case 'Print':
        return this.parsePrint();
      case 'If':
        return this.parseIf();
      case 'While':
        return this.parseWhile();
      case 'Identifier':
        return this.parseAssignment();
      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }

  private parseVariable(): VariableDeclaration {
    this.expect('Var');

    const name = this.expect('Identifier').value;
    this.expect('Equals');

    const value = this.parseExpression();
    this.expect('Semicolon');

    return {
      type: 'Var',
      name,
      value
    };
  }

  private parsePrint(): PrintStatement {
    this.expect('Print');

    const value = this.parseExpression();
    this.expect('Semicolon');

    return {
      type: 'Print',
      value
    };
  }

  private parseAssignment(): AssignmentStatement {
    const name = this.expect('Identifier').value;
    const operator = this.advance();
    const assignmentOperators: Record<string, AssignmentOperator> = {
      '=': '=',
      '+=': '+=',
      '-=': '-=',
      '*=': '*=',
      '/=': '/='
    };

    const assignmentOperator = assignmentOperators[operator.value];
    if (!assignmentOperator) {
      throw new Error(`Invalid assignment operator: ${operator.value}`);
    }

    const value = this.parseExpression();
    this.expect('Semicolon');

    return {
      type: 'Assignment',
      name,
      operator: assignmentOperator,
      value
    };
  }

  private parseIf(): IfStatement {
    this.expect('If');

    const conditional = this.parseParenthesizedExpression();
    const body = this.parseBlock();

    let elseBody: Statement[] | undefined;

    if (this.match('Else')) {
      if (this.match('If')) {
        const nestedIf = this.parseIf();

        elseBody = [nestedIf];
      } else {
        elseBody = this.parseBlock();
      }
    }

    return {
      type: 'If',
      conditional,
      body,
      elseBody
    };
  }

  private parseWhile(): WhileStatement {
    this.expect('While');

    const conditional = this.parseParenthesizedExpression();
    const body = this.parseBlock();

    return {
      type: 'While',
      conditional,
      body
    };
  }

  private parseEvent(): EventHandler {
    this.expect('Event');

    const trigger = this.expect('Identifier').value;
    if (!isTrigger(trigger)) {
      throw new Error(`Unknown event trigger: ${trigger}`);
    }
    
    this.expect('LParen');
    this.parseExpression();
    this.expect('RParen');

    const ctx = { player: { id: 1, name: 'BEAN', hp: 10 } };
    const body = this.parseBlock();

    return { trigger, ctx, body };
  }

  private parseBlock(): Statement[] {
    this.expect('LBrace');
    const statements: Statement[] = [];

    while (!this.check('RBrace')) {
      if (!this.current()) {
        throw new Error('Expected }');
      }
      statements.push(this.parseStatement());
    }

    this.expect('RBrace');
    return statements;
  }

  private parseParenthesizedExpression(): Expression {
    this.expect('LParen');

    const expression = this.parseExpression();

    this.expect('RParen');

    return expression;
  }

  private parseExpression(): Expression {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): Expression {
    let expression = this.parseLogicalAnd();

    while (this.check('Conjunction') && this.current()!.value === '||') {
      this.advance();
      const right = this.parseLogicalAnd();

      expression = {
        type: 'LogicalExpression',
        operator: '||',
        left: expression,
        right
      };
    }

    return expression;
  }

  private parseLogicalAnd(): Expression {
    let expression = this.parseEquality();

    while (this.check('Conjunction') && this.current()!.value === '&&') {
      this.advance();
      const right = this.parseEquality();

      expression = {
        type: 'LogicalExpression',
        operator: '&&',
        left: expression,
        right
      };
    }

    return expression;
  }

  private parseEquality(): Expression {
    let expression = this.parseComparison();

    while (this.check('IsEqual') || this.check('NotEqual')) {
      const operator = this.advance();
      const right = this.parseComparison();

      expression = {
        type: 'ComparisonExpression',
        operator: operator.type === 'IsEqual' ? '==' : '!=',
        left: expression,
        right
      };
    }

    return expression;
  }

  private parseComparison(): Expression {
    let expression = this.parseAddition();

    while (this.check('LessThan') || this.check('GreaterThan') || this.check('LessThanEqual') || this.check('GreaterThanEqual')) {
      const operator = this.parseComparisonOperator();
      const right = this.parseAddition();

      expression = {
        type: 'ComparisonExpression',
        operator,
        left: expression,
        right
      };
    }

    return expression;
  }

  private parseComparisonOperator(): ComparisonOperator {
    const token = this.advance();

    switch (token.type) {
      case 'LessThan':
        return '<';
      case 'GreaterThan':
        return '>';
      case 'LessThanEqual':
        return '<=';
      case 'GreaterThanEqual':
        return '>=';
      case 'IsEqual':
        return '==';
      case 'NotEqual':
        return '!=';
      default:
        throw new Error(`Expected comparison operator, got ${token.type}`);
    }
  }

  private parseAddition(): Expression {
    let expression = this.parseMultiplication();

    while (this.check('Operator') && ['+', '-'].includes(this.current()!.value)) {
      const operator = this.advance().value as MathOperator;
      const right = this.parseMultiplication();

      expression = {
        type: 'BinaryExpression',
        operator,
        left: expression,
        right
      };
    }

    return expression;
  }

  private parseMultiplication(): Expression {
    let expression = this.parseUnary();

    while (this.check('Operator') && ['*', '/', '%'].includes(this.current()!.value)) {
      const operator = this.advance().value as MathOperator;
      const right = this.parseUnary();

      expression = {
        type: 'BinaryExpression',
        operator,
        left: expression,
        right
      };
    }

    return expression;
  }

  private parseUnary(): Expression {
    if (this.check('Exclamation')) {
      this.advance();

      return {
        type: 'UnaryExpression',
        operator: '!',
        operand: this.parseUnary()
      };
    }

    if (
      this.check('Operator') &&
      this.current()!.value === '-'
    ) {
      this.advance();

      return {
        type: 'UnaryExpression',
        operator: '-',
        operand: this.parseUnary()
      };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): Expression {
    let expression = this.parsePrimary();

    while (true) {
      if (this.match('Dot')) {
        const property = this.expect('Identifier').value;

        expression = {
          type: 'MemberExpression',
          object: expression,
          property
        };

        continue;
      }

      if (this.match('LParen')) {
        const args: Expression[] = [];

        if (!this.check('RParen')) {
          do {
            args.push(this.parseExpression());
          } while (this.match('Comma'));
        }

        this.expect('RParen');

        expression = {
          type: 'CallExpression',
          callee: expression,
          arguments: args
        };

        continue;
      }

      break;
    }

    return expression;
  }

  private parsePrimary(): Expression {
    const token = this.advance();

    switch (token.type) {
      case 'Number':
        return {
          type: 'Literal',
          value: Number(token.value)
        };

      case 'String':
        return {
          type: 'Literal',
          value: token.value
        };

      case 'Boolean':
        return {
          type: 'Literal',
          value: token.value === 'true'
        };

      case 'Identifier':
        return {
          type: 'Variable',
          name: token.value
        };

      case 'LParen': {
        const expression = this.parseExpression();
        this.expect('RParen');
        return expression;
      }

      default:
        throw new Error(`Unexpected token in expression: ${token.type}`);
    }
  }
}
