import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,LoadingController,ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import {storage} from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {FileChooser} from '@ionic-native/file-chooser';
import {File} from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user:any;
  avatar:string;
  emailVerified:string;
  photo:string;
  loading:any;
 
  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              private afAuth: AngularFireAuth,
              private alertCtrl:AlertController,
              private toastCtrl: ToastController,
              private camera :Camera,
              public loadingCtrl: LoadingController,
              private actionSheetCtrl:ActionSheetController,
              public fileChooser:FileChooser,
              public file:File
            ) {
    
    this.avatar = this.afAuth.auth.currentUser.photoURL === null?'assets/imgs/user.jpg':this.afAuth.auth.currentUser.photoURL;
    this.emailVerified = this.afAuth.auth.currentUser.emailVerified?'E-mail verificado.':'E-mail não verificado';
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  alertUpdateNome() {
    if(!this.afAuth.auth.currentUser.isAnonymous){
      let alert = this.alertCtrl.create({
        title: 'Alterar Nome',
        inputs: [
          {          
            name: 'nome',
            placeholder: 'Digite seu nome.'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Alterar',
            handler: data => {            

              this.afAuth.auth.currentUser.updateProfile({displayName:data.nome,photoURL:this.afAuth.auth.currentUser.photoURL})
                .then(success =>{
                  let toast = this.toastCtrl.create({
                    duration: 3000,
                    position: "bottom"
                  });

                  this.avatar = this.afAuth.auth.currentUser.photoURL === null?'assets/imgs/user.jpg':this.afAuth.auth.currentUser.photoURL;
                  this.emailVerified = this.afAuth.auth.currentUser.emailVerified?'E-mail verificado.':'E-mail não verificado';

                  toast.setMessage('Nome alterado com sucesso.');
                  toast.present();                      
                })
                .catch(error =>{
                  let toast = this.toastCtrl.create({
                    duration: 3000,
                    position: "bottom"
                  });
                  toast.setMessage('Nome Inválido.');
                  toast.present();              
                })
              }             
            
            
            }
          
        ]
      });
      alert.present();
    }else{
      let toast = this.toastCtrl.create({
        duration: 3000,
        position: "bottom"
      });
      toast.setMessage('Essa função só é permitida para usuários cadastrados.');
      toast.present(); 
    }
  }

   uploadPhoto(){
if(!this.afAuth.auth.currentUser.isAnonymous){
    this.actionSheetCtrl.create({

      title: 'Selecione uma opção:',
      buttons: [

                  {
                    text:'Tirar foto',
                    handler: () =>{
                     
                        this.takeFoto(this.camera.PictureSourceType.CAMERA);
                    }
                    
                  },   
                  {
                    text:'Escolher foto da galeria',
                    handler: () =>{
                     
                        this.takeFoto(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                    
                  },            
                  {
                    text:'Excluir foto',
                    role:'destructive',
                    handler: () => {
                     
                     
                   this. deletePhoto();
                     
                     
                    }

                  },
                  {
                    text:'Cancelar',
                    role:'cancel',
                    handler: () =>{
                      console.log('Operação Cancelada');
                    }
                  }
              ]



    }).present();
   
  }else{
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: "bottom"
    });
    toast.setMessage('Essa função só é permitida para usuários cadastrados.');
    toast.present(); 
  }

  }

  async takeFoto(optionsPhoto){
    const uid = this.afAuth.auth.currentUser.uid;
    let photoURL:string;
    try{
        const options: CameraOptions = {
          quality: 50,
          targetHeight: 600,
          targetWidth:600,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          sourceType: optionsPhoto,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true
        }

        const result = await this.camera.getPicture(options);

        const image = `data:image/jpeg;base64,${result}`;

        const pictures = storage().ref(`profile/${uid}`);
        pictures.putString(image, 'data_url'); 
       
        pictures.getDownloadURL().then(photo =>{
          this.photo = JSON.stringify(photo).replace(/[\\"]/g,'');
          

          this.afAuth.auth.currentUser.updateProfile({displayName:this.afAuth.auth.currentUser.displayName,photoURL:this.photo}).then(e =>{
            this.avatar = this.afAuth.auth.currentUser.photoURL === null?'assets/imgs/user.jpg':this.afAuth.auth.currentUser.photoURL;
            this.emailVerified = this.afAuth.auth.currentUser.emailVerified?'E-mail verificado.':'E-mail não verificado';
           
            let toast = this.toastCtrl.create({
              duration: 3000,
              position: "bottom"
            });
            toast.setMessage('Foto atualizada com sucesso.');
            toast.present(); 
          });


        });
    }
    catch (e) {
      console.error(e);
    }
  }

 
  deletePhoto(){
    
    
    firebase.storage().ref('profile/' +  this.afAuth.auth.currentUser.uid).delete().then(e =>{
      this.afAuth.auth.currentUser.updateProfile({displayName:this.afAuth.auth.currentUser.displayName,photoURL:null}).then(e=>{
        this.avatar = this.afAuth.auth.currentUser.photoURL === null?'assets/imgs/user.jpg':this.afAuth.auth.currentUser.photoURL;
        this.emailVerified = this.afAuth.auth.currentUser.emailVerified?'E-mail verificado.':'E-mail não verificado';
        let toast = this.toastCtrl.create({
          duration: 3000,
          position: "bottom"
        });
        toast.setMessage('Foto excluída.');
        toast.present(); 
     
      });
    })
    .catch(error =>{
      let toast = this.toastCtrl.create({
        duration: 3000,
        position: "bottom"
      });
      toast.setMessage('Não existe foto para ser excluída.');
      toast.present(); 
    })
    
  }
}
