import React, { useMemo, useCallback } from "react";
import { TokenTypes } from "@/constants/TokenTypes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuItemIndicator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./DropdownMenu";
import { Flex } from "./Flex";
import Text  from './Text';
import TreeItem from "./TokenTypesTreeItem";
import { styled } from "@/stitches.config";
import IconToggleableDisclosure from './IconToggleableDisclosure';
import Box from "./Box";
import Heading from "./Heading";
import { CheckIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import { tokenTypesStatusListSelector } from "@/app/selectors/tokenTypesStatusListSelector";
import TokenTypesTreeItem from "./TokenTypesTreeItem";

const ThemeDropdownLabel = styled(Text, {
  marginRight: '$2',
});

interface AvailableTheme {
  value: string,
  label: string,
}

export default function Theme(){
  const tokenTypesStatusList = useSelector(tokenTypesStatusListSelector);
  console.log('tokenTypesStatusList', tokenTypesStatusList);
  return (
    <div>
      { tokenTypesStatusList.map(tokenTypeStatusItem => (
        <TokenTypesTreeItem tokenTypeStatus={tokenTypeStatusItem} key={tokenTypeStatusItem.name}/>
      ) )
      }
    </div>
  )
};