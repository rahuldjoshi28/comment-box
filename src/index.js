import Element, {val} from "./utils/getElement.js";
import {append, createElement, Events} from "./utils/createElement.js";
import {createStore, getState, subscribe, update} from "./store.js";

const root = Element.byId("root")

const COMMENT_STORE = "comments"

function commentForm() {
  const addComment = (e) => {
    update(COMMENT_STORE, prev => [...prev, val(textInput)])
    textInput.value = ""
    e.preventDefault();
  }
  const textInput = createElement("textarea", {className: "comment-input", placeholder: "Add your comment here..."})
  const submit = createElement("button", {children: "Submit", type: "submit", className: "button"})
  const form = createElement("form", {className: "comment-form"}, {[Events.SUBMIT]: addComment})

  return append(form, textInput, submit)
}

function comment(text) {
  return createElement("p", {className: "comment", innerHTML: text})
}

function commentList() {
  const list = comments => comments.map(commentText => comment(commentText));

  const wrapper = createElement("div", {id: "comments", className: "comments"})

  function rerender(comments) {
    wrapper.innerHTML = ""
    list(comments).forEach(l => wrapper.appendChild(l))
  }

  subscribe(COMMENT_STORE, rerender)

  return append(wrapper, createElement("p", {children: "No comments yet"}))
}

createStore(COMMENT_STORE, [])
append(root, commentForm(), commentList())