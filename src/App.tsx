import { ChangeEvent, useEffect, useState } from 'react';
import { WsProvider, ApiPromise } from '@polkadot/api';

import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";


const NAME = "GmOrDie";
type period = "MORNING | NIGHT | EVENING | AFTERNOON";


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





  useEffect(() => {
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
          {accounts.map((account) => <option value={account.address}>{account.address}</option>)}
        </select>
        </>) : null}

      {/**{accounts.length > 0 && selectedAccount ? selectedAccount.address : null} */}
      {selectedAccount ? <>{period}</> : null}
    </div>
  )
}

export default App
