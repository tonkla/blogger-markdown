'use strict'

const elfont = document.getElementById('elfont')
const elcss = document.getElementById('elcss')
const elsync = document.getElementById('elsync')
const elsave = document.getElementById('elsave')
const btnsave = document.getElementById('btnsave')

const vfont = 'Sarabun:400'
const vcss =
  'padding: 50px 100px; background-color: #fff; font-size: 1.38em; line-height: 1.65em; letter-spacing: 0.015em; color: #333;'
const vsync = 1000
const vsave = 2000

chrome.storage.sync.get('settings', ({ settings }) => {
  elfont.value = settings ? settings.vfont : vfont
  elcss.value = settings ? settings.vcss : vcss
  elsync.value = settings ? settings.vsync : vsync
  elsave.value = settings ? settings.vsave : vsave
})

btnsave.addEventListener('click', () => {
  chrome.storage.sync.set({
    settings: {
      vfont: elfont.value,
      vcss: elcss.value,
      vsync: elsync.value,
      vsave: elsave.value,
    },
  })
  window.close()
})
