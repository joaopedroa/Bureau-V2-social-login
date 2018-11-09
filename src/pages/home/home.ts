import { Component, ViewChild } from '@angular/core';
import { NavController, Slides,NavParams } from 'ionic-angular';

import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {DadosFinaisPage} from '../dados-finais/dados-finais'
import {Vibration} from  '@ionic-native/vibration';
import { PrepararDadosPage } from '../preparar-dados/preparar-dados';
import { AngularFireAuth } from 'angularfire2/auth';
import { NivelArvore } from '../../providers/nivelArvore';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Slides) _slides:Slides;
  itensBasicos: Observable<any[]>;
  itens: Observable<any[]>;
  base = 'base';  
  nivel:any;
  validaFinal:string = 'base';
  lenghtArray:number;
  arrayPath = [];
  arrayValues = [];
  arrayTotal = [];
  arrayAntigo = [];
  tamanho;
  clicked:number;
  positionSteps:number;

  constructor(
                public navCtrl: NavController,
                public database:AngularFireDatabase, 
                public vibrate:Vibration,
                public navParams: NavParams,
                private afAuth: AngularFireAuth
              ) {

              
              this.arrayAntigo = NivelArvore.arrayAntigo;
              
              this.arrayTotal = NivelArvore.arrayTotal;
              this.nivel = NivelArvore.nivelArvore;
              
               this.itensBasicos = this.database.list(NivelArvore.nivelArvore).snapshotChanges().map(arr => {
                return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.$key !== 'dado' && i.$key !== 'final' && i.$key !== 'tipo')
          });
          
              if(this.navParams.get('iniciarPostion') || this.navParams.get('iniciarPostion') === undefined){         
                NivelArvore.positionSteps = 0;
                NivelArvore.positionOld = [];
                NivelArvore.mapArrayAntigo = [];   
                
              }else{
                this.clicked=0;
              }

              this.positionSteps = NivelArvore.positionSteps;
              this.itensBasicos.forEach(e =>{
                this.lenghtArray = e.length;  
              console.log('itens',e) ;
              });  
              
              this.steps(); 
              console.log('novoArrayPath',NivelArvore.positionOld);
              console.log('novoArrayold',NivelArvore.mapArrayAntigo);
  }

  counter(i:number){
    return new Array(i);
  }

  steps(){
    
    NivelArvore.arrayTotal = [];
    
    this.itensBasicos.forEach(e=>{  
      

      for(var x=0;x<e.length;x++){
        this.tamanho = 1;       
        this.arrayValues = Object["values"](e[x]);
        let validation = e[x].dado; 
        
        
        while(validation !== undefined) {       
          validation = this.arrayValues[0].dado;
          this.arrayValues = Object["values"](this.arrayValues[0]);
          this.tamanho++;
        }
        NivelArvore.arrayTotal.push(this.tamanho);
        this.arrayTotal = NivelArvore.arrayTotal;
      
      }
     
    });

  }

  entrarNivel(key:string,dado:string){

 
    
    NivelArvore.click =  this.clicked==undefined?-99:this.clicked;
    NivelArvore.clicked = this._slides.clickedIndex;
    this.clicked = NivelArvore.clicked ;
   
   
 
    NivelArvore.nivelArvore = NivelArvore.nivelArvore + '/' + key;
    this.nivel = NivelArvore.nivelArvore; 
    
    
    this.vibrate.vibrate(50);
     
 
    this.itensBasicos = this.database.list(NivelArvore.nivelArvore).snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.$key !== 'dado' && i.$key !== 'final' && i.$key !== 'tipo')
    });


    this.itensBasicos.forEach(e=>{
     
      this.lenghtArray = e.length;
      if(e.length >0){
        this.validaFinal = e[0].dado; 
      }
      
       
      
      if(this.validaFinal == undefined){
       this.navCtrl.setRoot(PrepararDadosPage,{nivelArvore:NivelArvore.nivelArvore});
       
      }

    });

    if(NivelArvore.click === -99 ){
    NivelArvore.arrayAntigo = NivelArvore.arrayTotal[NivelArvore.clicked] ;
    this.arrayAntigo = NivelArvore.arrayAntigo;
    NivelArvore.positionSteps++;
    this.positionSteps = NivelArvore.positionSteps;
      if( NivelArvore.positionOld[NivelArvore.positionOld.length-1] ===0){
        NivelArvore.positionOld.splice(-1,1);
        NivelArvore.mapArrayAntigo.splice(-1,1);
      }
    NivelArvore.positionOld.push(NivelArvore.positionSteps);
    NivelArvore.mapArrayAntigo.push(NivelArvore.arrayAntigo);
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    }
    else if(  NivelArvore.clicked !== 0){
      console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
      NivelArvore.arrayAntigo = NivelArvore.arrayTotal[NivelArvore.clicked] ;
      this.arrayAntigo = NivelArvore.arrayAntigo;
      NivelArvore.positionSteps = 0;
      NivelArvore.positionSteps++;  
      this.positionSteps = NivelArvore.positionSteps;
      NivelArvore.positionOld.push(NivelArvore.positionSteps);
      NivelArvore.mapArrayAntigo.push(NivelArvore.arrayAntigo);
    }
    else{ 
      console.log('ccccccccccccccccccccccccccccccccccccccccccccc')
      NivelArvore.positionSteps++;    
      //NivelArvore.mapArrayAntigo.push(NivelArvore.arrayAntigo);
      NivelArvore.positionOld[NivelArvore.positionOld.length-1]++;
      this.positionSteps = NivelArvore.positionSteps;
    }
     
    
    NivelArvore.arrayTotal = [];
    this.arrayTotal = NivelArvore.arrayTotal;
    this.steps();   
    this._slides.slideTo(0,1,true);
    console.log('novoArrayPath',NivelArvore.positionOld);
    console.log('novoArrayold',NivelArvore.mapArrayAntigo);
  }

  ionViewDidLoad() {
     
  }

  sairNivel(){
    this.vibrate.vibrate(50);
    this.arrayPath = NivelArvore.nivelArvore.split('/');
    this.arrayPath.splice(-1,1);
    NivelArvore.nivelArvore = this.arrayPath.join('/');
  
      this.itensBasicos = this.database.list(NivelArvore.nivelArvore).snapshotChanges().map(arr => {
        return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.$key !== 'dado' && i.$key !== 'final' && i.$key !== 'tipo')
      });

      this.itensBasicos.forEach(e =>{
        this.lenghtArray = e.length;
      });

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
       console.log('novoArrayPath',NivelArvore.positionOld);
       console.log('novoArrayold',NivelArvore.mapArrayAntigo);
        this.navCtrl.setRoot(HomePage,{iniciarPostion:false});
    
  }



}
