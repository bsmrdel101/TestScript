import { getVar } from "./interpreter";

export const isMathExpression = (tokens: any[]) => {
  return tokens.some((token) => token.type === 'Operator');
};

export const parseMathExpression = (tokens: Token[]): any => {
  const output: Token[] = [];
  const operators: string[] = [];
  const precedence: any = {
    '-': 1,
    '+': 2,
    '/':3,
    '*': 4
  };

  for (const token of tokens) {
    if (token.type === 'Number') {
      output.push(token);
    } else if (token.type === 'Identifier') {
      output.push(token);
    } else if (token.type === 'Operator') {
      while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[token.value]) {
        output.push({ type: 'Operator', value: operators.pop() as string });
      }
      operators.push(token.value);
    } else if (token.type === 'LParen') {
      operators.push(token.value);
    } else if (token.type === 'RParen') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push({ type: 'Operator', value: operators.pop() as string });
      }
      operators.pop();
    } else {
      output.push(token);
    }
  }

  while (operators.length > 0) {
    output.push({ type: 'Operator', value: operators.pop() as string });
  }
  return evaluatePostfixExpression(output);
};

const evaluatePostfixExpression = (expression: any): number => {
  const stack: any = [];

  for (const token of expression) {
    if (token.type === 'Number') {
      stack.push(Number(token.value));
    } else if (token.type === 'Operator') {
      const right = stack.pop();
      const left = stack.pop();

      switch (token.value) {
        case '+':
          stack.push(left + right);
          break;
        case '-':
          stack.push(left - right);
          break;
        case '*':
          stack.push(left * right);
          break;
        case '/':
          stack.push(left / right);
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }
    } else if (token.type === 'Identifier') {
      stack.push(Number(getVar(token.value)));
    }
  }
  return stack.pop();
};