import { isMathExpression, parseMathExpression } from "./math";

const variables = new Map<string, string | number | null>();
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
    }
  });
  return { error: false };
};

const declareVar = (stmt: any) => {
  const value = parseValue(stmt.value);
  if (stmt.value[0].type === 'Number' || stmt.value.length > 1) {
    variables.set(stmt.name, Number(value));
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

const parseValue = (token: any) => {
  if (isMathExpression(token as any)) {
    return parseMathExpression(token);
  } else {
    return token[0].value ? token[0].value : null;
  }
};
