/*
Thanks:
- http://youmightnotneedjquery.com/
- https://gist.github.com/nmsdvid/8807205
- https://www.flaticon.com/free-icon/blogger_179312
*/

'use strict'

let onLoadTimer
let btnCompose
let btnHtml
let btnMarkdown
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

const handleTextChanged = debounce(() => {
  editorHtml.value = converter.makeHtml(editorMarkdown.value)
}, 1000)

function setElementRefs() {
  btnCompose = document.querySelectorAll('span.tabs span button')[0]
  btnHtml = document.querySelectorAll('span.tabs span button')[1]
  editorComposeW = document.querySelector('div.composeBoxWrapper')
  editorHtmlW = document.querySelector('div.htmlBoxWrapper')
  editorHtml = document.querySelector('#postingHtmlBox')
  toolbar = document.querySelector('span.tabs').nextElementSibling
}

function resetElementClasses() {
  btnCompose.classList.remove('selected')

  btnHtml.classList.add('blogg-collapse-right')
  btnHtml.classList.remove('selected')

  editorComposeW.style.display = 'none'
  editorHtmlW.style.display = 'none'

  toolbar.parentNode.style.display = 'flex'
  toolbar.style.display = 'none'
}

function resetElementEventListeners() {
  btnCompose.addEventListener('click', e => {
    btnHtml.classList.remove('selected')
    btnMarkdown.classList.remove('selected')
    btnCompose.classList.add('selected')

    toolbar.style.display = ''

    editorComposeW.style.display = ''
    editorHtmlW.style.display = 'none'
    editorMarkdownW.style.display = 'none'
  })

  btnHtml.addEventListener('click', e => {
    btnCompose.classList.remove('selected')
    btnMarkdown.classList.remove('selected')
    btnHtml.classList.add('selected')

    toolbar.style.display = ''

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

function createMdButton() {
  const btn = document.createElement('button')
  btn.className = 'blogg-button blogg-collapse-left btn-markdown selected'
  btn.innerText = 'Markdown'

  btnHtml.insertAdjacentHTML('afterend', btn.outerHTML)

  btnMarkdown = document.querySelectorAll('span.tabs span button')[2]
}

function createMdEditor() {
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

  editorMarkdown.addEventListener('keyup', handleTextChanged, false)
}

function initMdText() {
  const callback = (mRecord, mObserver) => {
    const [
      {
        target: { value },
      },
    ] = mRecord
    editorMarkdownW.style.height = `${document.querySelector('.editorHolder')
      .offsetHeight - 20}px`
    editorMarkdown.value = converter.makeMarkdown(value)
    editorMarkdown.focus()
  }
  const config = { attributes: true, childList: false, subtree: false }
  const observer = new MutationObserver(callback)
  observer.observe(editorHtml, config)
}

function start() {
  clearInterval(onLoadTimer)

  setElementRefs()
  createMdButton()
  createMdEditor()
  resetElementClasses()
  resetElementEventListeners()
  initMdText()
}

;(function() {
  document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css?family=Sarabun:400&display=swap'
      document.head.prepend(link)

      onLoadTimer = setInterval(() => {
        if (document.querySelector('span.tabs')) start()
      }, 100)
    }
  })
})()
