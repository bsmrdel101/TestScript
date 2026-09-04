export class Environment {
  private variables = new Map<string, Value>();

  get(name: string): Value {
    if (!this.variables.has(name)) {
      throw new Error(`Undefined variable: ${name}`);
    }

    return this.variables.get(name)!;
  }

  set(name: string, value: Value): void {
    this.variables.set(name, value);
  }

  has(name: string): boolean {
    return this.variables.has(name);
  }
}
