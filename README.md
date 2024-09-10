
<p align='center'>
  <img src='./img/logo.png' width='400'/>
</p>

<p align='center'>Clones Vue.js to implement a basic MVVM framework</p>

<p align='center'>
    <a href='https://vuelite-demo.vercel.app'>
        <img src="https://img.shields.io/badge/deploy-Vuelite Demo-blue" />
    </a>
    <a href=''>
        <img src="https://img.shields.io/badge/CDN-Active-brightgreen" />
    </a>
    <a href='https://www.npmjs.com/package/vue-lite-js'>
        <img src="https://img.shields.io/npm/v/vue-lite-js" />
    </a>
</p>

<p align='center'>
  <strong>✅ 한국어</strong> | <a href='./README.en.md' target="_blank">English</a> 
</p>

## 🚀 Introduction


현대적인 프레임워크들이 `MVVM(Model-View-ViewModel)` 패턴을 사용하여 효율적인 데이터 바인딩과 사용자 인터페이스 관리를 지원한다는 점에서 영감을 받아 이러한 `MVVM` 패턴을 기반으로 `Vue.js`를 클론하여 유사한 기능과 문법을 제공하는 기초적인 `MVVM` 프레임워크입니다. <br>

이 저장소의 주된 목표는 `Vue.js`의 핵심 동작 방식을 클론하면서, `MVVM` 패턴과 핵심적인 옵저버 패턴을 적용해 보는 것입니다. 프로젝트의 전반적인 구조는 [#Reference](#-reference)의 코드를 기반으로 하였으며 복잡한 문제를 고려하지 않았지만, 양방향 데이터 바인딩과 `Vue.js`의 핵심원리를 이해하는데 도움을 줄 수 있다고 생각합니다.  <br>


## 🎉 Getting Started

- #### Using npm
`vuelite`를 `npm`에서 설치하고 프로젝트에서 사용하려면, 다음 명령어를 실행하세요
```sh
npm install vue-lite-js@latest
```

- #### Using cdn
브라우저에서 직접 사용하려면, 아래와 같이 `cdn`을 통해 스크립트를 포함하세요
```html
<script src="https://unpkg.com/vue-lite-js@latest"></script>
```

- #### Local Development
개발 환경에서 소스 코드를 수정하고 직접 테스트 하고싶으면, 다음 단계를 따라주세요

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

##### 테스트를 위한 마크다운 및 스크립트 작성  
```sh
📦 vuelite 
├── 📂 dev 
│    ├── 📄 index.html ✅
│    └── 📄 index.ts ✅
├── 📂 src ✅
│    ├── 📂 core
│    ├── 📂 types
│    ... 
```
`src`폴더 에서 소스코드를 수정하고 `dev`폴더에서 마크다운과 스크립트 작성이 가능합니다.


## 💡Basic usage

<p align="center">
  <img src="./img/Animation.gif" alt="Description of GIF" />
  <br />
  <span>CDN Demo: </span>
  <a href='https://vuelite-demo.vercel.app' target="_blank">https://vuelite-demo.vercel.app</a>
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
    return {
      message : "",
      checked: true,
      textStyle: { color: "#FF0000" },
    }
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

- 기본적으로 `Vue.js`의 **Option API** 방식을 클론하고 있으며, `Vue.js`의 핵심 기능을 지원하지만 모든 기능을 지원하지 않습니다. 

- 옵션에서 `template` 속성은 지원하지만, `Vue.js`의 `.vue` 확장자와 같은 로더를 지원하지 않기 때문에 `HTML` 파일에서 따로 마크업을 작성해야 하는 불편함이 있습니다. 따라서 템플릿을 분리해서 사용하는 방식은 전통적인 `Vue.js`보다는 `Angular`와 유사한 면이 있습니다.

- 싱글 파일 컴포넌트 포맷을 지원하지 않는 이러한 특성 때문에 `<style>` 태그 형태를 지원하기 위해서 `styles` 속성을 지원합니다.

```ts
new Vuelite({
  // ... 
  styles: {    
    "#wrapper": {
      // only camelCase key
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
  },
})
```
- `v-if/else`와 `v-show`를 통한 조건부 렌더링을 지원하지만, `<template>`에서의 `v-if`를 지원하지 않아서 단일 엘리먼트에서만 사용가능하며 `v-else-if` 디렉티브를 지원하지 않습니다. 



## 🧩 Overview

<p align="center">
  <img src="./img/diagram.png" alt="Description of diagram" />
</p>

## ⭐ Workflow

### 1. viewmodel 생성 
```ts
class Vuelite {
  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;
    injectReactive(this);
    injectStyleSheet(this);
    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);
  }
}
```
`MVVM` 패턴에서 `viewmodel` 역할을 수행하는 `vue` 인스턴스의 생성 단계로 `option` 객체를 받아서 `DOM`과 데이터 바인딩을 제공할 수 있도록 하는 진입점 역할을 합니다.

> **Viewmodel을 구현하는 핵심 아이디어**
>1. 옵션객체로 받아온 데이터에 반응성을 불어넣어 데이터의 변화를 감지
>2. DOM을 순회하며 디렉티브를 파싱하고 옵저버를 생성  
>3. 반응형 데이터와 옵저버의 상호작용에 따른 양방향 바인딩을 달성 


### 2. 반응성 주입

<p align="center">
  <img src="./img/diagram2.png" alt="Description of diagram" />
</p>


```ts
// target: 래핑하려는 원본 객체
// handler: 동작을 가로채는 메서드인 '트랩(trap)'이 담긴 객체
new Proxy(target, handler);
```
[Proxy](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 객체는 원본 객체를 감싸는 객체로 타겟이 되는 원본 객체에 대한 접근을 제어하거나, 특정 동작을 가로채서 새로운 기능을 추가할 수 있게 하는 래핑 객체입니다. 


`viewmodel`에서 데이터의 변화를 감지하여 실제 뷰(DOM)와의 양방향 바인딩하는 것이 우리의 목적이기 때문에 데이터의 변화에 어떻게 감지할 수 있을지 고민해 봐야 하는데 이를 위해 자바스크립트에서는 언어 차원에서 객체의 속성에 동적으로 `getter`와 `setter`를 등록할 수 있게 해주는 `Object.defineProperty`와 더불어 `Proxy`를 사용하여 이를 구현할 수 있습니다. <br /> 

>실제로 `Vue2` 에서는 `defineProperty`로 반응형 데이터를 구현하고, `Vue3` 에서는 `Proxy`를 사용하여 반응형 데이터를 구현합니다.


따라서 `Proxy`객체로 `viewmodel`의 모든 `data` 속성을 래핑하여 `get 트랩`, `set 트랩`을 추가하고 모든 속성들의 변화를 감지하도록 구현할 것입니다. <br />

```ts
const handler = {
  get(target: Target, key: string, receiver: Target) {
    // 1. get 트랩 (getter)
  },
  set(target: Target, key: string, value: any, receiver: Target) {
    // 2. set 트랩 (setter)
  },
};
new Proxy(data, handler);
```
하지만 `Proxy`를 생성하는 현재 단계에선 `getter`, `setter`를 설명하기 난해한 부분이 존재하는데 헷갈리지 말아야 하는건 이 부분은 해당 속성에 접근하거나 해당 속성의 값을 수정할 때 작동하는 트랩으로 어차피 나중에 실행되는 부분으로 핵심적인 로직이긴 하지만, 지금 단계에선 그냥 `getter`, `setter`를 등록함으로써 `Reactivty`를 주입했구나 하고 생각하면 될 것 같습니다.

1) **get 트랩** <br />
[Dep](#dep-객체-생성) 객체를 생성하고 현재 활성화된 [Observer](#5-observer-생성)와의 의존성을 연결하는 역할을 합니다. `Scanner`에서 디렉티브를 파싱하고 `Observer`를 생성할 때, 해당 디렉티브에 해당하는 `expresion`을 `vm`에서 찾는 과정에서 `getter`를 발생시키고 따라서 해당 `expresion`에 매핑되는 `Dep`이 생성되어 생성된 `Obserber`와의 연결이 맺어집니다.

2) **set 트랩** <br />
`get 트랩`은 옵저버가 생성될 때 이미 한번은 실행되었기 때문에 이후에 `set 트랩`에서는 항상 해당하는 `key`에 대응하는 `Dep`과 매핑되어 있습니다. `setter`가 발생한 시점은 해당 속성 값의 변화가 일어났다는 뜻으로 `notify`를 호출함으로써 해당 `Dep`을 구독하고 있는 모든 `Observer`들에게 너가 의존하고 있는 속성에 변화가 일어났으니 `update`를 하라고 알림을 보내는 역할을 합니다.


#### Dep 객체 생성 
`Dep`객체는 `Dependency`의 약자로 데이터의 변화를 감지하고, 구독자인 `Observer`들에게 알림을 하는 역할을 합니다. `Proxy`를 생성할 때 데이터의 모든 속성마다 `Dep`객체가 생성되는 것으로도 알 수 있지만 모든 반응형 데이터들은 매핑되는 `Dep`을 가지고 있습니다. 여기서 `Dep` 인스턴스 자체는 매핑된 반응형 데이터에 대한 상태를 가지고 있지 않으며, 이는 `Reactivty`의 `define`메소드에서 내부적으로 `deps`라는 이름으로 `key`와 `Dep`를 매핑하여 관리하고 있기 때문에 나중에 `setter`가 동작할 때 클로저 공간에 있는 `deps`에 접근하여 매핑되는 `key`가 뭔지 알 수 있기 때문에 `Dep` 자체는 자기가 매핑된 키에 대한 상태를 갖고 있지 않고 `notify`를 할 수 있습니다.


```ts
class Dep {
  static activated: Observer
  //...
}
```
`activated`속성은 현재 활성화된 옵저버가 무엇인지 상태를 갖고 `Dep`과 `Obserber`의 의존관계를 맺기 위한 `static`변수로 일종의 전역변수 같은 느낌으로 사용됩니다. 

#### computed와 methods 주입
```ts
injectMethod(vm);
injectComputed(vm);
```
`DOM`과 바인딩이 되어야 하는 `data`들과는 다르게 `computed`와 `method`들은 반응성을 주입할 필요가 없습니다. 따라서 `viewmodel`에서 접근할 수 있도록 `viewmodel`의 속성으로 등록해 주면 되는데 핵심은 `this` 바인딩을 통해 `computed` 또는 `method`내부에서 `this`를 사용할 때 `this`가 `vm`을 가리키도록 명시적으로 지정해 줍니다.

### 3. 디렉티브 및 템플릿 파싱 
```ts
const scanner = new VueScanner(new NodeVisitor());
scanner.scan(this);
```
옵션에서 전달받은 `el` 속성으로부터 하위의 모든 노드를 순회하면서 `v-`접두사가 붙은 디렉티브 속성 또는 템플릿 문법 `{{ }}` 을 사용하고 있는 모든 텍스트를 검사합니다. 여기서 `DOM`을 순회하는게 아닌 `Node` 단위로 순회하는 이유는 템플릿을 파싱하기 위해 텍스트 노드까지 검사해야하기 때문입니다. <br />

노드 순회를 위해 순회하는 역할 자체는 `Visitor`에게 위임하고 노드마다 처리할 구체적인 액션은 `Scanner`에서 처리하도록 `Visitor`와 `Scanner`를 분리합니다.

```ts
const action = (node: Node) => {
  isReactiveNode(node) && new Observable(vm, node);
};
```
모든 노드를 순회하면서 해당 노드가 디렉티브를 갖거나 텍스트에 템플릿 문법을 가졌는지를 확인하고 `Observable` 생성합니다.  <br />

여기서 `Observable`은 단순히 `v-`접두사를 갖는 디렉티브인지 템플릿인지의 여부만 확인하여 `Directive`를 생성하고, 템플릿 바인딩은 `v-text` 디렉티브로 변경됩니다. 이때, 이벤트를 등록하는 `v-on`을 제외하고 모든 디렉티브는 디렉티브 종류에 따라서 `updater`를 인자로 받아서 `v-bind` 에서 일괄적으로 `Observer`를 생성합니다.


### 4. v-model 바인딩 

`Vue.js`의 `v-model` 디렉티브는 양방향 데이터 바인딩을 아주 간단하게 구현할 수 있게하는 디렉티브로 사용자 입력을 `vue` 인스턴스의 데이터와 자동으로 동기화합니다. 따라서 사용자의 입력을 받는 UI 요소들인 `input, textarea, select` 요소에서 사용됩니다. <br /> 

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

실제로 `v-model`은 위의 코드처럼 `v-bind`와 `v-on:event`의 조합으로 동일하게 동작하며 `vuelite` 에서도 이러한 두가지 방식을 모두 지원합니다. 

```html
<input type="checkbox" v-model="isChecked">

<input type="radio" name="gender" value="male" v-model="selectedOption">
<input type="radio" name="gender" value="female" v-model="selectedOption">

<select v-model="selectedRadio">
  <option value="javascript">javascript</option>
  <option value="python">python</option>
</select>
```
`v-model`을 구현할 때 문제는 각각의 요소마다 바인딩되는 값이 `value`, `checked` 등으로 다를 뿐더러 같은 `checked` 속성에 바인딩 하더라도 `checkbox`와 `radio` 버튼은 동작 방식이 다르고, 이벤트도 `change`, `input` 처럼 달라지기 때문에 요소의 값이나 상태를 통일된 방식으로 접근할 수 있게해서 일관되게 바인딩하게 해줄 필요가 있습니다. <br />

따라서 `Directive` 클래스에서 `v-model`을 처리할때는 이러한 요소들 또는 타입에 따라서 일관되게 사용할 수 있게 분기처리하여 `updater`와 이벤트리스너를 등록합니다. 



### 5. Observer 생성

```ts
bind(updater?: Updater) {
  // ... 
  const value = evaluateValue(this.vm, this.exp);
  updater && updater(this.node, value);
  new Observer(this.vm, this.exp, (value) => {
    updater && updater(this.node, value);
  });
```
디렉티브 종류에 따라서 `updater`가 정해지고 결과적으로 `Obserber`가 생성됩니다. 
여기서 `updater`란 `Reactive`가 주입된 속성에서 변화가 일어나 `set 트랩`에서 `notify`가 발생했을 때 해당 `dep`을 구독하고 있는 모든 `Observer`들에게 변화가 일어났음을 알리고 업데이트를 요청하는 구체적인 업데이트 함수를 의미합니다. 즉, `Observer`는 변화에 대응하여 `DOM`을 업데이트하고 따라서 `viewmodel`의 `data` 변화가 최종적으로 화면에 반영됩니다. <br /> 

위의 코드에서 `Observer`를 생성하기 전에 `updater`를 미리 한번 실행하는데 이건 첫 렌더링에 `viewmodel`의 속성을 `DOM`에 반영하기 위함입니다. 


#### Observer와 Dep의 관계 

서로가 서로를 컬렉션으로 관리하는 다대다의 관계를 갖습니다. <br />

`Dep`의 입장에서는 여러 개의 디렉티브에서 같은 속성을 사용할 수 있기 때문에 여러 `Observer`들을 관리하는 것이고, 반대로 하나의 디렉티브에서 여러 개의 반응형 데이터에 의존할 수 있기 때문에 `Observer`는 여러 `Dep`을 가질 수 있습니다.

>옵션에서 전달한 data 들은 모두 1:1로 매핑되는 Dep가 생성되고, 반대로 모든 디렉티브는 1:1로 매핑되는 Observer가 생성되어 그 둘이 상호작용 한다고 생각하면 됩니다. 


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
`Observer` 클래스에는 `getterTrigger` 메소드가 존재하는데 이 메소드의 역할은 단순히 `vm`에서 해당 속성을 가져오는 일을 하고 있어 보이지만, 이 함수는 그 이상으로 중요한 역할을 하고 있습니다. 

>1. 처음에 `Reactivty` 클래스에서 모든 `data` 속성에 래핑한 프록시 객체의 `get 트랩`을 의도적으로 발생시키 위해 사용됩니다. 
>2. `get 트랩`이 발생되기 이전에 `Dep.activated`를 현재의 `this` 즉, 현재의 `Observer`로 설정을 해놓고 `get 트랩`이 발생하면 `dep.depend()`를 호출하여 현재 활성화된 `Observer`와 `Dep`의 관계를 구축합니다. 
  
결과적으로 `getterTrigger`는 반응형 데이터의 `get 트랩`을 발생시켜서 `Dep` 객체를 생성하며, 값을 가져옴과 동시에 이렇게 만들어진 `Dep`객체가 `Observer`와의 관계를 맺어주는 중요한 역할을 합니다. 즉, `Obserber`는 `Dep`을 구독하여 기다리고 `Dep`은 `Obserber`에게 감시당하다가 `Dep`이 자신의 변화가 발생했을 때 구독자(Observer)들에게 변화를 통지하는 관계를 형성합니다.


### 6. 조건부 렌더링 `<1.4.3>`

<p align="center">
  <img src="./img/Animation2.gif" alt="Description of GIF" width="300" />
</p>

```html
<div>
  <input type="checkbox" v-model="visible" />
  <span>{{ visible ? "🔓" : "🔒" }}</span>

  <h1 v-if="visible">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>
```
```ts
new Vuelite({
  el: "#app",
  data() {
    return {
      visible: true,
    }
  },
})
```

#### 핵심 아이디어  

1) **v-show와 v-if의 차이** <br />
`v-show` 디렉티브는 요소의 가시성을 제어하기 때문에 단순히 값에 따라서 `display: none`의 여부를 결정해 주면 되지만, `v-if`는 매핑된 데이터가 `false`일 때 `DOM`에서 사라지고 `true`가 될 때 다시 `DOM`에 삽입됩니다. 즉, `v-show`는 항상 렌더링되고 값에 따라서 스타일만 변경해 주면 되기 때문에 기존의 디렉티브 처럼 처리할 수 있고 아주 단순한 반면, `v-if`는 조건부로 요소가 삭제되거나 삽입되야하는데 여기서 삭제하는 건 어렵지 않지만, 다시 삽입될 때 어떻게 이전의 위치를 기억하고 원래 자리에 삽입할지 고민해 봐야합니다. 

