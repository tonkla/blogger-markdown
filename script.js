'use strict'

let btnCompose
let btnHtml
let btnMarkdown
let btnSave
let editorComposeW
let editorHtml
let editorHtmlW
let editorMarkdown
let editorMarkdownW
let toolbar

const options = {
  noHeaderId: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  emoji: true,
}
const converter = new showdown.Converter(options)
converter.setFlavor('github')

const debounce = (a, b = 250, c) => (...d) =>
  clearTimeout(c, (c = setTimeout(a, b, ...d)))

const savePost = debounce(() => {
  if (btnSave && btnSave.innerText === 'Save') {
    const event = document.createEvent('MouseEvents')
    event.initEvent('click', true, false)
    btnSave.dispatchEvent(event)
  }
}, 2000)

const handleMarkdownChanged = debounce(() => {
  editorHtml.value = converter.makeHtml(editorMarkdown.value)
  savePost()
}, 1000)

const handleHtmlChanged = debounce(() => {
  editorMarkdown.value = converter.makeMarkdown(editorHtml.value)
  savePost()
}, 1000)

function setElementRefs() {
  btnCompose = document.querySelectorAll('span.tabs span button')[0]
  btnHtml = document.querySelectorAll('span.tabs span button')[1]
  btnSave = document.querySelectorAll('form button.blogg-button')[2]
  editorComposeW = document.querySelector('div.composeBoxWrapper')
  editorHtmlW = document.querySelector('div.htmlBoxWrapper')
  editorHtml = document.querySelector('#postingHtmlBox')
  toolbar = document.querySelector('span.tabs').nextElementSibling
}

function resetElementsBehavior() {
  btnCompose.classList.remove('selected')

  btnHtml.classList.add('blogg-collapse-right')
  btnHtml.classList.remove('selected')

  editorComposeW.style.display = 'none'
  editorHtmlW.style.display = 'none'

  toolbar.parentNode.style.display = 'flex'
  toolbar.style.display = 'none'

  btnCompose.addEventListener('click', e => {
    btnHtml.classList.remove('selected')
    btnMarkdown.classList.remove('selected')
    btnCompose.classList.add('selected')

    toolbar.style.display = 'flex'

    editorComposeW.style.display = ''
    editorHtmlW.style.display = 'none'
    editorMarkdownW.style.display = 'none'
  })

  btnHtml.addEventListener('click', e => {
    btnCompose.classList.remove('selected')
    btnMarkdown.classList.remove('selected')
    btnHtml.classList.add('selected')

    toolbar.style.display = 'flex'

    editorHtmlW.style.display = ''
    editorComposeW.style.display = 'none'
    editorMarkdownW.style.display = 'none'
  })

  btnMarkdown.addEventListener('click', e => {
    e.preventDefault()

    btnCompose.classList.remove('selected')
    btnHtml.classList.remove('selected')
    btnMarkdown.classList.add('selected')

    toolbar.style.display = 'none'

    editorMarkdownW.style.display = 'flex'
    editorComposeW.style.display = 'none'
    editorHtmlW.style.display = 'none'
  })
}

function createMarkdownButton() {
  const btn = document.createElement('button')
  btn.className = 'blogg-button blogg-collapse-left btn-markdown selected'
  btn.innerText = 'Markdown'

  btnHtml.insertAdjacentHTML('afterend', btn.outerHTML)

  btnMarkdown = document.querySelectorAll('span.tabs span button')[2]
}

function createMarkdownEditor() {
  const ed = document.createElement('div')
  ed.className = 'markdownBoxWrapper'
  Object.assign(ed.style, {
    display: 'flex',
    height: '70vh',
    margin: '10px',
    flex: 1,
  })

  editorComposeW.insertAdjacentHTML('afterend', ed.outerHTML)

  const et = document.createElement('textarea')
  et.innerText = ''
  Object.assign(et.style, {
    width: '100%',
    padding: '50px 100px',
    border: 'none',
    color: '#333',
    fontFamily: 'Sarabun',
    fontSize: '18px',
    lineHeight: '1.65em',
    letterSpacing: '0.015em',
  })

  editorMarkdownW = document.querySelector('div.markdownBoxWrapper')
  editorMarkdownW.appendChild(et)

  editorMarkdown = document.querySelector('div.markdownBoxWrapper textarea')
  editorMarkdown.addEventListener('focus', e => {
    e.target.style.outline = 'none'
    btnCompose.classList.remove('selected')
    btnHtml.classList.remove('selected')
  })

  editorMarkdown.addEventListener('keyup', handleMarkdownChanged, false)
  editorHtml.addEventListener('keyup', handleHtmlChanged, false)
}

function initMarkdownText() {
  const callback = (mRecord, mObserver) => {
    const [
      {
        target: { value },
      },
    ] = mRecord
    editorMarkdownW.style.height = `${document.querySelector('.editorHolder')
      .offsetHeight - 30}px`
    editorMarkdown.value = converter.makeMarkdown(value)
    editorMarkdown.focus()
    editorMarkdown.selectionEnd = -1
  }
  const config = { attributes: true, childList: false, subtree: false }
  const observer = new MutationObserver(callback)
  observer.observe(editorHtml, config)
}

function start() {
  setElementRefs()
  createMarkdownButton()
  createMarkdownEditor()
  resetElementsBehavior()
  initMarkdownText()
}

;(function() {
  document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css?family=Sarabun:400&display=swap'
      document.head.prepend(link)

      const callback = (mRecord, mObserver) => {
        if (document.querySelector('#postingHtmlBox')) {
          start()
          mObserver.disconnect()
        }
      }
      const config = { attributes: false, childList: true, subtree: false }
      const observer = new MutationObserver(callback)
      observer.observe(document.body, config)
    }
  })
})()
