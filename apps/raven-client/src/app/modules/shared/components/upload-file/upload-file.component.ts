import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent {
  @Input() public error: string | null = null;
  @Input() public isPending = false;
  @Input() public accept?: string;
  @Input() public multiple?: boolean;
  @Input() public title?: string;
  @Input() public info?: string;
  @Input() public icon = 'fa-solid fa-cloud-arrow-up ';
  @Input() public buttonInfo = 'Upload Files';
  @Input() public buttonPrefixIcon?: string;
  @Input() public buttonOnly?: boolean;
  @Output() public uploadFile = new EventEmitter<{ file: File | File[] }>();

  @ViewChild('fileUpload') public fileUploadRef: ElementRef<HTMLInputElement>;

  public updateInfo: string;

  public handleOpenUploadDialog(): void {
    this.fileUploadRef.nativeElement.click();
  }

  public handleFileUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target?.files;

    if (!files || files.length === 0) {
      return;
    }

    if (files.length > 1) {
      const filesArr: File[] = [];

      Array.from(files).forEach((file) => filesArr.push(file));

      this.uploadFile.emit({ file: filesArr });

      return;
    }

    const uploadedFile = files[0];

    this.uploadFile.emit({ file: uploadedFile });
  }
}