2) **v-if의 동작 흐름** <br />

>1. `v-if` 디렉티브가 적용된 요소 부모 요소의 `children` 속성을 통해 현재 자식이 몇 번째 인덱스 인지를 기억
>2. 조건이 `false`일때 현재 렌더링되는 `v-if` 속성을 가진 요소를 `fragment`로 이동하여 임시보관 
>3. 조건이 다시 `true`되면 부모로 부터 아까 구한 인덱스 위치 바로 이전에 `fragment`로 부터 다시 값을 가져와서 삽입
>4. `v-else` 디렉티브가 존재하면 `v-if`와 쌍을 이루고 이와 반대로 동작함 


3) **v-if의 렌더링 전략** <br />
`v-if`의 경우는 `DOM`에 직접적인 영향을 미치기 때문에 중간에 `DOM`의 구조를 변경하고 이로 인해 다른 디렉티브가 전부 파싱되기 전에 다른 디렉티브에 영향을 미칠 수 있었습니다. 그래서 `v-if` 디렉티브 처리를 미뤄놓고 모든 디렉티브를 처리한 후에 `lazy`하게 처리하도록 하였습니다.  또한 `v-if`는 기존의 `Directive`, `Observer`의 관계가 아닌 `Condition`이라는 인스턴스를 새로 생성합니다. 왜냐하면 매핑된 값이 `falsy`일때 `DOM`을 보관해야하며 `v-else` 구문에 대한 쌍을 이뤄야하기 때문에 다른 디렉티브와 다르게 추가적인 상태를 필요로 해서 분리했습니다. 

