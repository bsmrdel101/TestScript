import { isMathExpression, parseMathExpression } from "./math";

const variables = new Map<string, string | number | null>();
export const getVar = (name: string) => variables.get(name);


export const interpreter = (program: Program) => {
  const { params, body } = program;
  body.forEach((stmt) => {
    if (stmt.type === 'Var') {
      const { error } = declareVar(stmt);
      if (error) return error;
    }
  });
  return { error: '' };
};

const declareVar = (stmt: any) => {
  const value = parseValue(stmt.value);
  if (stmt.value.value[0].type === 'Number' || stmt.value.value.length > 1) {
    variables.set(stmt.value.name, Number(value));
  } else {
    variables.set(stmt.value.name, value);
  }
  console.log(getVar(stmt.value.name));
  return { error: false };
};

const parseValue = (token: any) => {
  if (isMathExpression(token.value as any)) {
    return parseMathExpression(token.value);
  } else {
    return token.value ? token.value[0].value : null;
  }
};
