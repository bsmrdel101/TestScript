document.addEventListener('DOMContentLoaded', () => onLoad());
const onLoad = () => {
  const input = document.querySelector('textarea');
  document.getElementById('run-btn').addEventListener('click', () => runInterpreter(input.value));
};


const BUILT_IN_KEYWORDS = ['print', 'var'];
const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
const variables = [];

const runInterpreter = (script) => {
  const lexedScript = tokenize(script);
  if (lexedScript.error) {
    console.error(lexedScript.error);
    return;
  }
  console.log('TOKENS: ', lexedScript.tokens);
  parse(lexedScript.tokens);
};

const tokenize = (script) => {
  const tokens = [];
  let i = 0;
  const length = script.length;

  while (i < length) {
    const currentChar = script[i];
    if (currentChar === ' ' || currentChar === '\n') {
      i++;
      continue;
    } else if (currentChar === '"') {
      let res = '';
      i++;

      while (script[i] !== '"' && script[i] !== '\n' && i < length) {
        res += script[i];
        i++;
      }

      if (script[i] !== '"') return { error: `String is missing ending "` };
      i++;

      tokens.push({ type: 'string', value: res });
    } else if (varChars.includes(currentChar)) {
      let res = currentChar;
      i++;

      while (varChars.includes(script[i]) && i < length) {
        res += script[i];
        i++;
      }

      if (res === 'var') {
        let variable = '';
        while (varChars.includes(script[i + 1]) && i < length) {
          variable += script[i + 1];
          i++;
        }
        console.log(variable);
        continue;
      }
      if (!BUILT_IN_KEYWORDS.includes(res)) return { error: `Unexpected token ${res}` };
      
      tokens.push({ type: 'keyword', value: res });
    } else {
      return {
        error: `Unexpected character ${script[i]}`
      };
    }
  }

  return {
    error: false,
    tokens
  };
};

const parse = (tokens) => {
  const length = tokens.length;
  let i = 0;

  while (i < length) {
    const token = tokens[i];
    if (token.type === 'keyword' && token.value === 'print') {
      if (!tokens[i + 1]) {
        return console.error("Unexpected end of line, expected string");
      } else {
        printCmd(tokens, i);
      }
    }

    if (token.type === 'keyword' && token.value === 'var') {
      
    }


    i += 2
  }
};
