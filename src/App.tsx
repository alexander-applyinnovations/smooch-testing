import { useCallback, useEffect, useRef } from "react";
import Smooch from "smooch";

let smoochInitializing = false;

function App() {
  const chatContainerRef = useRef(null);
  const initializeSmooch = useCallback(async () => {
    Smooch?.destroy();
    Smooch.init({
      integrationId: "62e773a2c7530e00f07e182f",
      embedded: true,
      fixedHeader: true,
      delegate: {
        beforeSend(message, data) {
          return {
            ...message,
            metadata: {
              property_name: "Calile Hotel",
              short_property_code: "CH001",
            },
          };
        },
      },
    });
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
    <div
      ref={chatContainerRef}
      style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}
    />
  );
}

export default App;
