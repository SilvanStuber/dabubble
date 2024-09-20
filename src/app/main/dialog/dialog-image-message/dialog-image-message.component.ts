import { Component, Inject } from '@angular/core';
import { ChatService } from '../../../service/chat.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-image-message',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './dialog-image-message.component.html',
  styleUrl: './dialog-image-message.component.scss',
})
export class DialogImageMessageComponent {
  constructor(
    public chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: { image: string | ArrayBuffer },
    public dialogRef: MatDialogRef<DialogImageMessageComponent>,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
