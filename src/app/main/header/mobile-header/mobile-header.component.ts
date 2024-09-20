import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { getAuth, signOut } from '@angular/fire/auth';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';
import { User } from '../../../../assets/models/user.class';
import { ThreadService } from '../../../service/thread.service';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent],
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'],
})
export class MobileHeaderComponent implements OnInit {
  currentUser: any;
  private dialog = inject(MatDialog);
  userMenu: boolean = false;

  constructor(
    public mainService: MainServiceService,
    private loginService: LoginService,
    private router: Router,
    public threadService: ThreadService,
  ) {}

  /**
   * Initializes the component.
   * Retrieves the current logged-in user and subscribes to changes in the logged-in user.
   * Updates the component's currentUser property and the mainService's loggedInUser property.
   */
  ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      this.mainService.loggedInUser = new User(user);
    });
  }

  /**
   * Prevents the event from propagating further.
   *
   * @param event - The event object.
   */
  doNotClose(event: Event) {
    event.stopPropagation();
  }

  /**
   * Toggles the user menu.
   */
  openUserMenu() {
    this.userMenu = !this.userMenu;
  }

  /**
   * Opens the user profile dialog.
   */
  openUserProfile() {
    this.dialog.open(UserProfileComponent);
  }

  /**
   * Logs out the user.
   */
  logout() {
    this.threadService.closeThread();
    const auth = getAuth();
    this.loginService.logoutUser(auth);

    signOut(auth).then(() => {
      this.router.navigate(['login']);
    });
  }
}
