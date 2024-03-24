import { evaluatePostfixExpression, parseMathExpression } from "./parser.ts";
import { Token, Error } from "./types.ts";


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
  let val = prgm[1].value;
  if (prgm[1].type === 'Expression') {
    const newExpr = (val as any).map((token: Token) => {
      if (token.type === 'Identifier') {
        return { type: 'Number', value: variables.get(token.value) };
      } else {
        return token;
      }
    });
    const postfixExpression = parseMathExpression(newExpr);
    val = (evaluatePostfixExpression(postfixExpression)[0] as Token).value;
  }

  if (prgm.length > 2) return { error: `Expected semicolon in "Print" expression` };
  const output = variables.get(val) ? variables.get(val) : val;
  console.log(output);
  return { error: false };
};

const declareVar = (prgm: Token[]): Error => {
  const hasEqualsToken = prgm.find((t) => t.type === 'Equals') !== undefined;

  if (prgm.length > 2 && hasEqualsToken) {
    if (prgm.length <= 4 && prgm[1].type === 'Identifier' && prgm[2].type === 'Equals') {
      variables.set(prgm[1].value, prgm[3].value);
    } else {
      return { error: `Expected semicolon in "var" expression` };
    }
  } else {
    if (prgm[1].type === 'Identifier' && prgm.length <= 2) {
      variables.set(prgm[1].value, null);
    } else {
      return { error: `Expected semicolon in "var" expression` };
    }
  }
  return { error: false };
};
