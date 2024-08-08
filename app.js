class Dep {
  subscribes = [];
  addSub(sub) {
    this.subscribes.push(sub);
  }
  notify() {
    this.subscribes.forEach((sub) => {
      sub.update();
    });
  }
}

var data = { name: "kindeng" };
observe(data);
data.name = "dmq"; // 값이 변경되었음을 감지합니다: kindeng --> dmq

function observe(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}

function defineReactive(data, key, val) {
  var dep = new Dep();
  observe(val); // 자식 속성을 관찰합니다.
  Object.defineProperty(data, key, {
    enumerable: true, // 열거 가능
    configurable: false, // 다시 정의 불가
    get: function () {
      return val;
    },
    set: function (newVal) {
      console.log("값이 변경되었습니다: ", val, " --> ", newVal);
      val = newVal;
      dep.notify();
    },
  });
}

class Compile {
  constructor(el) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el);
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }

  init() {
    this.compileElement(this.$fragment);
  }
  node2Fragment(el) {
    var fragment = document.createDocumentFragment(),
      child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  compileElement(el) {
    var childNodes = el.childNodes;
    var me = this;
    [].slice.call(childNodes).forEach(function (node) {
      var text = node.textContent;
      var reg = /\{\{(.*)\}\}/; // 表达式文本
      // 按元素节点方式编译
      if (me.isElementNode(node)) {
        me.compile(node);
      } else if (me.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1);
      }
      // 遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  }
}
