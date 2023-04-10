import { useEffect, useState } from 'react';
import { WsProvider, ApiPromise } from '@polkadot/api';

const App = () => {
  const [api, setApi] = useState<ApiPromise>();

  const setup = async () => { 
    const wsProvider = new WsProvider("wss://ws.gm.bldnodes.org/");
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);
    console.log(api);
  }

  useEffect(() => {
    setup();
  }, []);
  

  useEffect(() => {
    if (!api) return;

    (
      async () => {
        const time = await api.query.timestamp.now();
        // console.log(time.toPrimitive())
      }
    )();
   }, [api]);

  return (
    <div>
      Dapp
    </div>
  )
}

export default App
