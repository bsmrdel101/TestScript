document.addEventListener('DOMContentLoaded', () => onLoad());

const onLoad = () => {
  const input = document.querySelector('textarea');
  document.getElementById('run-btn').addEventListener('click', () => runInterpreter(input.value));
};

const runInterpreter = (script) => {
  const lexedScript = tokenize(script);
  console.log(lexedScript.tokens);
};

const tokenize = (script) => {
  const tokens = [];
  let i = 0;
  const length = script.length;
  const BUILT_IN_KEYWORDS = ['print'];
  const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

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

      if (script[i] !== '"') {
        return {
          error: `Unterminated string`
        };
      }
      i++;

      tokens.push({
        type: 'string',
        value: res
      });
    } else if (varChars.includes(currentChar)) {
      let res = currentChar;
      i++;

      while (varChars.includes(script[i]) && i < length) {
        res += script[i];
        i++;
      }

      if (!BUILT_IN_KEYWORDS.includes(res)) {
        return {
          error: `Unexpected token ${res}`
        };
      }

      tokens.push({
        type: 'keyword',
        value: res
      });
    } else {
      return {
        error: `Unexpected character ${this.codes[pos]}`
      };
    }

    return {
      error: false,
      tokens
    };
  }
};

const parse = (tokens) => {

};
