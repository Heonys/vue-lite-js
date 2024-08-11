const str = "{name: jiheon, type: hello }";

function addQuotes(str) {
  return str
    .replace(/(\w+):/g, '"$1":') // 키에 쌍따옴표 추가
    .replace(/:\s*([^,\s{}]+)/g, (match, p1) => {
      if (/^'.*'$/.test(p1) || /^".*"$/.test(p1)) return match;
      return `: "${p1}"`; // 값에 쌍따옴표 추가
    });
}

const result = addQuotes(str);
console.log(result); // 출력: {"name": "jiheon", "type": "hello"}
