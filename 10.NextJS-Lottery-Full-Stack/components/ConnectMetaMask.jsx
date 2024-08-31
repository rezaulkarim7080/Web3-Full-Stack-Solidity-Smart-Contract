import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ConnectMetaMask = () => {
  const {
    account,
    enableWeb3,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  /////////// add  metamask data in localstorage after connect

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  /////// remove metamask data from localstorage after disconnect

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed ot ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);

  /////////////

  return (
    <div className="p-5">
      {account ? (
        <div className="text-xl font-semibold">
          Conected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}!
        </div>
      ) : (
        <div>
          <button
            onClick={async () => {
              await enableWeb3();
              if (typeof window !== "undefined") {
                window.localStorage.setItem("connected", "injected");
              }
            }}
            className="bg-orange-400 p-2 text-center rounded-md"
          >
            Connect
          </button>
        </div>
      )}

      {/* <h1>Welcome {enableWeb3.get("username")}</h1> */}
    </div>
  );
};

export default ConnectMetaMask;
