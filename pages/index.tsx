import { Provider } from 'react-redux';
import Home from '../components/Home';
import { store } from '@/app/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

async function fetcherFunc(...args: any[]) {
  const [url, queryData] = args;
  const res = await fetch(`${url}?id=${queryData}`);
  return res.json();
}

function App () {
  const router = useRouter().query;
  const [fileName, setFileName] = useState(router.id);
  const { data } = useSWR(['api/data', fileName], fetcherFunc);

  if(typeof data === 'object' && typeof fileName !== 'undefined' && data !== null){
    const tokens = JSON.parse(data.result.token);
    const theme = data.result.themeData;
  }

  useEffect(() => {
    setFileName(router.id);
  }, [router]);
  return (
    <>
    {typeof data === 'object' &&
      <Provider store={store} >
        <Home
          tokenData={data.result}
         />
      </Provider>
    }
    </>
  )
}

export default App
