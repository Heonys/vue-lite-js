
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

## 🚀 개요 

## 🎯 목표

## 🎉 시작하기
```sh
npm install vue-lite-js 
```

> **Note**: GIF 추가 

```html
<div id="app">
    <input type="text" v-model="title">
    <div>{{ title }}</div>
    <button v-on:click="handleClick">change</button>
</div>
```
```ts
import Vuelite from "vue-lite-js";

new Vuelite({
  el: "#app",
  data() {
    title: "",
  },
  methods: {
    handleClick() {
      this.title = "change title";
    },
  }
})
```

## 🧩 다이어그램 

## 🔍 동작원리

## 📝 Todos
- [x] <del><em>템플릿 옵션 추가</em></del>
- [ ] 디렉티브 축약 형태 지원하기 
- [ ] v-for, v-if/else 디렉티브 추가하기 
- [ ] 템플릿에서 표현식 사용하기 (삼항연산자, 배열 인덱스접근, 메소드 사용 등...)
- [ ] watch 추가하기 
- [ ] created, mounted, updated 등의 훅 추가하기 
- [ ] 뷰모델 분리하기 (중첩될 수 있기 때문에 부모자식 관계를 유지)
- [ ] props, children 지원하기 
- [ ] 부분적으로 Composition API 지원하기 

## 📢 마무리

## 📖 Reference
- [DMQ](https://github.com/DMQ)
- [bue](https://github.com/bowencool/bue)

