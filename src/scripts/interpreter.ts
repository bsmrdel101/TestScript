import { Environment } from "./environment";


export class Interpreter {
  constructor(private readonly environment = new Environment()) {}

  execute(program: Program): void {
    for (const statement of program.statements) {
      this.executeStatement(statement);
    }

    const onLoad = program.events.get('OnLoad');

    if (onLoad) {
      this.executeBlock(onLoad.body);
    }
  }

  trigger(program: Program, trigger: Trigger): void {
    const event = program.events.get(trigger);

    if (!event) {
      return;
    }

    this.executeBlock(event.body);
  }

  private executeStatement(statement: Statement): void {
    switch (statement.type) {
      case 'Var':
        this.executeVariable(statement);
        break;
      case 'Print':
        this.executePrint(statement);
        break;
      case 'If':
        this.executeIf(statement);
        break;
      case 'While':
        this.executeWhile(statement);
        break;
      case 'Assignment':
        this.executeAssignment(statement);
        break;
    }
  }

  private executeVariable(statement: VariableDeclaration): void {
    if (this.environment.has(statement.name)) {
      throw new Error(`Variable "${statement.name}" is already declared`);
    }

    const value = this.evaluate(statement.value);
    this.environment.set(statement.name, value);
  }

  private executePrint(statement: PrintStatement): void {
    console.log(this.evaluate(statement.value));
  }

  private executeIf(statement: IfStatement): void {
    if (this.boolean(this.evaluate(statement.conditional))) {
      this.executeBlock(statement.body);
      return;
    }

    if (statement.elseBody) {
      this.executeBlock(statement.elseBody);
    }
  }

  private executeWhile(statement: WhileStatement): void {
    while (this.boolean(this.evaluate(statement.conditional))) {
      this.executeBlock(statement.body);
    }
  }

  private executeBlock(statements: Statement[]): void {
    for (const statement of statements) {
      this.executeStatement(statement);
    }
  }

  private executeAssignment(statement: AssignmentStatement): void {
    const current = this.environment.get(statement.name);
    const value = this.evaluate(statement.value);

    switch (statement.operator) {
      case '=':
        this.environment.set(statement.name, value);
        break;
      case '+=':
        this.environment.set(
          statement.name,
          this.numeric(current) + this.numeric(value)
        );
        break;
      case '-=':
        this.environment.set(
          statement.name,
          this.numeric(current) - this.numeric(value)
        );
        break;
      case '*=':
        this.environment.set(
          statement.name,
          this.numeric(current) * this.numeric(value)
        );
        break;
      case '/=':
        this.environment.set(
          statement.name,
          this.numeric(current) / this.numeric(value)
        );
        break;
    }
  }

  private evaluate(expression: Expression): Value {
    switch (expression.type) {
      case 'Literal':
        return expression.value;
      case 'Variable':
        return this.environment.get(expression.name);
      case 'BinaryExpression':
        return this.evaluateBinary(expression);
      case 'UnaryExpression':
        return this.evaluateUnary(expression);
      case 'ComparisonExpression':
        return this.evaluateComparison(expression);
      case 'LogicalExpression':
        return this.evaluateLogical(expression);
      case 'MemberExpression':
        return this.evaluateMember(expression);
      case 'CallExpression':
        return this.evaluateCall(expression);
    }
  }

  private evaluateBinary(expression: BinaryExpression): number {
    const left = this.numeric(this.evaluate(expression.left));
    const right = this.numeric(this.evaluate(expression.right));

    switch (expression.operator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '%':
        return left % right;
    }
  }

  private evaluateUnary(expression: UnaryExpression): Value {
    const value = this.evaluate(expression.operand);

    switch (expression.operator) {
      case '!':
        return !this.boolean(value);
      case '-':
        return -this.numeric(value);
    }
  }

  private evaluateComparison(expression: ComparisonExpression): boolean {
    const left = this.evaluate(expression.left);
    const right = this.evaluate(expression.right);

    switch (expression.operator) {
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      case '<':
        return this.numeric(left) < this.numeric(right);
      case '>':
        return this.numeric(left) > this.numeric(right);
      case '<=':
        return this.numeric(left) <= this.numeric(right);
      case '>=':
        return this.numeric(left) >= this.numeric(right);
    }
  }

  private evaluateLogical(expression: LogicalExpression): boolean {
    const left = this.boolean(this.evaluate(expression.left));

    if (expression.operator === '&&') {
      if (!left) return false;
      return this.boolean(this.evaluate(expression.right));
    }

    if (left) return true;
    return this.boolean(this.evaluate(expression.right));
  }

  private evaluateMember(expression: MemberExpression): Value {
    const object = this.evaluate(expression.object);

    if (object === null || typeof object !== 'object') {
      throw new Error(`Cannot access property "${expression.property}" on ${typeof object}`);
    }

    return object[expression.property] ?? null;
  }

  private evaluateCall(expression: CallExpression): Value {
    throw new Error('Function calls are not implemented');
  }

  private numeric(value: Value): number {
    if (typeof value !== 'number') {
      throw new Error(`Expected number, got ${typeof value}`);
    }
    return value;
  }

  private boolean(value: Value): boolean {
    if (typeof value !== 'boolean') {
      throw new Error(`Expected boolean, got ${typeof value}`);
    }
    return value;
  }
}
