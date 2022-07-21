import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { activeTokenSetSelector } from '@/app/selectors'
import { Dispatch } from '@/app/store'
import convertToTokenArray from '@/utils/convertTokens'
import NodeFlow from './NodeFlow/NodeFlow'
import { SingleToken } from '@/types/tokens'

interface TokenData {
  token: string,
  themeData: {
    activeTheme: string,
    availableThemes: object,
    themeObjects: string,
    usedTokenSet: object,
  }
}

interface HomeProps {
  tokenData: TokenData,
}

const Home = ({
  tokenData
}: HomeProps) => {
  const dispatch = useDispatch<Dispatch>();
  const tokens =JSON.parse(tokenData.token);
  const tokenArray: SingleToken[] = convertToTokenArray({tokens});
  const themes = tokenData.themeData.themeObjects.split('---').map(themeObject => {
    return JSON.parse(themeObject);
  });
  const activeTheme = tokenData.themeData.activeTheme;
  dispatch.tokenState.setActiveTheme(activeTheme);
  dispatch.tokenState.setTokenData({values: tokenArray, themes: themes, activeTheme: tokenData.themeData.activeTheme});
  return (
    <>
      <NodeFlow tokenArray={tokenArray} />
    </>
  )
}

export default Home
