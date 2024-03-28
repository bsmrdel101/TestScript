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
    } else if (token.type === 'Print') {
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
      body.push({ type: 'Print', value: value });
    } else if (token.type === 'If') {
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
      body.push({ type: 'If', conditional: conditional, body: parser(value).program?.body });
    } else if (token.type === 'Else') {
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
        body.push({ type: 'If', conditional: elseConditional, body: parser(elseBody).program?.body });
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
        body.push({ type: 'Else', body: parser(elseBody).program?.body });
      }
    } else if (token.type === 'While') {
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
      tokensList.splice(0, i + 1);
      tokens.splice(0, i + 1);
      body.push({ type: 'While', conditional: conditional, body: parser(value).program?.body });
    }
  });
  console.log(tokensList);
  return { program: { params, trigger, body }};
};
