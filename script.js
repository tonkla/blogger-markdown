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
let syncDuration = 1500
let saveDuration = 3000

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

function loadGoogleFont(_font) {
  const font = _font.trim().replace(/\s+/g, '+')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css?family=${font}&display=swap`
  document.head.prepend(link)
}

function setElementRefs() {
  btnCompose = document.querySelectorAll('span.tabs button')[0]
  btnHtml = document.querySelectorAll('span.tabs button')[1]
  btnSave = document.querySelectorAll('form button.blogg-button')[2]
  editorComposeW = document.querySelector('div.composeBoxWrapper')
  editorHtmlW = document.querySelector('div.htmlBoxWrapper')
  editorHtml = document.querySelector('#postingHtmlBox')
  toolbar = document.querySelector('span.tabs').nextElementSibling
}

function createMarkdownButton() {
  const btn = document.createElement('button')
  btn.className = 'blogg-button blogg-collapse-left btn-markdown selected'
  btn.innerText = 'Markdown'

  btnHtml.insertAdjacentHTML('afterend', btn.outerHTML)

  btnMarkdown = document.querySelectorAll('span.tabs button')[2]
}

function createMarkdownEditor(settings) {
  const ed = document.createElement('div')
  ed.className = 'markdownBoxWrapper'
  Object.assign(ed.style, {
    display: 'flex',
    justifyContent: 'center',
    height: '70vh',
    margin: '10px',
    flex: 1,
  })

  editorComposeW.insertAdjacentHTML('afterend', ed.outerHTML)

  const et = document.createElement('textarea')
  const f = settings.vfont.split(':')
  const fontFamily = f[0] || 'Sarabun'
  const fontWeight = f[1] || 400
  et.style.fontFamily = fontFamily.replace(/\+/g, ' ')
  et.style.fontWeight = fontWeight
  et.style.cssText += settings.vlayoutcss + ' ' + settings.vtextcss

  editorMarkdownW = document.querySelector('div.markdownBoxWrapper')
  editorMarkdownW.appendChild(et)

  editorMarkdown = document.querySelector('div.markdownBoxWrapper textarea')
  editorMarkdown.addEventListener('focus', e => {
    e.target.style.outline = 'none'
    btnCompose.classList.remove('selected')
    btnHtml.classList.remove('selected')
  })
}

function setDebouncedEvents() {
  const savePost = debounce(() => {
    if (btnSave && btnSave.innerText === 'Save') {
      const event = document.createEvent('MouseEvents')
      event.initEvent('click', true, false)
      btnSave.dispatchEvent(event)
    }
  }, saveDuration)

  const handleMarkdownChanged = debounce(() => {
    editorHtml.value = converter.makeHtml(editorMarkdown.value)
    savePost()
  }, syncDuration)

  const handleHtmlChanged = debounce(() => {
    editorMarkdown.value = converter.makeMarkdown(editorHtml.value)
    savePost()
  }, syncDuration)

  editorMarkdown.addEventListener('keyup', handleMarkdownChanged, false)
  editorHtml.addEventListener('keyup', handleHtmlChanged, false)
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

function initMarkdownText() {
  const callback = (mRecord, mObserver) => {
    const [
      {
        target: { value },
      },
    ] = mRecord
    editorMarkdownW.style.height = `${document.querySelector('.editorHolder')
      .offsetHeight - 50}px`
    editorMarkdown.value = converter.makeMarkdown(value)
    editorMarkdown.focus()
  }
  const config = { attributes: true, childList: false, subtree: false }
  const observer = new MutationObserver(callback)
  observer.observe(editorHtml, config)
}

function start() {
  chrome.storage.sync.get('settings', ({ settings: s }) => {
    if (!isNaN(parseInt(s.vsync))) syncDuration = parseInt(s.vsync)
    if (!isNaN(parseInt(s.vsave))) saveDuration = parseInt(s.vsave)

    loadGoogleFont(s.vfont)
    setElementRefs()
    createMarkdownButton()
    createMarkdownEditor(s)
    setDebouncedEvents()
    resetElementsBehavior()
    initMarkdownText()
  })
}

;(function() {
  document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
      const callback = (mRecord, mObserver) => {
        if (document.querySelector('#postingHtmlBox') && chrome.storage) {
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
