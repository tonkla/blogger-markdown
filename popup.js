'use strict'

const elfont = document.getElementById('elfont')
const eltextcss = document.getElementById('eltextcss')
const ellayoutcss = document.getElementById('ellayoutcss')
const elsync = document.getElementById('elsync')
const elsave = document.getElementById('elsave')
const btnsave = document.getElementById('btnsave')
const btnreset = document.getElementById('btnreset')

const vfont = 'Sarabun:400'
const vtextcss =
  'font-size: 1.38em; line-height: 1.68em; letter-spacing: 0.015em; color: #333;'
const vlayoutcss =
  'width: 100%; border: none; padding: 50px 100px; background-color: #fff;'
const vsync = 1500
const vsave = 3000

chrome.storage.sync.get('settings', ({ settings: s }) => {
  if (s) {
    elfont.value = s.vfont || vfont
    eltextcss.value = s.vtextcss || vtextcss
    ellayoutcss.value = s.vlayoutcss || vlayoutcss
    elsync.value = s.vsync || vsync
    elsave.value = s.vsave || vsave
  } else {
    elfont.value = vfont
    eltextcss.value = vtextcss
    ellayoutcss.value = vlayoutcss
    elsync.value = vsync
    elsave.value = vsave
  }
})

btnsave.addEventListener('click', () => {
  chrome.storage.sync.set({
    settings: {
      vfont: elfont.value,
      vtextcss: eltextcss.value,
      vlayoutcss: ellayoutcss.value,
      vsync: elsync.value,
      vsave: elsave.value,
    },
  })
  window.close()
  chrome.tabs.reload()
})

btnreset.addEventListener('click', () => {
  elfont.value = vfont
  eltextcss.value = vtextcss
  ellayoutcss.value = vlayoutcss
  elsync.value = vsync
  elsave.value = vsave
})
