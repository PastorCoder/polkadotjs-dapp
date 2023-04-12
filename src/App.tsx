import { ChangeEvent, useEffect, useState } from 'react';
import { WsProvider, ApiPromise } from '@polkadot/api';

import { web3Enable, web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import BN from "bn.js";


const NAME = "GmOrDie";
type period = "MORNING | NIGHT | MIDONE | MIDTWO";
const AMOUNT = new BN(10).mul(new BN(10).pow(new BN(10)))


const App = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>();
  const [period, setPeriod] = useState<period>()

  const setup = async () => {
    const wsProvider = new WsProvider("wss://ws.gm.bldnodes.org/");
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);
    // console.log(api);
  };


  const handleConnection = async () => {
    const extensions = await web3Enable(NAME);

    if (!extensions) {
      throw Error("No_EXTENSION_FOUND")
    };

    const allAccounts = await web3Accounts();

    console.log("All Connected Accounts is : ", extensions)

    

    if (allAccounts.length === 0) {
      setSelectedAccount(allAccounts[0]);
    }

    setAccounts(allAccounts);
  };


  const handleAccountSelection = async (e: ChangeEvent<HTMLSelectElement>) => { 
    const selectedAddress = e.target.value;

    const account = accounts.find((account) => account.address === selectedAddress);

    if (!account) {
      throw Error("NO_ACCOUNT_FOUND");
    }

    setSelectedAccount(account);
  };


  const handleBurn = async () => { 
    if (!api) return;

    if (!selectedAccount) return;

    const injector = await web3FromAddress(selectedAccount.address);

    await api.tx.currencies.burnFren(AMOUNT).signAndSend(selectedAccount.address, {
      signer: injector.signer
    }); //FREN : Unknown word
  };





  useEffect(() => {
    console.log(AMOUNT.toString());
    setup();
  }, []);
  

  useEffect(() => {
    if (!api) return;

    (
      async () => {
        const period = (await api.query.currencies.currentTimePeriod()).toPrimitive() as string;

        const parsedPeriod = period.toUpperCase() as period;
        setPeriod(parsedPeriod);
        console.log(period)
      }
    )();
    // (
    //   async () => {
    //     const time = await api.query.timestamp.now();
    //     console.log(time.toPrimitive())
    //   }
    // )();
   }, [api]);

  return (
    <div>
      {accounts.length === 0 ? <button onClick={handleConnection}>Connect</button> : null}

      {accounts.length > 0 && !selectedAccount ? (
        <>
          <select onChange={handleAccountSelection}>
            <option value="" disabled selected hidden>
              Choose your account
            </option>
          {accounts.map((account) => <option value={account.address}>{account.meta.name || account.address}</option>)}
        </select>
        </>) : null}

      {/**{accounts.length > 0 && selectedAccount ? selectedAccount.address : null} */}
      {selectedAccount ? <button onClick={handleBurn}>Burn 10 $FREN</button> : null}
    </div>
  )
}

export default App
