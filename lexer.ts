import { Token } from "./types.ts";
import { scripts } from "./script.ts";
import { parser } from "./parser.ts";

const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
const KEYWORDS: Record<string, string> = {
	print: 'Print',
  var: 'Var',
};

const token = (type: string, value = ""): Token => {
  return { type, value };
};

const isInt = (value: string) => {
  const x = parseFloat(value);
  return x && !isNaN(x);
};

const isSkippable = (str: string) => {
	return str == ' ' || str == '\n' || str == '\t';
};

const lexer = (scripts: string[]) => {
  scripts.forEach((script: string) => {
    const tokenizeRes = toxenize(script);
    if (tokenizeRes.error) {
      console.error(tokenizeRes.error);
      return;
    }
    
    const parserRes = parser(tokenizeRes.tokens as Token[]);
    if (parserRes.error) {
      console.error(parserRes.error);
      return;
    }
    console.log(parserRes.programs);
  });
};


const toxenize = (script: string) => {
  const tokens = new Array<Token>();
  const src = script.split('');

  while (src.length > 0) {
    const char = src[0];
    if (char === '(') {
      tokens.push(token('OpenParen', src.shift()));
    } else if (char === ')') {
      tokens.push(token('CloseParen', src.shift()));
    } else if (char === '+' || char === '-' || char === '*' || char === '/') {
      tokens.push(token('Operator', src.shift()));
    } else if (char === '=') {
      tokens.push(token('Equals', src.shift()));
    } else if (char === ';') {
      tokens.push(token('SemiColon', src.shift()));
    } else {
      if (isSkippable(char)) {
        src.shift();
      } else if (isInt(char)) {
        let num = '';
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }
        tokens.push(token('Number', num));
      } else if (varChars.includes(char)) {
        let ident = '';
        while (src.length > 0 && varChars.includes(src[0])) {
          ident += src.shift();
        }
        
        const reserved = KEYWORDS[ident];
        if (reserved) {
          tokens.push(token(reserved, ident));
        } else {
          tokens.push(token('Identifier', ident));
        }
      } else if (char === '"') {
        let str = '';
        src.shift();
        while (src.length > 0) {
          const nextChar = src.shift();
          if (nextChar === '"') {
            tokens.push(token('String', str));
            break;
          } else {
            str += nextChar;
          }
        }
        if (src.length === 0 && str[str.length - 1] !== '"') {
          return { error: `Expected end of string at: ${str}` };
        }
      } else {
        return { error: `Unreconized character: "${src[0]}"` };
      }
    }
  }
  return { error: false, tokens };
};

lexer(scripts);
