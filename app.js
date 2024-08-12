// const expression = "a > 10?5 ";
const expression = "a > 10 ? 'high' : 'low'";

function evaluateCondition(str) {
  const ptn = /(.*?)\s*\?\s*(.*?)\s*:\s*(.*)/;

  const match = str.match(ptn);
  return (
    match && {
      condition: match[1],
      truthy: match[2],
      falsy: match[3],
    }
  );
}

console.log(evaluateCondition(expression));
