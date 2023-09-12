import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RvncCoreUiModule } from '@app/rvnc-core-ui';

import { PageHeaderComponent } from './components/page-header/page-header.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

import { DateAgoPipe } from './pipes/date-ago.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { OwnersPipe } from './pipes/owners.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';

@NgModule({
  declarations: [
    PageHeaderComponent,
    UploadFileComponent,
    FileSizePipe,
    OwnersPipe,
    DateAgoPipe,
    YesNoPipe,
  ],
  exports: [
    PageHeaderComponent,
    UploadFileComponent,
    FileSizePipe,
    OwnersPipe,
    DateAgoPipe,
    YesNoPipe,
  ],
  imports: [CommonModule, RvncCoreUiModule],
})
export class SharedModule {}
