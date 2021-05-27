import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IFrontera, IPais } from '../../interfaces/pais.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {
  
  sub!: Subscription;
  paisForm!: FormGroup;
  errorMessage: string = '';
  cargando: boolean = false;
  regiones: string[]  = [];
  paises: IPais[] = [];
  fronteras: IPais[] = [];

  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.paisForm = this.fb.group({
      region: ['', Validators.required],
      pais: ['', Validators.required],
      frontera: ['', Validators.required],
     })
     this.regiones = this.paisesService.regiones

     this.paisForm.get('region')?.valueChanges.subscribe( region => {
        this.cargando = true
        this.procesarCambioDeRegion(region)
     })

    this.paisForm.get('pais')?.valueChanges.subscribe( code => {
      this.cargando = true
      this.procesarCambioDePais(code)
    })
    
  }
  
  procesarCambioDeRegion(region: string){
     this.paisForm.get('pais')?.reset('')
     this.sub = this.paisesService.getPaisPorRegion(region).subscribe({
       next: paises => this.paises = paises,
       error: err => this.errorMessage = err
     })
     this.cargando = false
  }

  procesarCambioDePais(code: string) {
    this.paisForm.get('frontera')?.reset('')
    this.sub = this.paisesService.getFronterasPorCode(code).pipe(
      switchMap(frontera => this.paisesService.getPaisesPorCode(frontera.borders))
    ).subscribe({
      next: paises => this.fronteras = paises,
      error: err => this.errorMessage = err
    })
    this.cargando = false
  }
  

  guardar(){
    console.log(this.paisForm.value)
   
  }

}
