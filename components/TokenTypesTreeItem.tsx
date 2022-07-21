import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@stitches/react';
import { violet, mauve, blackA, whiteA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { RootState } from "../store";
import { updateTokenTypeStatus } from '../store/tokenTypeStatusState';

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 26,
  height: 12,
  backgroundColor: blackA.blackA9,
  borderRadius: '9999px',
  position: 'relative',
  boxShadow: `0 1px 5px ${blackA.blackA7}`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  marginRight: 5,
  '&[data-state="checked"]': { backgroundColor: 'black' },
  '&[data-state="unchecked"]': { backgroundColor: 'white' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 12,
  height: 12,
  backgroundColor: 'white',
  borderRadius: '9999px',
  borderColor: 'Black',
  borderWidth: '1px',
  boxShadow: `0 1px 1px ${blackA.blackA7}`,
  transition: 'transform 100ms',
  transform: 'translateX(0px)',
  willChange: 'transform',  
  '&[data-state="checked"]': { transform: 'translateX(14px)' },
});

// Exports
export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;

// Your app...
const Flex = styled('div', { display: 'flex', order:0, flexGrow: 0, marginTop: 15 });
const Label = styled('label', {
  fontFamily: 'sans-serif',
  fontWeight: 500,
  width: '86px',
  color: 'black',
  fontSize: 18,
  lineHeight: 1,
  userSelect: 'none',
});

type Props = {
  tokenType?: string;
}

const TreeItem: React.FC<Props> = ({
  tokenType
}) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = React.useState(true);
  const tokenTypeChecked = useSelector((state: RootState) => (state.tokenType));
  const handleSwithcClicked = React.useCallback(() => {
    dispatch(updateTokenTypeStatus({name: tokenType}));
    setIsChecked(!isChecked);
  }, [isChecked]);

  useEffect(() => {
    Object.entries(tokenTypeChecked).forEach(t => {
      if(t[0] === tokenType){
        setIsChecked(t[1]);
    }
  })
  }, [isChecked]);
  return (
    <form>
      <Flex css={{ alignItems: 'center' }}>
        <Switch checked={isChecked} id="s1" onCheckedChange={handleSwithcClicked} >
          <SwitchThumb />
        </Switch>
        <Label htmlFor="s1" css={{ paddingRight: 15 }}>
          {tokenType}
        </Label>
      </Flex>
    </form>
  );
}
export default TreeItem;