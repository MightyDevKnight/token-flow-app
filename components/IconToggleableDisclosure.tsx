import { styled } from '@/stitches.config';
import  { IconDisclosure } from '@/app/assets/icons';

const IconToggleableDisclosure = styled(
  IconDisclosure,
  {
    transition: 'transform 0.2s ease-in-out',
    variants: {
      open: {
        true: {
          transform: 'rotate(0deg)',
        },
        false: {
          transform: 'rotate(180deg)',
        },
      },
    },
  },
);

export default IconToggleableDisclosure;
