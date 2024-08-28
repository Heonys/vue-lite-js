


<p align='center'>
  <img src='./img/logo.png' width='400'/>
</p>

<p align='center'>Clones Vue.js to implement a basic MVVM framework</p>

<p align='center'>
    <a href=''>
        <img src="https://img.shields.io/badge/deploy-YourAppURL-blue" />
    </a>
    <a href=''>
        <img src="https://img.shields.io/badge/CDN-Active-brightgreen" />
    </a>
    <a href='https://www.npmjs.com/package/vue-lite-js'>
        <img src="https://img.shields.io/npm/v/vue-lite-js" />
    </a>
</p>

<p align='center'>
  한국어 | <a href='./README.en.md'>English</a> 
</p>

## 🚀 Introduction


현대적인 프레임워크들이 `MVVM(Model-View-ViewModel)` 패턴을 사용하여 효율적인 데이터 바인딩과 사용자 인터페이스 관리를 지원한다는 점에서 영감을 받아 이러한 `MVVM` 패턴을 기반으로 하여 `vue.js`와 유사한 기능을 제공하는 기초적인 `MVVM` 프레임워크입니다. <br>

이 프로젝트의 주된 목표는 `vue.js`의 핵심 동작 방식을 클론하면서, `MVVM` 패턴과 옵저버 패턴을 실제로 적용해보는 것입니다 <br>

프로젝트의 기본적인 구조는 [reference](URL)의 코드를 기반으로 하였으며 복잡한 문제를 고려하지 않았지만, 양방향 데이터 바인딩 원리와 `vue.js`의 핵심원리를 이해하는데 도움을 줄 수 있다고 생각합니다  <br>


## 🎉 Getting Started

#### Using npm
`vuelite`를 `npm`에서 설치하고 프로젝트에서 사용하려면, 다음 명령어를 실행하세요
```sh
npm install vue-lite-js@latest
```
#### Local Development
개발 환경에서 직접 `vuelite`를 테스트하거나 소스 코드를 수정하고 싶다면, 다음 단계를 따라주세요

##### 저장소 클론 
```sh
git clone https://github.com/Heonys/vue-lite-js 
```
##### 의존성 설치
```sh
npm install 
```
##### 개발 서버 실행 
```sh
npm run start 
```
프로젝트 내부 `src`폴더 에서 소스코드를 수정하고 `dev`폴더 내의 `index.html`과 `index.ts` 에서 빠른 테스트 가능 합니다


## 💡Basic usage

<p align="center">
  <img src="./img/Animation.gif" alt="Description of GIF" />
</p>

```html
<div id="app">
  <input type="text" v-model="message" />
  <p v-style="textStyle">{{ message }}</p>
  <button v-on:click="handleClick">change vuelite</button>
  <div>
    <input type="checkbox" v-model="checked" />
    <span>{{ isChecked }}</span>
  </div>
</div>
```
```ts
import Vuelite from "vue-lite-js";

new Vuelite({
  el: "#app",
  data() {
    message : "",
    checked: true,
    textStyle: { color: "#FF0000" },
  },
  methods: {
    handleClick() {
      this.message  = "vuelite";
    },
  },
  computed: {
    isChecked() {
      return this.checked ? "checked" : "unchecked";
    },
  }
})
```

## ✨ Details 

>1. 기본적으로 `vue.js`의 **Option API** 방식을 클론하고 있으며, `vue.js`의 핵심 기능을 지원하지만 모든 기능을 지원하지 않습니다. <br /> ※ [todos]()에서 향후 업데이트 예정 사항을 확인할 수 있습니다.
>2. 옵션에서 `template` 속성은 지원하지만 `vue.js`의 `.vue` 파일과 같은 로더를 지원하지 않기 때문에 `HTML` 파일에서 마크업을 직접 작성해야 하는 불편함이 있습니다. 따라서 전통적인 프레임워크보다는 라이브러리에 가까운 특성을 가지고 있습니다. 
>3. 싱글 파일 컴포넌트 포맷을 지원하지 않기 때문에 `<style>` 블록의 형태를 지원하기 위해서 옵션에서 `styles` 속성을 지원합니다.
>4. 스타일 바인딩과 클래스 바인딩의 편의를 위해서 `v-style`, `v-class` 디렉티브를 지원합니다. 동작은 `v-bind:`를 사용한 바인딩과 동일하게 동작합니다.



