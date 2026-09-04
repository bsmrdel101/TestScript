import { parser } from "./parser";


const KEYWORDS: Record<string, TokenType> = {
  var: 'Var',
  true: 'Boolean',
  false: 'Boolean',
  print: 'Print',
  if: 'If',
  else: 'Else',
  while: 'While',
  event: 'Event',
  exit: 'Exit'
};

const isIdentifierChar = (char: string) => /[a-zA-Z0-9_]/.test(char);
const isDigit = (char: string) => /[0-9]/.test(char);
const isWhitespace = (char: string) => /\s/.test(char);

const createToken = (type: TokenType, value: string): Token => ({ type, value });


export const compile = (script: string) => {
  const lexerResult = tokenize(script);
  if (lexerResult.tokenError) {
    return { error: lexerResult.tokenError };
  }

  const parseResult = parser(lexerResult.tokens!);
  if (parseResult.parserError) {
    return { error: parseResult.parserError };
  }

  const program = parseResult.program!;

  return { program };
};

const tokenize = (script: string): TokenList => {
  const tokens: Token[] = [];
  let position = 0;
  
  const current = () => script[position];
  const next = () => script[position + 1];

  const advance = () => {
    position++;
  };

  while (position < script.length) {
    const char = current();

    if (isWhitespace(char)) {
      advance();
      continue;
    }

    if (char === '(') {
      tokens.push(createToken('LParen', char));
      advance();
      continue;
    }

    if (char === ')') {
      tokens.push(createToken('RParen', char));
      advance();
      continue;
    }

    if (char === '{') {
      tokens.push(createToken('LBrace', char));
      advance();
      continue;
    }

    if (char === '}') {
      tokens.push(createToken('RBrace', char));
      advance();
      continue;
    }

    if (char === ';') {
      tokens.push(createToken('Semicolon', char));
      advance();
      continue;
    }

    if (char === ':') {
      tokens.push(createToken('Colon', char));
      advance();
      continue;
    }

    if (char === ',') {
      tokens.push(createToken('Comma', char));
      advance();
      continue;
    }

    if (char === '.') {
      tokens.push(createToken('Dot', char));
      advance();
      continue;
    }

    if (char === '&' && next() === '&') {
      tokens.push(createToken('Conjunction', '&&'));
      position += 2;
      continue;
    }

    if (char === '|' && next() === '|') {
      tokens.push(createToken('Conjunction', '||'));
      position += 2;
      continue;
    }

    if (char === '=' && next() === '=') {
      tokens.push(createToken('IsEqual', '=='));
      position += 2;
      continue;
    }

    if (char === '!' && next() === '=') {
      tokens.push(createToken('NotEqual', '!='));
      position += 2;
      continue;
    }

    if (char === '<' && next() === '=') {
      tokens.push(createToken('LessThanEqual', '<='));
      position += 2;
      continue;
    }

    if (char === '>' && next() === '=') {
      tokens.push(createToken('GreaterThanEqual', '>='));
      position += 2;
      continue;
    }

    if (char === '+' && next() === '=') {
      tokens.push(createToken('PlusEquals', '+='));
      position += 2;
      continue;
    }

    if (char === '-' && next() === '=') {
      tokens.push(createToken('MinusEquals', '-='));
      position += 2;
      continue;
    }

    if (char === '*' && next() === '=') {
      tokens.push(createToken('TimesEquals', '*='));
      position += 2;
      continue;
    }

    if (char === '/' && next() === '=') {
      tokens.push(createToken('DivideEquals', '/='));
      position += 2;
      continue;
    }

    if (char === '=') {
      tokens.push(createToken('Equals', char));
      advance();
      continue;
    }

    if (char === '!') {
      tokens.push(createToken('Exclamation', char));
      advance();
      continue;
    }

    if (char === '<') {
      tokens.push(createToken('LessThan', char));
      advance();
      continue;
    }

    if (char === '>') {
      tokens.push(createToken('GreaterThan', char));
      advance();
      continue;
    }

    if ('+-*/%'.includes(char)) {
      tokens.push(createToken('Operator', char));
      advance();
      continue;
    }

    if (char === '"') {
      advance();

      let value = '';

      while (position < script.length && current() !== '"') {
        value += current();
        advance();
      }

      if (position >= script.length) {
        return {
          tokenError: 'Unterminated string, missing end quote'
        };
      }

      advance();

      tokens.push(createToken('String', value));
      continue;
    }

    if (isDigit(char)) {
      let value = '';

      while (position < script.length && (isDigit(current()) || current() === '.')) {
        value += current();
        advance();
      }

      tokens.push(createToken('Number', value));
      continue;
    }

    if (isIdentifierChar(char)) {
      let value = '';

      while (position < script.length && isIdentifierChar(current())) {
        value += current();
        advance();
      }

      const keyword = KEYWORDS[value];

      if (keyword) {
        tokens.push(createToken(keyword, value));
      } else {
        tokens.push(createToken('Identifier', value));
      }

      continue;
    }

    return {
      tokenError: `Unrecognized character: "${char}"`
    };
  }

  return { tokens };
};
