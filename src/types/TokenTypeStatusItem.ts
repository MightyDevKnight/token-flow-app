export type TokenTypeStatusItem = {
  // @README let's decouple the name and ID
  // otherwise we could run into remapping issues like we have with tokens
  name: string
  // @README these are the token sets inside the theme
  checked: boolean
  // @README these are the style IDs from Figma
  // this is considered meta-data so it is prefixed with $
};
