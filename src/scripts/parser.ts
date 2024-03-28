export const parser = (tokens: Token[]): ParserReturn => {
  const params: Variable[] = [];
  let trigger: Trigger = { name: '', subtTriggers: [] };
  const body: any[] = [];
  const tokensList: Token[] = [...tokens];

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
      tokensList.shift();
      

      for (const t of tokensList) {
        const token: any = tokensList.shift();
        if (token.type === 'Semicolon') break;
        if (token.type === 'Identifier') {
          trigger.subtTriggers.push({ name: token.value });
        }
      };
    } else if (token.type === 'Var') {
      tokensList.shift();
      const varName = tokensList.shift()?.value as string;
      const _var: Variable = { name: varName, value: null };
      const value: any[] = [];
      for (const t of tokensList) {
        const token: any = tokensList.shift();
        if (token.type === 'Semicolon') break;
        if (token.type !== 'Equals') {
          value.push(token);
        }
      };
      _var.value = value;
      body.push({ type: 'Var', value: _var });
    }
  });
  console.log(tokensList);
  return { program: { params, trigger, body }};
};
