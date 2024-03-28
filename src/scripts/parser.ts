export const parser = (tokens: Token[]): ParserReturn => {
  const params: string[] = [];
  let trigger: Trigger = { name: '', subtTriggers: [] };
  const body: any[] = [];
  const tokensList: Token[] = [...tokens];

  tokens.forEach((token: Token, i: number) => {
    if (token.type === 'Params') {
      params.push(parseParams(tokensList));
    } else if (token.type === 'Trigger') {
      trigger = parseTrigger(tokensList);
    } else if (token.type === 'Var') {
      body.push(parseVar(tokensList));
    } else if (token.type === 'Print') {
      body.push(parsePrint(tokensList));
    } else if (token.type === 'If') {
      body.push(parseIf(tokensList, tokens));
    } else if (token.type === 'Else') {
      body.push(parseElse(tokensList, tokens));
    }
  });
  
  console.log(tokensList);
  return { program: { params, trigger, body }};
};

const parseParams = (tokensList: Token[]): any => {
  const params: string[] = [];
  for (const token of tokensList) {
    if (token.type === 'Semicolon') break;
    if (token.type === 'Identifier')
      params.push(token.value);
    tokensList.shift();
  };
  tokensList.shift();
  return params;
};

const parseTrigger = (tokensList: Token[]): any => {
  tokensList.shift();
  const name = tokensList[0].value;
  const subtTriggers: SubTrigger[] = [];
  tokensList.shift();

  for (const t of tokensList) {
    const token: any = tokensList.shift();
    if (token.type === 'Semicolon') break;
    if (token.type === 'Identifier') {
      subtTriggers.push(token.value);
    }
  };
  return { name, subtTriggers };
};

const parseVar = (tokensList: Token[]): any => {
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
  return { type: 'Var', value: _var };
};

const parsePrint = (tokensList: Token[]): any => {
  tokensList.shift();
  const value: any[] = [];
  let i = 0;
  while (i < tokensList.length) {
    const token = tokensList[i];
    if (token.type === 'Semicolon') break;
    value.push(token);
    i++;
  }
  tokensList.splice(0, i + 1);
  return { type: 'Print', value };
};

const parseIf = (tokensList: Token[], tokens: Token[]): any => {
  tokensList.shift();
  const conditional: any[] = [];
  const value: any[] = [];
  let i = 0;
  while (i < tokensList.length) {
    const token = tokensList[i];
    if (token.type === 'LBrace') break;
    conditional.push(token);
    i++;
  }
  tokensList.splice(0, i + 1);
  tokens.splice(0, i);  
  i = 0;
  while (i < tokensList.length) {
    const token = tokensList[i];
    if (token.type === 'RBrace') break;
    value.push(token);
    i++;
  }
  tokensList.splice(0, i);
  tokens.splice(0, i);
  return({ type: 'If', conditional: conditional, body: parser(value).program?.body });
};

const parseElse = (tokensList: Token[], tokens: Token[]): any => {
  const elseBody: any[] = [];
  const elseConditional: any[] = [];
  tokensList.shift();
  if (tokensList[0].type === 'Else') tokensList.shift();      
  
  if (tokensList[0].type === 'If') {
    tokensList.shift();
    let i = 0;
    while (i < tokensList.length) {
      const token = tokensList[i];
      if (token.type === 'LBrace') break;
      elseConditional.push(token);
      i++;
    }
    tokensList.splice(0, i + 1);
    tokens.splice(0, i + 1);

    i = 0;
    while (i < tokensList.length) {
      const token = tokensList[i];
      if (token.type === 'RBrace') break;
      elseBody.push(token);
      i++;
    }
    tokensList.splice(0, i + 1);
    tokens.splice(0, i + 1);
    return { type: 'If', conditional: elseConditional, body: parser(elseBody).program?.body };
  } else {
    if (tokensList[0].type === 'LBrace') tokensList.shift();
    let i = 0;
    while (i < tokensList.length) {
      const token = tokensList[i];
      if (token.type === 'RBrace') break;
      elseBody.push(token);
      i++;
    }
    tokensList.splice(0, i + 1);
    tokens.splice(0, i + 1);
    return { type: 'Else', body: parser(elseBody).program?.body };
  }
};
