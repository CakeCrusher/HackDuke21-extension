import {
  ChromeMessage,
  Sender,
  Message,
  FileSnippetOut,
  FrameDataOut,
  FileSnippet,
  LiveComment,
  LiveCommentOut,
  DataInFrameOut,
  Tab,
} from "../types";
import {
  BASE_STYLE,
  fileSnippetBtnStyle,
  SHOW,
  HIDDEN,
  codeSnippetRMStyle,
  codeSnippetLMStyle,
  redBoxStyle,
  greenBoxStyle,
} from "./style";

// // navigation
// let loadingURL = "";
// let completeURL = "";
// // fundimentals
// let screen: HTMLElement | null;
// let screenHeight: string | undefined;
// let screenWidth: string | undefined;
// let videoPlayer: HTMLElement | null;
// let overlayShowing: boolean | undefined;
// let htmlVideoPlayer: HTMLVideoElement | null;
// let currentTime: number | undefined;
// let duration: number | undefined;
// let redBox: HTMLElement | undefined;
// let greenBox: HTMLElement | undefined;
// // FileSnippet
// let fileSnippet: FileSnippetOut | undefined;
// let fileSnippetContainer: HTMLElement | undefined;
// let fileSnippetState: FileSnippet | undefined;
// let code: HTMLIFrameElement | undefined;
// // LiveComment
// let liveCommentsContainer: HTMLElement | undefined;
// let liveComments: LiveCommentOut[] | undefined;
// let liveCommentState: LiveComment | undefined;

// make a chrome.storage.onChanged function with typescript

// create a chrome extension listener for when storage changes

// Storage management
console.log("Content script running");


let tab: Tab | undefined;

const onStorageChange = async (changes: any) => {
  const keysChanged = Object.keys(changes);
  console.log("Storage change: ", changes);

  // if (keysChanged.includes("liveComment")) {
  //   liveCommentState = changes.liveComment.newValue;
  //   if (changes.liveComment.newValue && changes.liveComment.oldValue) {
  //     if (
  //       changes.liveComment.newValue.state !==
  //       changes.liveComment.oldValue.state
  //     ) {
  //       // when liveComment activation changes
  //       if (changes.liveComment.newValue.state) {
  //         initiateLiveCommentsContainer();
  //       }
  //       if (!changes.liveComment.newValue.state && liveCommentsContainer) {
  //         // when liveComment is deactivated
  //         liveCommentsContainer.remove();
  //         liveCommentsContainer = undefined;
  //       }
  //     }
  //     if (
  //       changes.liveComment.newValue.lowVisibility !==
  //       changes.liveComment.oldValue.lowVisibility
  //     ) {
  //       // when liveComment activation changes
  //       if (changes.liveComment.newValue.lowVisibility) {
  //         // when liveComment has low visibility
  //       } else {
  //         // when liveComment has normal visibility
  //       }
  //     }
  //   }
  // }
};
chrome.storage.onChanged.addListener(onStorageChange);

// Extension messaging

let articleMeta: Element | null;

const injectIframe = (toDocument: HTMLElement) => {
  const iframe = document.createElement("iframe");
  iframe.src = "https://www.w3schools.com";
  iframe.style.width = "100%";
  iframe.style.border = "none";
  iframe.style.margin = "20px 0px";
  iframe.id = "wisdom-quiz"
  if (toDocument) {
    toDocument.appendChild(iframe);
  }
}

const contentMessageListener = async (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender
) => {
  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.message === Message.NAVIGATE_TO_QUIZ
  ) {
    // scroll to the element with id wisdom-quiz
    console.log("scrolling to quiz");
    
    const wisdomQuiz = document.getElementById("wisdom-quiz");
    if (wisdomQuiz) {
      wisdomQuiz.scrollIntoView();
    }
  }
  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.Background &&
    message.message === Message.QUIZ_LINK
  ) {
    if (articleMeta) {
      console.log('Inject iframe');
      let firstTitle
      document.querySelectorAll("h1")[0] ? firstTitle = document.querySelectorAll("h1")[0] : firstTitle = document.querySelectorAll("h2")[0]
      injectIframe(firstTitle);
    }
  }
  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.Background &&
    message.message === Message.STATUS_UPDATE
  ) {
    if (
      message.payload.status === "complete" &&
      message.tab
    ) {
      // initiate the scripts
      console.log("Complete: ", message);
      tab = message.tab;
      // get the document body and make it red
      articleMeta = document.querySelector("meta[content=\"article\"]");
      if (articleMeta) {
        console.log("Article meta found");
        const messageToSend: ChromeMessage = {
          from: Sender.Content,
          message: Message.IS_ARTICLE,
          tab: { id: message.tab.id, url: message.payload.url },
        };
        chrome.runtime.sendMessage(messageToSend);

      }
    }


  }
  // if (
  //   sender.id === chrome.runtime.id &&
  //   message.from === Sender.Background &&
  //   message.message === Message.STATUS_UPDATE
  // ) {
  //   if (
  //     message.payload.status === "loading" &&
  //     message.payload.url !== loadingURL &&
  //     message.tab
  //   ) {
  //     // because on the first load the content is not ready the loadingURL is '' and so on the first navigation
  //     console.log("Status feed indicates navigation. Running reset");

  //     // loadingURL = message.payload.url
  //     resetContent();
  //   }
  //   if (
  //     message.payload.status === "complete" &&
  //     message.payload.url !== completeURL &&
  //     message.tab
  //   ) {
  //     console.log("Status feed indicates navigation. Running initiation");
  //     // HOTFIX: loadingURL should be changed only when status = loading
  //     loadingURL = message.payload.url;
  //     completeURL = message.payload.url;
  //     // send a message to the background for a RESET_CONTENT
  //     const messageToSend: ChromeMessage = {
  //       from: Sender.Content,
  //       message: Message.INITIATE_ENVIRONMENT,
  //       tab: { id: message.tab.id, url: message.payload.url },
  //     };
  //     chrome.runtime.sendMessage(messageToSend);
  //   }
  // }
};
chrome.runtime.onMessage.addListener(contentMessageListener);
