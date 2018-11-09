import { Component, ViewChild } from '@angular/core';
import { Nav, Platform , App,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {ProfilePage} from '../pages/profile/profile';
import {LoginPage} from '../pages/login/login'
import { AngularFireAuth } from 'angularfire2/auth';
import {ServicesProvider} from '../providers/services/services';
import { NivelArvore } from '../providers/nivelArvore';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  
  rootPage: any;

  arrayPath:any;
  pages: Array<{title: string, component: any}>;

  constructor(
              public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public afAuth: AngularFireAuth,
              public app: App,
              public alertCtrl: AlertController,
              private service:ServicesProvider
            ) {
   
    console.log(NivelArvore.nivelArvore)
    const observer = afAuth.authState.subscribe(user => {
      if(user) {
        this.rootPage = HomePage;
        observer.unsubscribe();
      } else {       
          this.rootPage = LoginPage;        
          observer.unsubscribe();
      }
    });
    
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Pagina Inicial', component: HomePage },
      { title: 'Perfil', component: ProfilePage },
      { title: 'Sair', component: ListPage },
      
    ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();                
      // Checks if can go back before show up the alert
      if(activeView.name === 'HomePage' && NivelArvore.nivelArvore === 'base') {
        const alert = this.alertCtrl.create({
          title: 'Aviso',
          message: 'Fechar o app?',
          buttons: [{
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                                
              }
          },{
              text: 'Sim',
              handler: () => {                
                this.platform.exitApp();
              }
          }]
      });
      alert.present();             
      }else if(activeView.name === 'HomePage' && NivelArvore.nivelArvore !== 'base'){
        this.arrayPath = NivelArvore.nivelArvore.split('/');
        this.arrayPath.splice(-1,1);
        NivelArvore.nivelArvore = this.arrayPath.join('/');
      
        if(NivelArvore.positionOld[NivelArvore.positionOld.length-1] >0){
          if(NivelArvore.positionOld[NivelArvore.positionOld.length-1] ===1 && NivelArvore.positionOld.length>1 ){
            
            NivelArvore.positionOld.splice(-1,1);
            NivelArvore.mapArrayAntigo.splice(-1,1);
            NivelArvore.arrayAntigo = NivelArvore.mapArrayAntigo[NivelArvore.mapArrayAntigo.length-1];
            NivelArvore.positionSteps=NivelArvore.positionOld[NivelArvore.positionOld.length-1]===undefined?0:NivelArvore.positionOld[NivelArvore.positionOld.length-1];
            console.log('essa',NivelArvore.arrayAntigo)
           }else{
            NivelArvore.positionOld[NivelArvore.positionOld.length-1]--;
            NivelArvore.arrayAntigo = NivelArvore.mapArrayAntigo[NivelArvore.mapArrayAntigo.length-1];
            NivelArvore.positionSteps=NivelArvore.positionOld[NivelArvore.positionOld.length-1];
           }
         }else{
          NivelArvore.mapArrayAntigo.splice(-1,1);
          NivelArvore.positionOld.splice(-1,1);
          NivelArvore.arrayAntigo = NivelArvore.mapArrayAntigo[NivelArvore.mapArrayAntigo.length-1];
          NivelArvore.positionSteps =  NivelArvore.positionOld[NivelArvore.positionOld.length-1];
         }
            
        this.nav.setRoot(HomePage,{iniciarPostion:false});
      }else{
        NivelArvore.nivelArvore ='base';     
       
        this.nav.setRoot(HomePage,{iniciarPostion:true});
      }

      
  });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component === HomePage){
      NivelArvore.nivelArvore ='base';
    }
    this.nav.setRoot(page.component);
  }
}
