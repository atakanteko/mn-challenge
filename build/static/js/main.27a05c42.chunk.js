(this["webpackJsonpmodanisa-cha"]=this["webpackJsonpmodanisa-cha"]||[]).push([[0],{11:function(t,e,n){},67:function(t,e,n){"use strict";n.r(e);n(21),n(22);var c=n(2),a=n(20),s=n.n(a),i=(n(11),n(8)),o=n(0),d=function(t){var e=t.todo;return Object(o.jsx)("li",{children:e})},r=n(7),l=n.n(r),j="api/todos",u=function(){return l.a.get(j).then((function(t){return t.data}))},b=function(t){return l.a.post(j,t).then((function(t){return t.data}))},h=function(){var t=Object(c.useState)([]),e=Object(i.a)(t,2),n=e[0],a=e[1],s=Object(c.useState)("a new todo..."),r=Object(i.a)(s,2),l=r[0],j=r[1];Object(c.useEffect)((function(){u().then((function(t){a(t)}))}),[]);return Object(o.jsx)("div",{className:"page-content page-container",id:"page-content",children:Object(o.jsx)("div",{className:"padding",children:Object(o.jsx)("div",{className:"row container d-flex justify-content-center",children:Object(o.jsx)("div",{className:"col-md-12",children:Object(o.jsx)("div",{className:"card px-3",children:Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h4",{className:"card-title",children:"Moda Nisa Assignment - ToDo List"}),Object(o.jsx)("form",{onSubmit:function(t){t.preventDefault();var e={content:l,id:n.length+1};b(e).then((function(t){a(n.concat(t)),j("")}))},children:Object(o.jsxs)("div",{className:"add-items d-flex",children:[Object(o.jsx)("input",{type:"text",className:"form-control todo-list-input",onChange:function(t){j(t.target.value)},value:l}),Object(o.jsx)("button",{className:"add btn btn-primary font-weight-bold todo-list-add-btn",children:"Add"})]})}),Object(o.jsx)("div",{className:"list-wrapper",children:Object(o.jsx)("ul",{className:"d-flex flex-column-reverse todo-list",children:n.map((function(t){return Object(o.jsx)(d,{todo:t.content},t.id)}))})})]})})})})})})};s.a.render(Object(o.jsx)(h,{}),document.getElementById("root"))}},[[67,1,2]]]);
//# sourceMappingURL=main.27a05c42.chunk.js.map