4) **제한사항** <br />
`v-else-if`와 `<template v-if>`는 지원하지 않으며, `v-else`는 반드시 `v-if` 바로 뒤에 와서 쌍을 이룰 때만 정상 동작합니다. 그 외의 경우엔 `v-else` 디렉티브가 무시됩니다. 



### 7. 리스트 렌더링 `<1.5.4>`

```html
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.message }}
  </li>
</ul>
```
```js
data() {
  return {
    items: [
      { id: 1, message: "Item 1" },
      { id: 2, message: "Item 2" },
      { id: 3, message: "Item 3" },
      { id: 4, message: "Item 4" },
    ],
  }
},
```
#### 핵심 아이디어  




1) **v-if와의 공통점과 차이점** <br />

2) **컨텍스트의 생성** <br />

```html
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.message }}
  </li>
</ul>

<!-- 이렇게 items 사이즈 만큼 반복하도록 바꿔보자 -->
<ul>
  <li :key="items[0].id">{{ items[0].message }}</li>
  <li :key="items[1].id">{{ items[1].message }}</li>
  <li :key="items[2].id">{{ items[2].message }}</li>
  <!--  ....  -->
</ul>
```

3) **새로운 스캔** <br />

4) **인덱스 계산 및 Key의 의미** <br />

5) **제한사항** <br />
:key 제공 x


