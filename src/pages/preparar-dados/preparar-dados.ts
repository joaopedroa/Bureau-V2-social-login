import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DadosFinaisPage } from '../dados-finais/dados-finais';

/**
 * Generated class for the PrepararDadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preparar-dados',
  templateUrl: 'preparar-dados.html',
})
export class PrepararDadosPage {
  nivelArvore:String;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.nivelArvore = this.navParams.get('nivelArvore');

    setTimeout(() => {
      this.navCtrl.setRoot(DadosFinaisPage,{nivelArvore:this.nivelArvore});
  }, 2500);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepararDadosPage');
  }

}
