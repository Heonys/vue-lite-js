

## 1. v-if ✅

```html
<div v-if="inputValue === '30'">{{ "Correct 😄" }}</div>
<div v-else> {{ "10 + 20 = " }}</div>
<input type="text" v-model="inputValue">
```

## 2. v-show ✅
```html
<input type="checkbox" v-model="visible" />
<span>{{ visible ? "🔓🔓" : "🔒🔒" }}</span>
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


## 3. 중첩 사용 

#### v-if + v-if ✅
```html
<div v-if="visible">
    <div v-for="(item, index) in items" :key="item.id">
        <div>{{ `${index} 번째 메시지 ${item.message}` }}</div>
    </div>
</div> 
```

#### v-if + v-for ❌
***else구문에서 v-for쓰면 버그생김***
```html
<input type="checkbox" v-model="visible"> 
<div v-if="visible">visible</div> 
<div v-else>
    <div v-for="(item, index) in items" :key="item.id">
        <div>{{ `${index} 번째 메시지 ${item.message}` }}</div>
    </div>
</div>
```

#### v-for + v-for ✅
```html
<li v-for="(item, index) in items">
    <div v-for="childItem in item.children">{{ childItem.message }}</div>
</li>
```

#### v-for + v-if  ✅
```html
<div v-for="(item, index) in items" :key="item.id">
    <div v-if="visible">{{ "Correct 😄" }}</div>   
</div>
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
<p>{{ age + 5 }}</p> <!-- 산술 연산 -->
<p>{{ isAdult ? 'Adult' : 'Minor' }}</p> <!-- 삼항 연산자 -->
<p>{{ `Welcome, ${name}` }}</p> <!-- 템플릿 리터럴 -->
<p>{{ items[0] }}</p> <!-- 인덱스 접근 -->
```


## 디렉티브

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



#### v-bind ✅
```html
<input type="text" v-bind:value="value">
<input type="checkbox" :checked="isChecked">
<div :custom="value"></div>
```

#### v-model (input, textarea, select) ✅

```html 
<input type="text" v-model="title">
<div>{{ title }}</div>

<label>
    male<input type="radio" value="male" v-model="selectedValue">
</label>
<label>
    female<input type="radio" value="female" v-model="selectedValue">
</label>
<div>{{ selectedValue }}</div>

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
<button @click="increase">+</button>
```

## 템플릿 문법 

#### 여러개의 템플릿 사용 가능하며 일반 텍스트랑 같이 사용가능 ✅
```html
<div>first: {{ firstName }}, last: {{ lastName }} </div>
<div>{{ checked ? "체크o" : "체크x" }} {{ 5 + 6 }}</div>
```

#### computed 및 methods 사용가능 ✅
```html
<div>{{ isChecked }}</div>
<div>{{ fullNameMethod() }}</div>
```






#### computed get, set 지원
#### template 옵션 지원
#### styles 옵션 지원 


