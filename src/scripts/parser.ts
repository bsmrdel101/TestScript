export const parser = (tokens: Token[]): ParserReturn => {
  const params: Variable[] = [];
  let trigger: Trigger = { name: '', subtTriggers: [] };
  const body: any[] = [];
  const tokensList = [...tokens];

  tokens.forEach((token: Token, i: number) => {
    if (token.type === 'Params') {
      for (const token of tokensList) {
        if (token.type === 'Semicolon') break;
        if (token.type === 'Identifier')
          params.push({ name: token.value, value: token.value });
        tokensList.shift();
      };
      tokensList.shift();
    } else if (token.type === 'Trigger') {
      tokensList.shift();
      trigger = { name: tokensList[0].value, subtTriggers: [] };

      for (const token of tokensList) {
        console.log(token);
        
        if (token.type === 'Semicolon') break;
        if (token.type === 'Identifier') {
          trigger.subtTriggers.push({ name: token.value });
          tokensList.shift();
        } else {
          tokensList.shift();
        }
      };
    }
  });
  return { program: { params, trigger, body }};
};
