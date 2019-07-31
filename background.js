chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    settings: {
      vfont: 'Sarabun:400',
      vcss:
        'padding: 50px 100px; background-color: #fff; font-size: 1.38em; line-height: 1.65em; letter-spacing: 0.015em; color: #333;',
      vsync: 1000,
      vsave: 2000,
    },
  })
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.blogger.com', schemes: ['https'] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ])
  })
})
