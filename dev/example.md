## 디렉티브

#### 1. v-bind ✅

```html
<input type="text" v-bind:value="title" />
<input type="checkbox" :checked="isChecked" />
<div :custom="value"></div>
```

#### 2. v-model (input, textarea, select) ✅

```html
<input type="text" v-model="title" />
<div>{{ title }}</div>

<input type="checkbox" v-model="visible" />
<span>{{ visible ? "🔓" : "🔒" }}</span>

<label> male<input type="radio" value="male" v-model="selectedValue" /> </label>
<label> female<input type="radio" value="female" v-model="selectedValue" /> </label>
<div>{{ selectedValue }}</div>

<textarea v-model="title"></textarea>

<select v-model="selectedOption">
  <option value="React">React</option>
  <option value="Vue">Vue</option>
  <option value="Angular">Angular</option>
</select>
<div>{{ selectedOption }}</div>
```

#### 그외 디렉티브 ✅

```html
<div v-text="text"></div>
<div v-html="world"></div>
<div v-class="classData"></div>
<div v-style="textStyle"></div>
<button v-on:click="increase">+</button>
```

#### 디렉티브 축약 표현 ✅

```html
<input v-bind:value="title" v-bind:style="textStyle" v-on:input="handleInput" />
<!-- 동일한 표현 -->
<input :value="title" :style="textStyle" @input="handleInput" />
```

## 인라인 포맷 바인딩 지원

#### 클래스 바인딩 ✅

```html
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
<div :class="classData"></div>
```

#### 스타일 바인딩 ✅

```html
<div :style="{ 'font-size': fontSize + 'px', backgroundColor: '#FF0000' }"></div>
<div :style="textStyle"></div>
```

#### 객체 바인딩 ✅

```html
<div v-bind="{ id: 'testId', class: 'tesdtClass', customKey: 'customValue' }"></div>
<div v-bind="objectBind"></div>
```

## 템플릿 문법

#### 여러개의 템플릿 사용 가능하며 일반 텍스트랑 같이 사용가능 ✅

```html
<div>first: {{ firstName }}, last: {{ lastName }}</div>
<div>{{ checked ? "체크o" : "체크x" }} {{ 5 + 6 }}</div>
```

#### computed 및 methods 사용가능 ✅

```html
<div>{{ isChecked }}</div>
<div>{{ fullNameMethod() }}</div>
```

## 표현식 지원

#### 디렉티브 ✅

```html
<div v-show="visible && hasPermission">Visible</div>
<div v-if="count > 5">Count is greater than 5</div>
<input v-bind:disabled="isDisabled ? true : false" />
<button @click="visible = !visible">click</button>
```

#### 템플릿 내부 ✅

```html
<!-- 산술 연산 -->
<p>{{ age + 5 }}</p>
<!-- 삼항 연산자 -->
<p>{{ isAdult ? 'Adult' : 'Minor' }}</p>
<!-- 템플릿 리터럴 -->
<p>{{ `Welcome, ${name}` }}</p>
<!-- 인덱스 접근 -->
<p>{{ items[0] }}</p>
```

## computed getter, setter 지원 ✅

```js
computed: {
  fullName: {
    get() {
        return this.firstName + " + " + this.lastName;
    },
    set(newValue) {
        [this.firstName, this.lastName] = newValue.split(" ");
    },
  }
}
```

## 1. v-if ✅

```html
<div v-if="inputValue === '30'">{{ "Correct 😄" }}</div>
<div v-else>{{ "10 + 20 = " }}</div>
<input type="text" v-model="inputValue" />
```

## 2. v-show ✅

```html
<input type="checkbox" v-model="visible" />
<span>{{ visible ? "🔓" : "🔒" }}</span>
<div v-show="visible">{{ "👻" }}</div>
```

## 3. v-for

#### v-for (object) ✅

```html
<div v-for="(value, key, index) in myObject" :key="index">
  <div>{{ `${index} 번째 값 ${value}` }}</div>
</div>
```

#### v-for (array) ✅

```html
<div v-for="(item, index) in items" :key="item.id">
  <div>{{ `${index} 번째 메시지 ${item.message}` }}</div>
</div>
```

#### v-for (number) ✅

```html
<div v-for="(value, index) in 10">
  <div>{{ value }}</div>
</div>
```

#### v-for (그외 케이스) ✅

```html
<!-- 별칭 사용안하는 케이스 -->
<div v-for="item in items">{{ item.message }}</div>
<!-- for...of도 지원 -->
<div v-for="item of items">{{ item.message }}</div>
```

## 3. 중첩 사용

#### v-if > v-if ✅

```html
<div v-if="visible">
  <div v-if="visible2">😀</div>
  <div v-else>😎</div>
</div>
```

#### v-if > v-for ✅

```html
<input type="checkbox" v-model="visible" />
<div v-if="visible">visible</div>
<div v-else>
  <div v-for="(item, index) in items" :key="item.id">
    <div>{{ `${index} 번째 메시지 ${item.message}` }}</div>
  </div>
</div>
```

#### v-for > v-for ✅

```html
<li v-for="(item, index) in items">
  <div v-for="childItem in item.children">{{ childItem.message }}</div>
</li>
```

#### v-for > v-if ✅

```html
<div v-for="(item, index) in items" :key="item.id">
  <div v-if="visible">{{ "Correct 😄" }}</div>
</div>
```

## styles 및 scopedStyles 옵션 지원 ✅

```js
styles: {
    "#wrapper": {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
},
```

## 데이터 변화에 대응하기 ❌

```js

```

## Lifecycle Hooks 지원 ✅

```ts
type HookNames = "beforeCreate" | "created" | "mounted" | "beforeUpdate" | "updated";
```

## 컴포넌트 단위 개발

#### 로컬 컴포넌트 ✅

```html
<div id="app">
  <vue-child></vue-child>
</div>

<template id="child">
  <div>{{ message }}</div>
</template>

<script>
  new Vuelite({
    el: "#app",
    components: {
      "vue-child": {
        el: "#child",
        data() {
          return {
            message: "local message",
          };
        },
      },
    },
  });
</script>
```

#### 전역 컴포넌트 ✅

```html
<div id="app">
  <vue-global></vue-global>
</div>

<template id="global">
  <div>{{ message }}</div>
</template>

<script>
  Vuelite.component("vue-global", {
    el: "#global",
    data() {
      return {
        message: "local message",
      };
    },
  });

  new Vuelite({
    el: "#app",
  });
</script>
```

#### props 사용 ✅

```html
<div id="app">
  <vue-child :propsmessage="firstName"></vue-child>
</div>

<template id="child">
  <div>{{ message }}</div>
  <div>{{ propsmessage }}</div>
</template>

<script>
  new Vuelite({
    el: "#app",
    components: {
      "vue-child": {
        el: "#child",
        props: ["propsmessage"],
        data() {
          return {
            message: "local message",
          };
        },
      },
    },
    data() {
      return {
        firstName: "jiheon",
      };
    },
  });
</script>
```

#### 독립적인 인스턴스 여부 확인 ✅

```html
<div id="app">
  <vue-child :propsmessage="firstName"></vue-child>
  <vue-child :propsmessage="lastName"></vue-child>
</div>
```
