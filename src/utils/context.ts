import { typeOf } from "./format";

export function createContext(alias: string[], exp: string, index: number, data: any) {
  if (typeOf(data) === "object") {
    const key = Object.keys(data)[index];
    switch (alias.length) {
      case 1: {
        return { [alias[0]]: `${exp}.${key}` };
      }
      case 2: {
        return { [alias[0]]: `${exp}.${key}`, [alias[1]]: `${key}` };
      }
      case 3: {
        return {
          [alias[0]]: `${exp}.${key}`,
          [alias[1]]: `${key}`,
          [alias[2]]: index,
        };
      }
      default: {
        return {};
      }
    }
  } else if (typeOf(data) === "number") {
    switch (alias.length) {
      case 1: {
        return { [alias[0]]: index + 1 };
      }
      case 2: {
        return { [alias[0]]: index + 1, [alias[1]]: index };
      }
      default: {
        return {};
      }
    }
  } else {
    switch (alias.length) {
      case 1: {
        return { [alias[0]]: `${exp}[${index}]` };
      }
      case 2: {
        return { [alias[0]]: `${exp}[${index}]`, [alias[1]]: index };
      }
      default: {
        return {};
      }
    }
  }
}

export function loopSize(value: any) {
  switch (typeOf(value)) {
    case "string":
    case "array": {
      return value.length;
    }
    case "object": {
      return Object.values(value).length;
    }
    case "number": {
      return Math.max(0, Number(value));
    }
    default: {
      return 0;
    }
  }
}
