import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { MainServiceService } from './main-service.service';
import { Channel } from '../../assets/models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  textThread = '';
  activeThreadMessageIndex: number | null = null;
  editTextThread = '';
  editOpenThread = false;
  editMessageIndexThread: number | null = null;
  editMessageInputIndexThread: number | null = null;
  displayDate = '';
  hoveredMessageIndexThread: number | null = null;
  imageMessage: string | ArrayBuffer | null = '';

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
  ) { }

  /**
   * Closes the currently open thread by setting `isThreadOpen` to false.
   * @function closeThread
   */
  closeThread() {
    this.chatService.editOpen = false;
    this.chatService.dataThread = new Channel();
    this.chatService.isThreadOpen = false;
    this.chatService.isWorkspaceOpen = true;
    this.textThread = '';
  }

  /**
   * Toggles the icon container based on the given index and event. Stops the event propagation if `editOpen` is false.
   * If the active message index matches the provided index, it closes the icon container; otherwise, it sets the active message index to the provided index.
   */
  toggleIconContainerThread(index: number, event: MouseEvent): void {
    if (!this.editOpenThread) {
      event.stopPropagation();
      this.activeThreadMessageIndex = index;
    }
  }

  /**
   * Closes the icon container by setting the active message index to null.
   */
  closeIconContainerThread() {
    this.activeThreadMessageIndex = null;
  }

  /**
   * Toggles the editing state of a message container based on the provided index and event. Stops event propagation always.
   * If the edit message index matches the provided index, it closes the editor by resetting relevant indices to null.
   * Otherwise, it sets up the editor for a new message, using the provided content and updates indices to reflect the current editing state.
   */
  toggleEditMessageContainerThread(
    index: number,
    event: MouseEvent,
    messageContent: string,
  ): void {
    this.chatService.editOpen = true;
    event.stopPropagation();
    if (this.editMessageIndexThread === index) {
      this.editMessageIndexThread = null;
      this.editMessageInputIndexThread = null;
    } else {
      this.activeThreadMessageIndex = null;
      this.editOpenThread = true;
      this.editTextThread = messageContent;
      this.editMessageIndexThread = index;
      this.editMessageInputIndexThread = index;
    }
  }

  /**
   * Closes the message editor without saving changes. It resets the editing state indices and closes the editor immediately.
   * After a brief delay, it also resets the active message index to ensure the interface reflects the closure of any active interactions.
   */
  closeWithoutSavingThread() {
    this.chatService.editOpen = false;
    this.editMessageIndexThread = null;
    this.editMessageInputIndexThread = null;
    this.editOpenThread = false;
    setTimeout(() => {
      this.activeThreadMessageIndex = null;
    }, 125);
  }

  /**
   * Sends a message from a specified thread channel, updating message details and initiating data preparation.
   * This function sets message properties including text content, date, and user details (ID, name, email, avatar),
   * and associates an image with the message if available.
   * It only executes if there is text content or an associated image message.
   * @param {string} channelId - The ID of the channel from which the message is sent.
   * @param {string} textContent - The text content of the message.
   */
  sendMessageFromThread(
    channelId: string,
    textContent: string,
    imageMessage: ArrayBuffer | string | null,
  ) {
    if (textContent || imageMessage) {
      this.chatService.messageThread.message = textContent;
      this.chatService.messageThread.date = Date.now();
      this.chatService.messageThread.userId = this.mainService.loggedInUser.id;
      this.chatService.messageThread.userName =
        this.mainService.loggedInUser.name;
      this.chatService.messageThread.userEmail =
        this.mainService.loggedInUser.email;
      this.chatService.messageThread.userAvatar =
        this.mainService.loggedInUser.avatar;
      this.chatService.messageThread.imageToMessage =
        imageMessage as ArrayBuffer;
      this.setDataPreparatoryThreadOwnerMessage();
    }
  }

  /**
   * Asynchronously updates the owner message in a data preparation thread, increments message counters,
   * sends a message to the thread, and resets the message content.
   * It pushes the current message thread into the data thread's message channel,
   * updates the date of the message being edited to the current date,
   * increments the message count for both the edited message and the first message in the data thread.
   */
  async setDataPreparatoryThreadOwnerMessage() {
    this.chatService.dataThread.messageChannel.push(
      this.chatService.messageThread,
    );
    this.chatService.dataChannel.messageChannel[
      this.chatService.indexOfThreadMessageForEditChatMessage
    ].date = Date.now();
    this.chatService.dataChannel.messageChannel[
      this.chatService.indexOfThreadMessageForEditChatMessage
    ].numberOfMessage++;
    this.chatService.dataThread.messageChannel[0].numberOfMessage++;
    this.chatService.activateThreadFocus();
    await this.sendMessageToThread();
    this.resetMessageContentThread();
  }

  /**
   * Resets message content by clearing text and image message properties.
   */
  resetMessageContentThread() {
    this.textThread = '';
    this.imageMessage = '';
  }

  /**
   * Asynchronously edits a message within a channel by updating its text and then sends an update notification. It finalizes by closing the editor without saving further changes.
   */
  async editMessageFromThread(
    parmsId: string,
    newText: string,
    singleMessageIndex: number,
  ) {
    this.chatService.dataThread.messageChannel[singleMessageIndex].message =
      newText;
    if (singleMessageIndex === 0) {
      this.chatService.dataChannel.messageChannel[
        this.chatService.indexOfThreadMessageForEditChatMessage
      ].message = newText;
      await this.mainService.addDoc(
        'channels',
        this.chatService.dataChannel.id,
        new Channel(this.chatService.dataChannel),
      );
    }
    await this.mainService.addDoc(
      'threads',
      this.chatService.dataThread.id,
      new Channel(this.chatService.dataThread),
    );
    this.closeWithoutSavingThread();
  }

  /**
   * Initiates the process to add a new document for a message within a specified channel.
   */
  async sendMessageToThread() {
    await this.mainService.addDoc(
      'channels',
      this.chatService.dataChannel.id,
      new Channel(this.chatService.dataChannel),
    );
    await this.mainService.addDoc(
      'threads',
      this.chatService.dataThread.id,
      new Channel(this.chatService.dataThread),
    );
  }

  /**
   * Determines if the selected message from a thread is the original message based on its index.
   * Sets `ownerThreadMessage` to true if it is the first message, otherwise sets it to false.
   * @param {number} indexSingleMessage - The index of the message in the thread to check.
   */
  ifMessageOwnerMessageFromThread(indexSingleMessage: number) {
    if (indexSingleMessage === 0) {
      this.chatService.ownerThreadMessage = true;
    } else {
      this.chatService.ownerThreadMessage = false;
    }
  }

  /**
   * Setzt die Anzeige des Datums basierend auf dem Datum der letzten Nachricht in einem Thread.
   * Wenn das Datum der letzten Nachricht der aktuelle Tag ist, wird eine spezielle Formatierung für "heute" verwendet.
   * Andernfalls wird eine Standard-Datumsformatierung verwendet.
   *
   * @param {number} dateOfLastThreadMessage - Das Datum der letzten Nachricht im Thread als Zeitstempel.
   * @returns {string} Die formatierte Datumsanzeige.
   */
  setDateThreadInfo(dateOfLastThreadMessage: number) {
    const currentDate = new Date();
    const messageDate = new Date(dateOfLastThreadMessage);
    if (
      currentDate.getDate() === messageDate.getDate() &&
      currentDate.getMonth() === messageDate.getMonth() &&
      currentDate.getFullYear() === messageDate.getFullYear()
    ) {
      this.generateDateToday(messageDate);
    } else {
      this.generateDateNotToday(messageDate);
    }
    return this.displayDate;
  }

  /**
   * Generiert eine formatierte Uhrzeit für das gegebene Datum, die speziell für den aktuellen Tag (heute) verwendet wird.
   * Die Uhrzeit wird im "HH:MM" Format basierend auf der deutschen Lokalisierung ausgegeben.
   *
   * @param {Date} messageDate - Das Datum der Nachricht, für die die Uhrzeit formatiert werden soll.
   */
  generateDateToday(messageDate: Date) {
    this.displayDate = messageDate.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Generiert eine vollständige Datums- und Uhrzeitanzeige für das gegebene Datum, das nicht der aktuelle Tag ist.
   * Das Datum wird im Format "TT.MM.JJJJ" basierend auf der deutschen Lokalisierung ausgegeben.
   *
   * @param {Date} messageDate - Das Datum der Nachricht, das formatiert werden soll.
   */
  generateDateNotToday(messageDate: Date) {
    this.displayDate = messageDate.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Sets the hovered message index when the mouse enters a specific UI element. This function updates the hoveredMessageIndex to reflect the index of the currently hovered message.
   * @param {number} index - The index of the message that the mouse has entered.
   */
  onMouseEnterThread(index: number): void {
    this.hoveredMessageIndexThread = index;
  }

  /**
   * Resets the hovered message index when the mouse leaves a specific UI element. This function clears the hoveredMessageIndex to null, indicating no current message is being hovered over.
   */
  onMouseLeaveThread(): void {
    this.hoveredMessageIndexThread = null;
  }

  /**
   * Prevents an event from bubbling up the event chain.
   * Typically used to stop a parent handler from being notified of an event.
   * @param {Event} event - The event to stop propagation for.
   */
  doNotCloseThread(event: Event) {
    event.stopPropagation();
  }

  /**
   * Clears the content of the image message.
   */
  deleteMessage() {
    this.imageMessage = '';
  }

  /**
   * Handles file selection events and reads the first selected file as a data URL. If the file is successfully read, the resulting data URL is stored in `imageMessage`.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.imageMessage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
