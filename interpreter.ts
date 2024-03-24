import { Token, Variable, Error } from "./types.ts";


const variables = new Map<string, string | number | null>();

export const interpreter = (programs: [Token[]]) => {
  for (const prgm of programs) {
    const prgmResult = runPrgm(prgm);
    if (prgmResult.error) {
      console.error(prgmResult.error);
      return;
    }
  }
};

const runPrgm = (prgm: Token[]): Error => {
  switch (prgm[0].type) {
    case 'Print':
      return handlePrint(prgm);
    case 'Var':
      return declareVar(prgm);
    default:
      return { error: `Unknown keyword: "${prgm[0].type}"` };
  }
};

const handlePrint = (prgm: Token[]): Error => {
  if (prgm.length > 2) return { error: `Expected semicolon after: "${prgm[1].value}"` };
  console.log(prgm[1].value);
  return { error: false };
};

const declareVar = (prgm: Token[]): Error => {
  const hasEqualsToken = prgm.find((t) => t.type === 'Equals') !== undefined;

  if (prgm.length > 2 && hasEqualsToken) {
    if (prgm.length <= 4 && prgm[1].type === 'Identifier' && prgm[2].type === 'Equals') {
      variables.set(prgm[1].value, prgm[3].value);
    } else {
      return { error: `Expected semicolon after: "${prgm[3].value}"` };
    }
  } else {
    if (prgm[1].type === 'Identifier' && prgm.length <= 2) {
      variables.set(prgm[1].value, null);
    } else {
      return { error: `Expected semicolon after: "${prgm[1].value}"` };
    }
  }
  console.log(variables);
  return { error: false };
};
