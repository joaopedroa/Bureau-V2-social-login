import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController   } from 'ionic-angular';

import {ServicesProvider} from '../../providers/services/services';
import {User} from '../../providers/user';

import{FormGroup,FormBuilder,Validators} from '@angular/forms'

import {HomePage} from '../home/home';

import {RegisterPage} from '../register/register';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})


export class LoginPage {

  form:FormGroup;
  typePageRegister:boolean = false;
  messageFooter:string = 'Não possui conta?';
  messageLink:string = 'Cadastre-se';
  messageHome:string = 'Bem Vindo!';
  user = {} as User;
  messageError:string = "";
  messageErrorPassword:string = "";
  emailResetPassword:string = "";
  passwordVisible:boolean = false;
  typeInputPassword:string = 'password';





  constructor(
          public navCtrl: NavController,
          public navParams: NavParams,
          private service:ServicesProvider,
          public loadingCtrl: LoadingController,
          private toastCtrl: ToastController,
          private formBuild:FormBuilder,
          private alertCtrl:AlertController
        
        ) {
          this.createForm();
  }

  ionViewDidLoad() {
    

  }
  viewPassword(){
    if(this.passwordVisible){
      this.passwordVisible = false;
      this.typeInputPassword = 'password';
    }else{
      this.passwordVisible = true;
      this.typeInputPassword = 'text';
    }
  }

  createForm(){
    this.form = this.formBuild.group({
      email: ['',Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      password: ['',[Validators.required, Validators.minLength(6)]]
     
    });

    
  }

  signIn(){
    
    if(this.form.valid){
     
      let loading = this.loadingCtrl.create({
        showBackdrop: true,
        content: `Fazendo login...`
      });
      loading.present();

      this.service.emailLogin(this.form.value)
      .then((authUser:any) => {
       console.log(authUser);

        localStorage.setItem('user', JSON.stringify(authUser.user));

        this.navCtrl.setRoot(HomePage).then(() => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            duration: 3000,
            position: "bottom"
          });
          toast.setMessage(`Olá ${authUser.user.displayName}.`);
          toast.present();
        });
      })
      .catch((error: any) => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          duration: 3000,
          position: "bottom"
        });

        if (error.code == "auth/invalid-email") {
          toast.setMessage("O endereço de e-mail não é válido.");
        }

        if (error.code == "auth/user-disabled") {
          toast.setMessage(
            "O endereço de email pode ter sido desativado."
          );
        }

        if (error.code == "auth/user-not-found") {
          toast.setMessage(
            "Email não está cadastrado no sistema."
          );
        }

        if (error.code == "auth/wrong-password") {
          toast.setMessage(
            "Endereço de email ou senha inválidos."
          );
        }
        toast.present();
      });
      this.messageError = "";
      this.messageErrorPassword = "";
    }else{
      console.log(this.form)
      this.messageError = "";
      this.messageErrorPassword = "";
      if(this.form.controls.email.invalid && this.form.controls.password.invalid){
      this.messageError = "E-mail inválido.";
      this.messageErrorPassword = "Senha inválida.";
  
      }
      if(this.form.controls.password.invalid){
        this.messageErrorPassword = "Senha inválida.";
      }
      if(this.form.controls.email.invalid){
        this.messageError = "E-mail inválido.";        
        }
      
    }
  }

  goSignUp(){
    this.navCtrl.setRoot(RegisterPage); 
  }
  
  signInAnonymous(){

    let loading = this.loadingCtrl.create({

      showBackdrop: true,
      content: `Fazendo login...`,
      duration: 5000
    });
    loading.present();


    this.service.anonymousLogin()
    .then((success:any) =>{
       localStorage.setItem('user', JSON.stringify(success.user));
        this.navCtrl.setRoot(HomePage).then(() => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            duration: 3000,
            position: "bottom"
          });
          toast.setMessage("Você entrou no modo anônimo");
          toast.present();
        });
    });
  }

  githubLogin(){

    let loading = this.loadingCtrl.create({

      showBackdrop: true,
      content: `Fazendo login...`,
      duration: 5000
    });
    loading.present();

    let toast = this.toastCtrl.create({
      duration: 3000,
      position: "bottom"
    });

    this.service.githubLogin()
    .then(success => {
        console.log(success);
        localStorage.setItem('user', JSON.stringify(success.user));
        
        this.navCtrl.setRoot(HomePage).then(() => {
          
          loading.dismiss();
          let toast = this.toastCtrl.create({
            duration: 5000,
            position: "bottom"
          });
          toast.setMessage(`Olá ${success.user.displayName}`);
          toast.present();
        });
    })
    .catch((error: any) => {
      console.log(error);
      loading.dismiss();
      if (error.code == 'auth/account-exists-with-different-credential') {
    
        toast.setMessage('Este e-mail já está logado com outra credencial. O email é ' + error.email + '.');
      }  
      toast.present();

    })
  }
  
  facebookLogin(){
    let loading = this.loadingCtrl.create({

      showBackdrop: true,
      content: `Fazendo login...`,
      duration: 5000
    });
    loading.present();

    let toast = this.toastCtrl.create({
      duration: 3000,
      position: "bottom"
    });

    this.service.facebookLogin()
    .then(success => {
        console.log(success);
        localStorage.setItem('user', JSON.stringify(success.user));
        this.navCtrl.setRoot(HomePage).then(() => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            duration: 3000,
            position: "bottom"
          });
          toast.setMessage(`Olá ${success.user.displayName}`);
          toast.present();
        });
    })
    .catch((error: any) => {
      console.log(error);
      loading.dismiss();
      if (error.code == 'auth/account-exists-with-different-credential') {
    
        toast.setMessage('Este e-mail já está logado com outra credencial. O email é ' + error.email + '.');
      }  
      toast.present();

    })
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Recuperar Senha',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite seu E-mail.'
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
          text: 'Recuperar',
          handler: data => {            

              this.service.resetPassword(data.email)
              .then(success =>{
                let toast = this.toastCtrl.create({
                  duration: 3000,
                  position: "bottom"
                });
                toast.setMessage('E-mail enviado com sucesso.');
                toast.present();                      
              })
              .catch(error =>{
                let toast = this.toastCtrl.create({
                  duration: 3000,
                  position: "bottom"
                });
                toast.setMessage('E-mail Inválido.');
                toast.present();              
              })
            }             
           
          
          }
        
      ]
    });
    alert.present();
  }

  





}