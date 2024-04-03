import { useEffect, useRef } from "react";

const CHAT_URL = "https://web.thecalile.app/chat/index.html";

type IFrame = HTMLIFrameElement & {
  contentWindow: HTMLIFrameElement["contentWindow"] & {
    chatInitialize: (params: {
      jwtToken: string;
      integrationId: string;
      propertyCode: string;
      propertyName: string;
    }) => void;
  };
};

type FormState = {
  jwtToken: string;
  integrationId: string;
  propertyCode: string;
  propertyName: string;
};

function tryJSONParse(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

function App() {
  const iframeRef = useRef<IFrame>(null);
  useEffect(() => {
    const onMessageHandler = (event: MessageEvent) => {
      const data = tryJSONParse(event.data);
      // ignore webpack events
      if (data.type?.startsWith?.('webpack'))
        return
      if (data?.event === "onError") {
        alert("An error occured, check the html console for detail");
        console.error(data)
      } else if (data) {
        console.debug(data)
      }
    };
    window.addEventListener("message", onMessageHandler);
    return () => {
      window.removeEventListener("message", onMessageHandler);
    };
  }, [iframeRef]);
  const getContentWindow = () => iframeRef.current?.contentWindow;
  const defaults = {
    jwtToken: "",
    integrationId: "65faae8fd5ff0e73f62ee73f",
    propertyCode: "CMITCBR",
    propertyName: "The Calile Hotel",
  };
  const params: FormState = Object.assign(
    defaults,
    Object.fromEntries(new URLSearchParams(window.location.search))
  );

  useEffect(() => {
    const proxiedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      CHAT_URL
    )}`;
    fetch(proxiedUrl)
      .then((response) => response.json())
      .then(({ contents }) => {
        const blob = new Blob([contents], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        if (iframeRef.current) {
          iframeRef.current.src = url;
        }
      });
  }, []);

  return (
    <div className="main-container">
      <form method="get" className="form">
        <label>
          <span>JWT Token:</span>{" "}
          <input name="jwtToken" defaultValue={params.jwtToken} required />
        </label>
        <label>
          <span>Integration ID:</span>{" "}
          <input
            name="integrationId"
            defaultValue={params.integrationId}
            required
          />
        </label>
        <label>
          <span>Property Code:</span>{" "}
          <input
            name="propertyCode"
            defaultValue={params.propertyCode}
            required
          />
        </label>
        <label>
          <span>Property Name:</span>{" "}
          <input
            name="propertyName"
            defaultValue={params.propertyName}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <iframe
        title="web-embed"
        ref={iframeRef}
        onLoad={() => {
          if (
            params.jwtToken &&
            params.integrationId &&
            params.propertyCode &&
            params.propertyName
          ) {
            console.debug(
              `Loaded... Initializing chat... \n${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            getContentWindow()?.chatInitialize(params);
            return;
          }
          console.debug(
            "Loaded... Incomplete form data. Skipping initialization.."
          );
        }}
      />
    </div>
  );
}

export default App;
