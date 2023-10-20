import '@angular/localize/init';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

const preview: Preview = {
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
    componentWrapperDecorator(
      (story) => `<div style="margin: 3em">${story}</div>`,
    ),
  ],
};
export default preview;
