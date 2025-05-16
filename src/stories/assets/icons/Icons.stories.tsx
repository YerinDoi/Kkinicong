import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Icon from '@/assets/icons';

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
    name: 'location-dropdown',
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
    name: 'street-food',
  },
};

export const LunchBox: Story = {
  args: {
    name: 'lunch-box',
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

export const Star: Story = {
  args: {
    name: 'star',
  },
};

export const Heart: Story = {
  args: {
    name: 'heart',
  },
};

export const HeartFilled: Story = {
  args: {
    name: 'heart-filled',
  },
};

export const Gps: Story = {
  args: {
    name: 'gps',
  },
};

export const Login: Story = {
  args: {
    name: 'login',
  },
};

export const Mypage: Story = {
  args: {
    name: 'mypage',
  },
};

export const StoreMap: Story = {
  args: {
    name: 'store-map',
  },
};

export const StoreSearch: Story = {
  args: {
    name: 'store-search',
  },
};

export const Community: Story = {
  args: {
    name: 'community',
  },
};

export const ConvenienceStore: Story = {
  args: {
    name: 'convenience-store',
  },
};

export const CloseBtn: Story = {
  args: {
    name: 'close-btn',
  },
};
