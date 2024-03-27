export const lexer = (script: string) => {
  const { tokens, error }: TokenList = tokenize(script);
  if (error) {
    console.error(error);
    return;
  }
  console.log(tokens);
};

const tokenize = (script: string): TokenList => {


    
  return { tokens: [], error: '' };
};