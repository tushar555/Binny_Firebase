import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignClientsPage } from './assign-clients';

@NgModule({
  declarations: [
    AssignClientsPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignClientsPage),
  ],
})
export class AssignClientsPageModule {}
