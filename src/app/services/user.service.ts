import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/User';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {
  }

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  refreshUsernameOnNavbar(user: User): void {
    this.change.emit(user);
  }

  regUser(user) {
   return this.http.post('http://localhost:8080/smartcity_war/registration', user)
    .pipe(catchError(this.errorHandler));
  }

  authUser(user) {
    return this.http.post<any>('http://localhost:8080/smartcity_war/auth/signin', user)
      .pipe(catchError(this.errorHandler));
  }

  getUserbyId(id) {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/' + id, {headers});
  }

  getAuthenticatedUser(): Observable<User> {
    let headers = this.getAuthHeader();
    return this.http.get<User>('http://localhost:8080/smartcity_war/users/get-current', { headers });
  }

  getUserbyEmail(email) {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/?email=' + email, { headers });
  }

  getAllUsers(): Observable<any> {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/all', { headers });
  }

  deleteUser(id) {
    let headers = this.getAuthHeader();
    return this.http.delete('http://localhost:8080/smartcity_war/users/' + id, { headers });
  }

  updateUser(user: User): Observable<User> {
    let headers = this.getAuthHeader();
    headers.append('Content-Type', 'application/json');
    return this.http.put<User>('http://localhost:8080/smartcity_war/users/update-profile', user, { headers })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error|| "Server error");
  }

  activateUser(id: Number) {
    let headers = this.getAuthHeader();
    headers.append('Content-type', 'application/json');
    return this.http.post('http://localhost:8080/smartcity_war/users/activate/' + id, null, { headers });
  }

  getRoles(id) {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/' + id + '/get-roles', { headers });
  }

  setRoles(roles, id) {
    let headers = this.getAuthHeader();
    return this.http.put('http://localhost:8080/smartcity_war/users/' + id + '/set-roles', roles, { headers });
  }

  getUsersByOrganizationId(organizationId: any): Observable<any> {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/organization/' + organizationId, { headers });
  }

  getUsersByRoleId(id): Observable<any> {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/role/' + id, { headers });
  }

  private getAuthHeader() {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token')) {
      return headers = headers.append('authorization', 'Bearer ' + localStorage.getItem('token'));
    }
  }
}
