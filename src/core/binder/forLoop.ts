import { extractKeywords } from "@/utils/format";
import Vuelite from "../viewmodel/vuelite";

/* 
일단 v-else 처럼 v-bind:key 의 경우 디렉티브 생성을 하지 않도록 해야할듯
그리고 ForLopp에서 key의 여부를 확인하는게 합리적일 것 같다


근데 중요한건 자식을 스킵하는데
문제는 자식을 ForLoop에서 돌면서 새로운 element를 만들어서 삽입해야하는데
이때, 자식에 디렉티브가 존재하면 이 시점에 새로운 Directive를 생성해줘야하는 파싱단계가 추가됨





*/
export class ForLoop {
  hasKey: boolean;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {
    this.hasKey = el.hasAttribute(":key") || el.hasAttribute("v-bind:key");
    const keywords = extractKeywords(this.exp);
    if (!keywords) return;

    const { value, list } = keywords;

    /* 
    item in items 이렇게 들어오면 

    1. 우선 items에 해당 하는 컬렉션을 vm에서 가져옴 
    2. 배열인지 객체에인지에 따라서 (item, index) 또는 (value, key, index) 형태로 값을 가져옴
    3. 

    내부에서 변수 이름을
    
    
    */
  }
}
