import Element, {val} from "./utils/getElement.js";
import {append, createElement, Events} from "./utils/createElement.js";
import {createStore, getState, subscribe, update} from "./store.js";

const root = Element.byId("root")

const COMMENT_STORE = "comments"

function commentForm() {
  const addComment = (e) => {
    const comment = {
      id: Symbol(),
      text: val(textInput)
    }
    update(COMMENT_STORE, prev => [...prev, comment])
    textInput.value = ""
    e.preventDefault();
  }
  const textInput = createElement("textarea", {className: "comment-input", placeholder: "Add your comment here...", required: true})
  const submit = createElement("button", {children: "Submit", type: "submit", className: "button"})
  const form = createElement("form", {className: "comment-form"}, {[Events.SUBMIT]: addComment})

  return append(form, textInput, submit)
}

function iconButton(icon, props, events) {
  const i = createElement("i", {className: `fa fa-${icon}`})
  const btn = createElement("button", props, events)
  return append(btn, i)
}

function commentBox({id, text}, handleDelete) {
  const commentText = createElement("p", {className: "comment-text", innerHTML: text})
  const del = iconButton("trash", {className: "delete-button"}, {[Events.CLICK]: () => handleDelete(id)})

  const commentContainer = createElement("div", {className: "comment"})

  return append(commentContainer, commentText, del)
}

function commentList() {
  function handleDelete(commentId) {
    update(COMMENT_STORE, comments => comments.filter(({id}) => id !== commentId))
  }

  const list = comments => comments.map(comment => commentBox(comment, handleDelete));

  const wrapper = createElement("div", {id: "comments", className: "comments"})

  function render(comments) {
    // cleanup
    wrapper.innerHTML = ""

    if (!comments.length) {
      return append(wrapper, createElement("p", {children: "No comments yet"}))
    }

    return list(comments).forEach(l => wrapper.appendChild(l))
  }

  subscribe(COMMENT_STORE, render)

  return render([])
}

createStore(COMMENT_STORE, [])
append(root, commentForm(), commentList())