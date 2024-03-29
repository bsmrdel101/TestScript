import { addMacro } from "./addMacro";
import { parser } from "./parser";

export const lexer = (script: string) => {
  const { tokens, tokenError }: TokenList = tokenize(script);
  if (tokenError) {
    console.error(tokenError);
    return;
  }
  console.log('TOKENS: ', tokens);

  const { program, parserError }: ParserReturn = parser(tokens as Token[]);
  if (parserError) {
    console.error(parserError);
    return;
  }
  console.log('PROGRAM: ', program);

  addMacro(program as Program);
};

const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890';
const KEYWORDS: Record<string, 'Var' |
'Number' |
'String' |
'Boolean' |
'Identifier' |
'Params' |
'Trigger' |
'Equals' |
'NotEqual' |
'IsEqual' |
'Operator' |
'LessThan' |
'GreaterThan' |
'LessThanEqual' |
'GreaterThanEqual' |
'LParen' |
'RParen' |
'LBrace' |
'RBrace' |
'LBracket' |
'RBracket' |
'If' |
'Else' |
'While' |
'Conjunction' |
'Print' |
'Semicolon' |
'Colon' |
'Comma' |
'PlusEquals' |
'MinusEquals' |
'TimesEquals' |
'DivideEquals' |
'Exclamation' |
'Shutdown'> = {
  print: 'Print',
  var: 'Var',
  if: 'If',
  else: 'Else',
  while: 'While',
  shutdown: 'Shutdown',
  params: 'Params',
  true: 'Boolean',
  false: 'Boolean'
};

const s = (value: string | undefined): string => value as string;

const getOperatorType = (char: string): 'PlusEquals' | 'MinusEquals' | 'TimesEquals' | 'DivideEquals' => {
  switch (char) {
    case '+':
      return 'PlusEquals';
    case '-':
      return 'MinusEquals';
    case '*':
      return 'TimesEquals';
    case '/':
      return 'DivideEquals';
    default:
      return 'PlusEquals';
  }
};

const isInt = (value: string) => {
  const x = parseFloat(value);
  return x === 0 || x && !isNaN(x);
};

const isSkippable = (str: string): boolean => {
  return str == ' ' || str == '\n' || str == '\t';
};


const tokenize = (script: string): TokenList => {
  const tokens = new Array<Token>();
  const src = script.split('');

  while (src.length > 0) {
    const char = src[0];
    if (char === '(') {
      tokens.push({ type: 'LParen', value: s(src.shift()) });
    } else if (char === ')') {
      tokens.push({ type: 'RParen', value: s(src.shift()) });
    } else if (char === '+' || char === '-' || char === '*' || char === '/' || char === '%') {
      const operatorType = getOperatorType(char);
      if (src[1] === '=') {
        tokens.push({ type: operatorType, value: s(src.shift()) + src.shift() });
      } else {
        tokens.push({ type: 'Operator', value: s(src.shift()) });
      }
    } else if (char === '=') {
      if (src[1] === '=') {
        tokens.push({ type: 'IsEqual', value: s(src.shift()) + src.shift() });
      } else {
        tokens.push({ type: 'Equals', value: s(src.shift()) });
      }
    } else if (char === '!') {
      if (src[1] === '=') {
        tokens.push({ type: 'NotEqual', value: s(src.shift()) + src.shift() });
      } else {
        tokens.push({ type: 'Exclamation', value: s(src.shift()) });
      }
    } else if(char === '&' && src[1] === '&') {
      tokens.push({ type: 'Conjunction', value: s(src.shift()) + src.shift() });
    } else if(char === '|' && src[1] === '|') {
      tokens.push({ type: 'Conjunction', value: s(src.shift()) + src.shift() });
    } else if (char === '>') {
      if (src[1] === '=') {
        tokens.push({ type: 'GreaterThanEqual', value: s(src.shift()) + src.shift() });
      } else {
        tokens.push({ type: 'GreaterThan', value: s(src.shift()) });
      }
    } else if (char === '<') {
      if (src[1] === '=') {
        tokens.push({ type: 'LessThanEqual', value: s(src.shift()) + src.shift() });
      } else {
        tokens.push({ type: 'LessThan', value: s(src.shift()) });
      }
    } else if (char === '$') {
      tokens.push({ type: 'Trigger', value: s(src.shift()) });
    } else if (char === ';') {
      tokens.push({ type: 'Semicolon', value: s(src.shift()) });
    } else if (char === ':') {
      tokens.push({ type: 'Colon', value: s(src.shift()) });
    } else if (char === ',') {
      tokens.push({ type: 'Comma', value: s(src.shift()) });
    } else if (char === '{') {
      tokens.push({ type: 'LBrace', value: s(src.shift()) });
    } else if (char === '}') {
      tokens.push({ type: 'RBrace', value: s(src.shift()) });
    } else {
      if (isSkippable(char)) {
        src.shift();
      } else if (isInt(char)) {
        let num = '';
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }
        tokens.push({ type: 'Number', value: num });
      } else if (varChars.includes(char)) {
        let ident = '';
        while (src.length > 0 && varChars.includes(src[0])) {
          ident += src.shift();
        }
        
        const reserved = KEYWORDS[ident];
        if (reserved) {
          tokens.push({ type: reserved, value: ident });
        } else {
          tokens.push({ type: 'Identifier', value: ident });
        }
      } else if (char === '"') {
        let str = '';
        src.shift();
        while (src.length > 0) {
          const nextChar = src.shift();
          if (nextChar === '"') {
            tokens.push({ type: 'String', value: str });
            break;
          } else {
            str += nextChar;
          }
        }
        if (src.length === 0 && str[str.length - 1] !== '"') {
          return { tokenError: `Expected end of string at: ${str.split(' ')[0]}` };
        }
      } else {
        return { tokenError: `Unreconized character: "${src[0]}"` };
      }
    }
  }
    
  return { tokens: tokens };
};
