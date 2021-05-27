import { Pipe, PipeTransform } from '@angular/core';
import { PaisesService } from '../services/paises.service';
import {map} from 'rxjs/operators'
import { Observable } from 'rxjs';

@Pipe({
  name: 'nombrePais'
})
export class NombrePaisPipe implements PipeTransform {

  constructor(private paisService: PaisesService) {}

  transform(code: string): Observable<string> {
    return this.paisService.getPaisPorCode(code).pipe(
      map( resp => resp.name)
    ) 
  }

}
