import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import{FormGroup,FormBuilder,Validators} from '@angular/forms';

import {ServicesProvider} from '../../providers/services/services';
import { AngularFireAuth } from 'angularfire2/auth';

import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  form:FormGroup;
  messageError:string = "";
  messageErrorPassword:string = "";
  messageErrorName:string = "";
  passwordVisible:boolean = false;
  typeInputPassword:string = 'password';
  constructor(
          public navCtrl: NavController,
          public navParams: NavParams,
          private formBuild:FormBuilder,
          private service:ServicesProvider,
          public loadingCtrl: LoadingController,
          private toastCtrl: ToastController,
          private auth:AngularFireAuth
      ) {
        this.createForm();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  createForm(){
    this.form = this.formBuild.group({
      email: ['',Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      password: ['',[Validators.required, Validators.minLength(6)]],
      displayName: ['',[Validators.required, Validators.minLength(1)]]
     
    });

    
  } 

  signUp(){
    if(this.form.valid){

        let loading = this.loadingCtrl.create({

          showBackdrop: true,
          content: `Criando conta...`,
          duration: 5000
        });
        loading.present();

        let toast = this.toastCtrl.create({ 
          duration: 3000, position: 'bottom' 
        });

        this.service.createUser(this.form.value)
        .then((user:any) => {                    
         user.user.sendEmailVerification();
         user.user.updateProfile({displayName: this.form.value.displayName});
        
          this.navCtrl.setRoot(HomePage).then(() => {

            localStorage.setItem('user', JSON.stringify(user.user));
            
            let usuario:any =  JSON.parse(localStorage.getItem('user'));
            usuario.displayName = this.form.value.displayName;
            localStorage.setItem('user', JSON.stringify(usuario));

            toast.setMessage(`Olá ${this.form.value.displayName}`);
            loading.dismiss();
            toast.present();
          });
        })
        .catch((error: any) => {
          console.log(error);
          loading.dismiss();
          if (error.code == 'auth/email-already-in-use') {
            toast.setMessage('Este e-mail já está cadastrado.');
          }
          if (error.code == 'auth/weak-password') {
            toast.setMessage('A senha deve possuir mais de 6 caracteres.');
          }
          toast.present();

        })
        this.messageError = "";
        this.messageErrorPassword = "";
        this.messageErrorName = "";
    }else{
      console.log(this.form)
      this.messageError = "";
      this.messageErrorPassword = "";
      this.messageErrorName = "";

    
      if(this.form.controls.displayName.invalid){
        this.messageErrorName = "Nome inválido";
      }
      if(this.form.controls.email.invalid){
        this.messageError = "E-mail inválido";
      }
      if(this.form.controls.password.invalid){
        this.messageErrorPassword = "Senha inválida";
      }

    }
    localStorage.setItem('user', JSON.stringify(this.auth.auth.currentUser));
  }
  goSignIn(){
    this.navCtrl.setRoot(LoginPage);
  }

}
