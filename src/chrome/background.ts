import { ChromeMessage, Message, Sender, Tab } from "../types";

let articleTabs: number[] = []
let currentTab = 0


chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab activated: ", articleTabs);
  currentTab = activeInfo.tabId
  if (articleTabs.find(value => value === activeInfo.tabId)) {
    chrome.browserAction.setBadgeBackgroundColor({color:[220,53,70,255]});
    chrome.browserAction.setBadgeText({text:" "});
  }
  else {
    chrome.browserAction.setBadgeText({text:""});
  }
})
chrome.tabs.onRemoved.addListener((tabId, tabInfo) => {
  articleTabs = articleTabs.filter((value) => tabId !== value)
  console.log("Tab removed: ", tabId, tabInfo);
})



const onUpdatedListener = (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  if (changeInfo && changeInfo.status) {
    const payload = {
      status: changeInfo.status,
    };
    console.log("Sending status update: ", payload);
    if (changeInfo.status === "loading" && articleTabs.find(value => value === tabId)) {
      articleTabs = articleTabs.filter((value) => tabId !== value)
      // chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      //   console.log("Tab loading: ", tabs[0].id, tabs[0].url);
        
      //   if (tabs[0].id === tabId) {
      //     chrome.browserAction.setBadgeText({text:" "});
      //   }
      // });
    }
    if (changeInfo.status === "complete") {
      articleTabs = articleTabs.filter((value) => tab.id !== value)
      chrome.browserAction.setBadgeText({text:""})
    }
    const message: ChromeMessage = {
      from: Sender.Background,
      message: Message.STATUS_UPDATE,
      tab: { url: tab.url, id: tabId },
      payload,
    };
    chrome.tabs.sendMessage(tabId, message);
  }
};
chrome.tabs.onUpdated.addListener(onUpdatedListener);


const requestQuiz = async (tab: Tab) => {
  // const requestOptions = {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json",
  //     "x-hasura-admin-secret": "secret",
  //   },
  //   body: {article_url: '...'}.toString(),
  // };
  // const database_url = "https://voon-demo.herokuapp.com/v1/graphql";
  // const res = await fetch(database_url, requestOptions).then((res: any) =>
  //   res.json()
  // );

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = {quizLink: 'https://chakra-ui.com/docs/form/button'}

  const message: ChromeMessage = {
    from: Sender.Background,
    message: Message.QUIZ_LINK,
    tab: { url: tab.url, id: tab.id },
    payload: {quizLink: res.quizLink},
  };
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, message);
  }


  return res;
}

const onMessageListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender
) => {
  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.Content &&
    message.message === Message.IS_ARTICLE
  ) {
    console.log("Article tab: ", sender);
    if (sender && sender.tab && sender.tab.id && sender.tab.url) {
      articleTabs.push(sender.tab.id)
      chrome.browserAction.setBadgeBackgroundColor({color:[220,53,70,255]});
      chrome.browserAction.setBadgeText({text:" "});
      requestQuiz({url: sender.tab.url, id: sender.tab.id})
    }
  }
  // if (
  //   sender.id === chrome.runtime.id &&
  //   (message.from === Sender.React || message.from === Sender.Content) &&
  //   message.message === Message.REQUEST_FILESNIPPET
  // ) {
  //   console.log("Sending file snippet to tab as requested by React");
  //   if (message.tab && message.tab.id && message.tab.url) {
  //     sendFileSnippetIfAvailable(message.tab.id, message.tab.url);
  //   }
  // }
};
chrome.runtime.onMessage.addListener(onMessageListener);