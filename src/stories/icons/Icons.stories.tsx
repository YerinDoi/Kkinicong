import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import BackwardIcon from './system/backward.svg?react';
import MenubarIcon from './system/menubar.svg?react';
import LocationDropdownIcon from './system/locationDropdown.svg?react';
import SearchIcon from './system/search.svg?react';
import AllIcon from './menu/all.svg?react';
import SnackIcon from './menu/snack.svg?react';
import WesternIcon from './menu/western.svg?react';
import ChineseIcon from './menu/chinese.svg?react';
import ChickenIcon from './menu/chicken.svg?react';
import HotpotIcon from './menu/hotpot.svg?react';
import AsianIcon from './menu/asian.svg?react';
import JapaneseIcon from './menu/japanese.svg?react';
import KoreanIcon from './menu/korean.svg?react';
import StreetFoodIcon from './menu/streetFood.svg?react';
import LunchBoxIcon from './menu/lunchBox.svg?react';
import EtcIcon from './menu/etc.svg?react';
import DropdownIcon from './system/dropdown.svg?react';
import DropupIcon from './system/dropup.svg?react';
import Icon from '@/components/common/icons';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'icon',
  component: Icon,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    name: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { name: 'backward' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Backward: Story = {
  args: {
    name: 'backward',
  },
};

export const Menubar: Story = {
  args: {
    name: 'menubar',
  },
};

export const LocationDropdown: Story = {
  args: {
    name: 'locationDropdown',
  },
};

export const Search: Story = {
  args: {
    name: 'search',
  },
};

export const All: Story = {
  args: {
    name: 'all',
  },
};

export const Snack: Story = {
  args: {
    name: 'snack',
  },
};

export const Western: Story = {
  args: {
    name: 'western',
  },
};

export const Chinese: Story = {
  args: {
    name: 'chinese',
  },
};

export const Chicken: Story = {
  args: {
    name: 'chicken',
  },
};

export const Hotpot: Story = {
  args: {
    name: 'hotpot',
  },
};

export const Asian: Story = {
  args: {
    name: 'asian',
  },
};

export const Japanese: Story = {
  args: {
    name: 'japanese',
  },
};

export const Korean: Story = {
  args: {
    name: 'korean',
  },
};

export const StreetFood: Story = {
  args: {
    name: 'streetFood',
  },
};

export const LunchBox: Story = {
  args: {
    name: 'lunchBox',
  },
};

export const Etc: Story = {
  args: {
    name: 'etc',
  },
};

export const Dropdown: Story = {
  args: {
    name: 'dropdown',
  },
};

export const Dropup: Story = {
  args: {
    name: 'dropup',
  },
};
