import { Token } from "./types.ts";

export const parser = (tokens: Token[]) => {
  const programs: any = [];
  let currentStatement: Token[] = [];

  tokens.forEach((token: Token) => {
    if (token.type === 'SemiColon') {
      programs.push(parseStatement(currentStatement));
      currentStatement = [];
    } else {
      currentStatement.push(token);
    }
  });
  return { error: false, programs };
};

const parseStatement = (tokens: Token[]) => {
  if (isMathExpression(tokens)) {
    const postfixExpression = parseMathExpression(tokens);
    return evaluatePostfixExpression(postfixExpression);
  } else {
    return tokens;
  }
};

const isMathExpression = (tokens: Token[]) => {
  return tokens.some((token) => token.type === 'Operator' || token.type === 'OpenParen' || token.type === 'CloseParen');
};

const parseMathExpression = (tokens: Token[]) => {
  const output: Token[] = [];
  const operators: string[] = [];
  const precedence = {
    '-': 1,
    '+': 2,
    '/':3,
    '*': 4
  };

  for (const token of tokens) {
    if (token.type === 'Number') {
      output.push(token);
    } else if (token.type === 'Operator') {
      while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[token.value]) {
        output.push({ type: 'Operator', value: operators.pop() as string });
      }
      operators.push(token.value);
    } else if (token.type === 'OpenParen') {
      operators.push(token.value);
    } else if (token.type === 'CloseParen') {
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
  return output;
};

const evaluatePostfixExpression = (expression: Token[]) => {
  const output: Token[] = [];
  const stack: number[] = [];

  for (const token of expression) {
    if (token.type === 'Number') {
      stack.push(parseInt(token.value));
    } else if (token.type === 'Operator') {
      if (token.value === '+' || token.value === '-') {
        const rightOperand = stack.pop() as number;
        const leftOperand = stack.pop() as number;
        if (token.value === '+') {
          stack.push(leftOperand + rightOperand);
        } else {
          stack.push(leftOperand - rightOperand);
        }
      } else if (token.value === '*' || token.value === '/') {
        const rightOperand = stack.pop() as number;
        const leftOperand = stack.pop() as number;
        if (token.value === '*') {
          stack.push(leftOperand * rightOperand);
        } else {
          stack.push(leftOperand / rightOperand);
        }
      }
    } else {
      output.push(token);
    }
  }
  return [...output, { type: 'Number', value: stack.pop()?.toString() }];
};
