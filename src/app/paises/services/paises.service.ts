import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import {tap, catchError} from 'rxjs/operators'
import { IFrontera, IPais } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
 
  private _baseUrl: string = 'https://restcountries.eu/rest/v2'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ]

  get regiones(): string[] {
    return [...this._regiones]
  }

  constructor(private http: HttpClient) { }

  /*Para obtener el listado de paises pertencientes a un continente */

  getPaisPorRegion(region: string): Observable<IPais[]>{
    const url = `${this._baseUrl}/region/${region}?fields=name;alpha3Code`
    return this.http.get<IPais[]>(url).pipe(
      tap(resp => console.log("Getting country by region..", JSON.stringify(resp))),
      catchError(this.handleError)
    )
  }

  /*Para obtener las fronteras de un pais seleccionado */

  getFronterasPorCode(code: string): Observable<IFrontera>{
    const url = `${this._baseUrl}/alpha/${code}?fields=borders`
    return this.http.get<IFrontera>(url).pipe(
      tap(resp => console.log("Getting borders by country code..", JSON.stringify(resp))),
      catchError(this.handleError)
    )
  }

  /*Para obterner un pais por su codigo 
    Ejemplo: recibimos code: ESP
             retornamos {name: España, alphaCode: ESP}     
  */
  getPaisPorCode(code: string): Observable<IPais> {
    const url = `${this._baseUrl}/alpha/${code}?fields=name;alpha3Code`;
    return this.http.get<IPais>(url).pipe(
      tap(resp => console.log("Getting country by codec..", JSON.stringify(resp))),
      catchError(this.handleError)
    )
  }

  /* Para convertir el array de Pais Codes por un Array de nombres de Pais
    Ejemplo: Recibimos ["ESP", "ARG", "BOL"]
             Retornamos[{name: Espana, code: ESP},...]
      con combineLatest rxjs operators podemos retornar el valor 
      de todos los observables almacenados en el array peticiones..
      
  */
  getPaisesPorCode(borders: string[]): Observable<IPais[]> {
    if(!borders){
      //si no hay "borders" retornamos con el operador of un Observable con [] de valor
      return of([])
    }
    //creamos un array de Observables de Tipo <IPais> para almacenar 
    //cada observable devuelto en getPaisPorCode(code)
    const peticiones : Observable<IPais>[] = []


    borders.forEach(code => {
      //peticion almacena un Observable<IPais>..Ejemplo si code = ESP el valor de peticion es un 
      //observable con el valor {name: Espana, code: ESP}
      const peticion = this.getPaisPorCode(code)
      //almacenamos el valor de peticion en nuestro array de peticiones..
      peticiones.push(peticion)
    })
    //retornamos un Obervable con el valor de cada una de las peticiones procesadas
    //en la function getPaisPorCode al subscribirnos a este Observable obtenemos un arreglo como este:
    //[{name: Cuba, code: CUB},...]
    return combineLatest(peticiones)
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = ''
    if(err.error instanceof ErrorEvent){
      errorMessage = `An error ocurred: ${err.error.message}`
    }
    else{
      errorMessage = `Server return code: ${err.status}, error mesagge is: ${err.message}`
    }

    return throwError(errorMessage)
  }
}
