import React, { useCallback, useEffect, useRef } from "react";

import "./App.css";
import Smooch from "smooch";

let smoochInitializing = false;

function App() {
  const chatContainerRef = useRef(null);
  const initializeSmooch = useCallback(async () => {
    Smooch?.destroy();
    Smooch.init({
      integrationId: "62e773a2c7530e00f07e182f",
      customColors: {
        brandColor: "B88B5F",
        conversationColor: "B88B5F",
        actionColor: "B88B5F",
      },
      embedded: true,
      fixedHeader: true,
    }).then(() => {
      if (Smooch?.getConversations) {
        const conversations = Smooch?.getConversations();
        console.log("this is the conversations", conversations);
        if (conversations.length) {
          Smooch.updateConversation(conversations?.[0]?.id, {
            displayName: "Help Desk",
            iconUrl:
              "https://cdn.britannica.com/91/181391-050-1DA18304/cat-toes-paw-number-paws-tiger-tabby.jpg?q=60",
            description: "description",
          }).then((updatedConversation) => {
            // Your code after receiving the current user's updated conversation
          });
        } else {
          Smooch.createConversation({
            displayName: "Friday's Order",
            iconUrl: "https://www.zen-tacos.com/tacos.png",
            description: "Order #13377430",
            metadata: {
              isFirstTimeCustomer: true,
            },
          });
        }
      }
    });

    console.log("rendering");

    // @ts-ignore
    Smooch?.render(chatContainerRef.current);
  }, []);

  useEffect(() => {
    if (!smoochInitializing) {
      smoochInitializing = true;
      initializeSmooch();
    }
  }, [initializeSmooch]);
  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <div ref={chatContainerRef} className="chat-container" />
    </div>
  );
}

export default App;
