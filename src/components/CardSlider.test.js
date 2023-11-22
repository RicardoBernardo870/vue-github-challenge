import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import CardSlider from './CardSlider.vue';

test('renders correctly with bookmark mode', async () => {
  const wrapper = await mount(CardSlider, {
    props: {
      language: 'Vue',
      results: [],
      bookmarkMode: true,
    },
  });

  expect(wrapper.html()).toMatchSnapshot();
});

test('renders correctly without bookmark mode', async () => {
  const wrapper = await mount(CardSlider, {
    props: {
      language: 'Vue',
      results: [{ id: 1, name: 'Repo 1', owner: { id: 1 } }],
      bookmarkMode: false,
    },
  });

  expect(wrapper.html()).toMatchSnapshot();
});
