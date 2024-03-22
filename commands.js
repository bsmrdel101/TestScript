const printCmd = (tokens, i) => {
  const nextToken = tokens[i + 1];
  let isString = nextToken.type === 'string';
  if (!isString) {
    return console.log(`Unexpected token ${nextToken.type}, expected string`);
  }

  console.log(nextToken.value)
};
