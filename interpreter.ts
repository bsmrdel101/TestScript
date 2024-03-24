import { Token, Variable, Error } from "./types.ts";


const variables: Variable[] = [];

export const interpreter = (programs: [Token[]]) => {
  console.log(programs);
  
  programs.forEach((prgm: Token[]) => {
    const prgmResult = runPrgm(prgm);
    if (prgmResult.error) {
      console.error(prgmResult.error);
      return;
    }
  });
};

const runPrgm = (prgm: Token[]): Error => {
  switch (prgm[0].type) {
    case 'Print':
      return handlePrint(prgm);
    case 'Var':
      return handleVar(prgm);
    default:
      return { error: `Unknown keyword: "${prgm[0].type}"` };
  }
};

const handlePrint = (prgm: Token[]): Error => {
  if (prgm.length > 2) return { error: `Expected semicolon after: "${prgm[1].value}"` };
  console.log(prgm[1].value);
  return { error: false };
};

const handleVar = (prgm: Token[]): Error => {
  return { error: false };
};
