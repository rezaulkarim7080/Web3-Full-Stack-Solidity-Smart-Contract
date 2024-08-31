import React from "react";
import { ConnectButton, ENSAvatar } from "web3uikit";

const UsingWeb3UiKit = () => {
  return (
    <div className="mt-[100px] text-center">
      <h1>Decentralized Lottery </h1>
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default UsingWeb3UiKit;
