import Element, {val} from "./utils/getElement.js";
import {append, createElement, Events} from "./utils/createElement.js";
import {createStore, getState, subscribe, update} from "./store.js";

const root = Element.byId("root")

const COMMENT_STORE = "comments"

function commentForm(onSubmit, props = {}) {
  const addComment = (e) => {
    const comment = {
      id: Symbol(),
      text: val(textInput),
      replies: []
    }
    onSubmit(comment)
    textInput.value = ""
    e.preventDefault();
  }
  const textInput = createElement("textarea", {
    className: "comment-input",
    placeholder: "Add your comment here...",
    required: true
  })
  const submit = createElement("button", {children: "Submit", type: "submit", className: "button"})
  const form = createElement("form", {
    ...props,
    className: "comment-form " + props.className
  }, {[Events.SUBMIT]: addComment})

  return append(form, textInput, submit)
}

function iconButton(icon, props, events) {
  const i = createElement("i", {className: `fa fa-${icon}`})
  const btn = createElement("button", props, events)
  return append(btn, i)
}

function add(allComments, comment, trail) {
  let newState = [...allComments]
  let itr = newState
  trail.forEach((_id, index) => {
    newState = newState.find(({id}) => id === _id)
    if (trail.length - 1 !== index) {
      newState = newState.replies
    }
  })
  newState?.replies.push(comment)
  return itr
}

function commentBox({id, text, replies}, handleDelete, trail) {
  const openReplyInput = () => {
    const replyPanel = commentForm((comment) => {
      update(COMMENT_STORE, comments => add(comments, comment, [...trail, id]))
    }, {className: "reply-box"})
    append(commentContainer, replyPanel)
  }

  const commentText = createElement("p", {className: "comment-text", innerHTML: text})
  const del = iconButton("trash", {className: "delete-button comment-action"}, {[Events.CLICK]: () => handleDelete(id)})
  const replyButton = iconButton("reply", {className: "comment-action reply-button"}, {[Events.CLICK]: () => openReplyInput()})

  const commentContainer = createElement("div", {className: "comment"})

  const replyList = replies?.map(comment => commentBox(comment, handleDelete, [id]));
  const replyComponent = createElement("div", {id: "replies"})

  return append(commentContainer, commentText, replyButton, del, append(replyComponent, replyList))
}

function commentList() {
  function handleDelete(commentId) {
    update(COMMENT_STORE, comments => comments.filter(({id}) => id !== commentId))
  }

  const list = comments => comments.map(comment => commentBox(comment, handleDelete, []));

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

const onComment = comment => update(COMMENT_STORE, prev => [...prev, comment])

append(root, commentForm(onComment), commentList())