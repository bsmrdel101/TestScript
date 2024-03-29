import { isMathExpression, parseMathExpression } from "./math";

const variables = new Map<string, string | number | boolean | null>();
export const getVar = (name: string) => variables.get(name);


export const interpreter = (program: Program) => {
  const { params, body } = program;
  body.forEach((stmt) => {
    if (stmt.type === 'Var') {
      const { error } = declareVar(stmt.value);
      if (error) return error;
    } else if (stmt.type === 'Print') {
      const { error } = print(stmt.value);
      if (error) return error;
    } else if (stmt.type === 'If') {
      const { error } = ifStatement(stmt);
      if (error) return error;
    }
  });
  return { error: false };
};

const declareVar = (stmt: any) => {
  const value = parseValue(stmt.value);
  if (stmt.value[0].type === 'Number' || stmt.value.length > 1) {
    variables.set(stmt.name, Number(value));
  } else if (stmt.value[0].type === 'Boolean') {
    variables.set(stmt.name, Boolean(value));
  } else {
    variables.set(stmt.name, value);
  }
  console.log(getVar(stmt.name));
  return { error: false };
};

const print = (stmt: any) => {
  const value = parseValue(stmt);
  console.log('PRINT: ', value);
  return { error: false };
};

const ifStatement = (stmt: any) => {
  console.log(stmt);
  const conditional: boolean = isConditionalTrue(stmt.conditional);
  console.log(conditional);
  return { error: false };
};

const parseValue = (token: any) => {
  if (isMathExpression(token as any)) {
    return parseMathExpression(token);
  } else if (token.some((t: any) => t.type === 'Identifier')) {
    return token.map((t: any) => getVar(t.value) as string)[0];
  } else {
    return token[0].value ? token[0].value : null;
  }
};

const isConditionalTrue = (tokens: Token[]): boolean => {
  if (tokens.length === 1 && tokens[0].type === 'Boolean') {
    return tokens[0].value as any;
  }

  let operatorIndex = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens.find(token => token.type === 'Conjunction')) {
      operatorIndex = i;
      break;
    }
  }

  tokens = tokens.map((token: Token) => {
    if (token.type === 'Identifier') {
      const _var = getVar(token.value);
      const type = `${(typeof _var).charAt(0).toUpperCase()}${(typeof _var).split('').slice(1).join('')}`
      return { type: type, value: _var } as any;
    }
    return token;
  }).filter((t) => t.type !== 'LParen' && t.type !== 'RParen');
  console.log(tokens);

  if (operatorIndex === -1) {
    return evaluateSimpleComparison(tokens);
  }

  const operatorToken = tokens.find(token => token.type === 'Conjunction');
  if (!operatorToken) throw new Error('Invalid operator in conditional expression');
  
  const operator = operatorToken.value;
  const leftTokens = tokens.slice(0, operatorIndex);
  const rightTokens = tokens.slice(operatorIndex + 1);

  switch (operator) {
    case '&&':
      return isConditionalTrue(leftTokens) && isConditionalTrue(rightTokens);
    case '||':
      return isConditionalTrue(leftTokens) || isConditionalTrue(rightTokens);
    default:
      throw new Error('Invalid conjunction/disjunction operator');
  }
};

const evaluateSimpleComparison = (tokens: Token[]): boolean => {
  const [left, operatorToken, right] = tokens;
  if (!left || !operatorToken || !right) throw new Error('Invalid comparison expression');
  let leftValue = left.value;
  let rightValue = right.value;

  const operator = operatorToken.type;
  switch (operator) {
    case 'IsEqual':
      return leftValue === rightValue;
    case 'NotEqual':
      return leftValue !== rightValue;
    case 'LessThan':
      return leftValue < rightValue;
    case 'LessThanEqual':
      return leftValue <= rightValue;
    case 'GreaterThan':
      return leftValue > rightValue;
    case 'GreaterThanEqual':
      return leftValue >= rightValue;
    default:
      throw new Error(`Invalid operator in comparison expression: "${operator}"`);
  }
};