## 🧩 Overview

<p align="center">
  <img src="./img/diagram.png" alt="Description of diagram" />
</p>

## 🧭 Workflow

### 1. viewmodel 생성 
```ts
const vm = new Vuelite({
  el: "#app",
  data() {
    return {}
  },
  methods: {},
  computed: {},
  styles: {},
})
```
- data, computed, method, template, styles, ... 
- styles 속성은 스타일 시트를 생성하여 docuemnt.head에 추가 

### 2. 반응성 주입
- data -> proxy 객체 생성 
- get 트랩 -> Dep 생성 
- set 트랩 -> 해당 속성에 해당하는 Dep의 notify 호출 
- 쉽게말해 모든 data들은 프록시로 래핑되며 모든 속성당 1:1 대응하여 Dep가 생성됨 
  하지만 프록시가 생성되는 타이밍에 getter가 호출되는건 아니기 때문에 
  정확히는 이 타이밍에는 프록시 객체가 래핑되어 get트랩, set트랩이 등록되는 단계 
  이후에 해당 속성이 변경될때 -> set트랩이 발동되며 값을 가로채는데 이때 해당 dep를 
  구독하고 있는 모든 Obserber 들에게 update가 발생한다 
- computed, methods -> vm에서 접근가능 하도록 속성추가 

### 3. 디렉티브 및 템플릿 파싱 
```ts
const scanner = new VueScanner(new NodeVisitor());
scanner.scan(this);
```
- 옵션에서 전달받은 `el` 속성으로 부터 하위의 모든 노드를 순회하면서 `v-`접두사가 붙은 디렉티브 속성 또는 `{{ }}` 템플릿 문법을 사용하고 있는 모든 텍스트를 검사한다 여기서 `DOM`을 순회하는게 아닌 `Node`를 순회하는 이유는 템플릿을 파싱하기 위해 텍스트 노드까지 검사해야하기 때문

- 노드 순회를 위해 순회하는 역할 자체는 `Visitor`에게 위임하고 노드마다 처리할 구체적인 액션은 `Scanner`에서 처리하도록 visitor와 scanner를 분리 


### 4. Directive 생성 

```ts
const action = (node: Node) => {
  isReactiveNode(node) && new Observable(vm, node);
};
```
모든 노드를 순회하면서 해당 노드가 디렉티브를 갖거나 텍스트에 템플릿 문법을 갖고있는지를 확인하고 `Observable` 생성

```ts
new Directive(...);
```
- `Observable`에선 단순히 `v-`접두사를 갖는 디렉티브인지 템플릿인지 여부만 확인하여 `Directive`를 생성하고 있고 템플릿 바인딩은 `v-text` 디렉티브로 변경됨
- 이때 이벤트를 등록하는 `v-on`을 제외하고 모든 디렉티브는 `updater`를 인자로 받아서 `v-bind` 에서 일괄적으로 Observer를 생성한다


### 5. v-model 바인딩 

```html
<!-- v-model을 사용한 양방향 바인딩 -->
<div>
  <input type="text" v-model="title">
  <div>{{ title }}</div>
</div>`;

<!-- 단방향 바인딩 + 이벤트 핸들러 -->
<div>
  <input 
    type="text" 
    v-bind:value="title" 
    v-on:input="handleInput"
  >
  <div>{{ title }}</div>
