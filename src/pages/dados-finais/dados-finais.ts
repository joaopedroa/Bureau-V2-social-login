import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import { HomePage } from '../home/home';
import {Vibration} from  '@ionic-native/vibration';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {DocumentViewer, DocumentViewerOptions} from '@ionic-native/document-viewer';
import {File} from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NivelArvore } from '../../providers/nivelArvore';
@IonicPage()
@Component({
  selector: 'page-dados-finais',
  templateUrl: 'dados-finais.html',
})


export class DadosFinaisPage {


  categoria: string = "pdf";
  nivelArvore:string;
  dadosBasicos: Observable<any[]>;
  
  arrayVideos:Observable<any[]>;
  arrayImagens:Observable<any[]>;
  lenghtPDF:number;
  lenghtVideos:number;
  lenghtImagens:number;
  lenghtTexto:number;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public database:AngularFireDatabase,
              public vibrate:Vibration,
              public file:File,
              public fileTransfer:FileTransfer,
              public documentViewer:DocumentViewer,
              private plataform:Platform,
              private toastCtrl: ToastController,
              private iab: InAppBrowser

            ) {
  
    this.nivelArvore = this.navParams.get('nivelArvore');

    this.dadosBasicos = this.database.list(this.nivelArvore).snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.$key !== 'dado' && i.$key !== 'final' && i.$key !== 'tipo')
});
 
    this.arrayVideos = this.database.list(this.nivelArvore).snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.tipo === 'Video')
  });;

  this.dadosBasicos.forEach(e=>{
    this.lenghtPDF = e.filter(i=> i.tipo.indexOf('application') === 0).length;
    this.lenghtVideos = e.filter(i=> i.tipo === 'Video').length;
    this.lenghtImagens = e.filter(i=> i.tipo.indexOf('image')===0).length;
    this.lenghtTexto= e.filter(i=> i.tipo ==='Texto').length;
  });

  }

  
  openPDF(url){
    let urls = encodeURIComponent(url);
    this.iab.create('https://docs.google.com/viewer?url=' + urls);
    
  }
 

  download(url,nome){
    const fileTransferAux: FileTransferObject = this.fileTransfer.create();
    fileTransferAux.download(url,this.file.dataDirectory + nome.replace(/\s/g,'')).then(e=>{
      let toast = this.toastCtrl.create({
        duration: 3000,
        position: "bottom"
      });
      toast.setMessage('Download do arquivo ' + nome + ' realizado com sucesso!');
      toast.present();
    });
  }



  goPageHome(){
    NivelArvore.nivelArvore = 'base';
    this.vibrate.vibrate(50);
    this.navCtrl.setRoot(HomePage);
  }


}
