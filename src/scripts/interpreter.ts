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
  const conditional = getConditionalStructure(stmt.conditional);
  const result = isConditionalTrue(conditional);
  console.log(conditional, result);
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

const isConditionalJoin = (token: Token) => token.type === 'Conjunction' || token.type === 'LessThan' || token.type === 'LessThanEqual' || token.type === 'GreaterThan' || token.type === 'GreaterThanEqual' || token.type === 'IsEqual' || token.type === 'NotEqual';

const getConditionalStructure = (tokens: Token[]) => {
  const arrays = [];
  let currentArray: any = [];
  tokens.shift();
  tokens.pop();
  tokens.forEach((token) => {
    if (isConditionalJoin(token)) {
      currentArray.push(token);
      if (currentArray.length > 0) {
        arrays.push(currentArray);
        currentArray = [];
      }
    } else {
      currentArray.push(token);
    }
  });
  if (currentArray.length > 0) arrays.push(isMathExpression(currentArray) ? [{ type: 'Number', value: parseMathExpression(currentArray) }] : currentArray); 
  return arrays;
};

const isConditionalTrue = (conditional: Token[][]) => {
  for (let i = 0; i < conditional.length; i++) {
    const condition: any = conditional[i];
    const join = isConditionalJoin(condition[condition.length - 1]) ? condition.pop() : null;
    console.log(condition, join);
  }
  return true;
};