### 8. 표현식 제공하기 

1) new Function, eval, with 
2) 디렉티브 (+ 이벤트)


### 9. 배열과 객체가 변화에 대응하기

배열의 추가 -> length의 변화감지
객체의 추가 -> 어쩔 수 없음 (강제 업데이트)
참조를 꺠면 그 이후로는 감지를 못함 따라서 값의 수정만 추적할뿐 교체하는 순간 엉망진창 
1) 사용되지않은 반응형 데이터 
2) 동적으로 추가된 데이터 
3) Store, forceUpdate 








## 📝 Todos
- [x] ~~***methods, computed 내부에서 this의 타입추론 및 자동완성 개선***~~ `<1.1.0>`
- [x] ~~***디렉티브 축약 형태 지원***~~ `<1.2.1>`
- [x] ~~***디렉티브와 템플릿에서 표현식 지원***~~ `<1.3.0>`
- [x] ~~***조건부 렌더링 추가 (v-if/else, v-show 디렉티브)***~~ `<1.4.3>`
- [x] ~~***리스트 렌더링 추가 (v-for 디렉티브)***~~ `<1.5.4>`
- [ ] created, mounted, updated 등의 라이프사이클 훅 지원 
- [ ] watch 지원
- [ ] 부분적으로 Composition API 지원 

## 📖 Reference
- [DMQ/mvvm](https://github.com/DMQ/mvvm)
- [bowencool/bue](https://github.com/bowencool/bue)

