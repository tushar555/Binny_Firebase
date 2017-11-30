import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSalesPage } from './select-sales';

@NgModule({
  declarations: [
    SelectSalesPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectSalesPage),
  ],
})
export class SelectSalesPageModule {}
