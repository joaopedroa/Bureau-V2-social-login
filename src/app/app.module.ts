import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServicesProvider } from '../providers/services/services';

import {FileChooser} from '@ionic-native/file-chooser';
import {File} from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database'

import {AngularFireAuthModule} from 'angularfire2/auth';

import {LoginPage} from '../pages/login/login';
import {ProfilePage} from '../pages/profile/profile';
import{RegisterPage} from '../pages/register/register';
import {DadosFinaisPage } from '../pages/dados-finais/dados-finais';
import { PrepararDadosPage } from '../pages/preparar-dados/preparar-dados';

import {Camera} from '@ionic-native/camera';

import {  ReactiveFormsModule } from '@angular/forms';

import {YoutubePipe} from '../pipes/youtube/youtube';

import {IonicImageViewerModule} from 'ionic-img-viewer';

import {Vibration} from  '@ionic-native/vibration';

import {FileTransfer} from '@ionic-native/file-transfer';
import {DocumentViewer} from '@ionic-native/document-viewer';

const firebaseAuth = {
  apiKey: "AIzaSyCYwaSRikXqI8mo9bwc5Vqfg1Tp12dHCHk",
  authDomain: "entradadadosbureau.firebaseapp.com",
  databaseURL: "https://entradadadosbureau.firebaseio.com",
  projectId: "entradadadosbureau",
  storageBucket: "entradadadosbureau.appspot.com",
  messagingSenderId: "937777278595"
};

@NgModule({
  declarations: [
    MyApp,    
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    DadosFinaisPage,
    YoutubePipe,
    PrepararDadosPage
    
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    IonicImageViewerModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    DadosFinaisPage,
    PrepararDadosPage
     
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServicesProvider,
   
    Camera,
    Vibration,
    File,
    FileChooser,
    FileTransfer,
    DocumentViewer,
    InAppBrowser

  ]
})
export class AppModule {}
