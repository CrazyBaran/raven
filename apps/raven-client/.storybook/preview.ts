import '@angular/localize/init';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { Observable } from 'rxjs';

let actions$: Observable<unknown>;

const preview: Preview = {
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, RouterTestingModule],
      providers: [provideMockActions(() => actions$)],
    }),
    componentWrapperDecorator(
      (story) => `<div style="margin: 3em">${story}</div>`,
    ),
  ],
};
export default preview;
