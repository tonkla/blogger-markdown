'use strict'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    settings: {
      vfont: 'Sarabun:400',
      vtextcss:
        'font-size: 1.38em; line-height: 1.68em; letter-spacing: 0.015em; color: #333;',
      vlayoutcss:
        'width: 100%; border: none; padding: 50px 100px; background-color: #fff;',
      vsync: 1500,
      vsave: 3000,
    },
  })

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: '(www|draft).blogger.com' },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ])
  })
})
