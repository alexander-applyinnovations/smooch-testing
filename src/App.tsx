import { FormEvent, useEffect, useRef, useState } from "react";

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
}

function App() {
  const iframeRef = useRef<IFrame>(null);
  useEffect(() => {
    const onMessageHandler = (event: MessageEvent) => {
      console.log(event.data);
      const data = event.data ? JSON.parse(event.data) : undefined;
      if (data?.event === "onError")
        // do something with data
        console.log(data);
    };
    window.addEventListener("message", onMessageHandler);
    return () => {
      window.removeEventListener("message", onMessageHandler);
    };
  }, [iframeRef]);
  const getContentWindow = () =>
    iframeRef.current?.contentWindow
  ;
  const [form, setForm] = useState<FormState>({
    jwtToken: "",
    integrationId: "",
    propertyCode: "",
    propertyName: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    setForm(Object.fromEntries(formData) as any as FormState);
  };

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit} className="form">
        <label>
          JWT Token: <input name="jwtToken" required />
        </label>
        <label>
          Integration ID: <input name="integrationId" required />
        </label>
        <label>
          Property Code: <input name="propertyCode" required />
        </label>
        <label>
          Property Name: <input name="propertyName" required />
        </label>
        <button type="submit">Submit</button>
      </form>
      <iframe
        // change the key to replace the element and trigger reload
        key={Object.values(form).join("")}
        title="web-embed"
        ref={iframeRef}
        onLoad={() => {
          if (form.jwtToken && form.integrationId && form.propertyCode && form.propertyName) {
            console.log(`Loaded... Initializing chat... \n${JSON.stringify(form, null, 2)}`)
            getContentWindow()?.chatInitialize(form);
            return
          }
          console.log("Loaded... Incomplete form data. Skipping initialization..")
        }}
        src={CHAT_URL}
      />
    </div>
  );
}

export default App;
