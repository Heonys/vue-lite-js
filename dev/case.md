

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