</div>
```



  /* 
    양방향 바인딩 (input, textarea, select 지원)
    input 요소의 값이나 상태를 통일된 방식으로 접근할 수 있게해서 일관되게 바인딩하게 해준다 

    date, month, time, week 등 날짜나 시간관련된 속성 및 레거시 속성들을 제외  
    file의 경우는 논외로 v-model이 아닌 change 이벤트를 통해 수동으로 파일관리를 해야함 
    지원되는 input 타입 (text, number, url, tel, search, ragnge, radio, password, email, color, checkbox)
  */

### 6. Observer 생성

```ts
bind(updater?: Updater) {
// ... 
const value = evaluateValue(this.vm, this.exp);
updater && updater(this.node, value);
new Observer(this.vm, this.exp, (value) => {
  updater && updater(this.node, value);
});
```
디렉티브 종류에 따라서 `updater`가 정해지고 결과적으로 `Obserber`가 생성된다 
`updater`란 `Reactive`가 주입된 속성에서 변화가 일어나 set트랩에서 notify가 발생했을때 
해당 dep을 구독하고있는 모든 Observer들 에게 변화가 일어났으니 업데이트를 하라고 알림을 보내는데 
그 시점에 Observer가 변화에 대응하여 `DOM`을 업데이트 하도록 즉, viewmodel data 변화가 최종적으로 화면에 반영되는
구체적인 업데이트 함수를 의미한다

- 위의 코드에서 `Observer`가 생성되기 전에 `updater`를 한번 실행하는데 이건 첫렌더링에 viewmodel의 속성을 dom에 반영하기 위함이다

즉, 옵션에서 전달한 data 들은 모두 1:1로 매핑되는 Dep가 생성되고, 반대로 모든 디렉티브는 1:1로 매핑되는 Observer가 생성된다


#### Observer와 Dep의 관계 
- 서로가 서로를 컬렉션으로 관리한다
Dep의 입장에서는 여러 Observer들을 관리하는데 이는 여러개의 디렉티브에서 같은 데이터를 사용할 수 있기 때문이고 
반대로 하나의 디렉티브에서 여러개의 반응형 데이터에 의존할 수 있기 때문에 Observer 입장에서 Dep 컬렉션을 갖고있는 것 

#### getterTrigger

```ts
// Observer
getterTrigger() {
  Dep.activated = this;
  const value = evaluateValue(this.vm, this.exp);
  Dep.activated = null;
  return value;
}
// Dep 
depend() {
    Dep.activated?.addDep(this);
}
```
`Observer` 클래스에서 `getterTrigger` 메소드가 존재하는데 이 메소드의 역할은 단순히 `vm`에서 해당 속성을 가져오는 일을 한다
하지만 이 함수는 굉장히 중요한 역할을 하고있는데 

1. 처음에 `Reactivty` 클래스에서 모든 data 속성에 래핑한 프록시 객체의 get 트랩을 발생시키기 위한 의도로 사용된다
2. get 트랩이 발생되기 이전에 `Dep.activated`를 현재의 this 즉, 현재의 `Observer`로 설정을 해놓고 
  get 트랩이 발생하면 `dep.depend()`를 호출하여 해당 `Observer`에 `Dep`를 등록하며 반대로 해당 옵저버는 Dep을 구독하게된다  
  
결과적으로 `getterTrigger`는 반응형 데이터의 get트랩을 발생시킴과 동시에 `Observer`와 `Dep`의 관계를 이어주는 역할을 한다












## 📝 Todos
- [ ] 디렉티브 축약 형태 지원하기 
- [ ] v-for, v-if/else 디렉티브 추가하기 
- [ ] 템플릿에서 표현식 사용하기 (삼항연산자, 배열 인덱스접근, 메소드 사용 등...)
- [ ] watch 추가하기 
- [ ] created, mounted, updated 등의 훅 추가하기 
- [ ] 뷰모델 분리하기 (중첩될 수 있기 때문에 부모자식 관계를 유지)
- [ ] props, children 지원하기 
- [ ] 부분적으로 Composition API 지원하기 

## 📖 Reference
- [DMQ](https://github.com/DMQ)
- [bue](https://github.com/bowencool/bue)


