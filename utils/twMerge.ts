import { extendTailwindMerge } from 'tailwind-merge';

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-headline1',
        'text-headline2',
        'text-headline3',
        'text-headline4',
        'text-subtitle1',
        'text-subtitle2',
        'text-subtitle3',
        'text-body1',
        'text-body2',
        'text-body3',
        'text-body4',
        'text-details',
      ],
    },
  },
});
