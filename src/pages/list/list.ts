import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';

import {LoginPage} from '../login/login';

import {ServicesProvider} from '../../providers/services/services';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,private service:ServicesProvider,) {
    let loading = this.loadingCtrl.create({
      showBackdrop: true,
      content: `Até logo...`
    });
    loading.present();
    localStorage.removeItem('photoURL');
    this.navCtrl.setRoot(LoginPage).then(() => {
      this.service.signOut();
      loading.dismiss();
    });
  }

 
}