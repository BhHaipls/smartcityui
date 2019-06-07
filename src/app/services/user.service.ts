import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  regUser(user) {
    this.http.post('http://localhost:8080/smartcity_war/registration', user).subscribe((res) => {
      console.log(res);
    });
  }

  authUser(user) {
    this.http.post<any>('http://localhost:8080/smartcity_war/auth/signin', user, { observe: 'response' }).forEach((res) => {
      localStorage.setItem('token', res.body.token);
      localStorage.setItem('email', res.body.username);
    });
  }

  getUserbyId(id) {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/?email=' + id, { headers });
  }

  getAuthenticatedUser() {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/get-current', { headers });
  }

  getUserbyEmail(email) {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/?email=' + email, { headers });
  }

  getAllUsers() {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/all', { headers });
  }

  deleteUser(id) {
    let headers = this.getAuthHeader();
    return this.http.delete('http://localhost:8080/smartcity_war/users/' + id, { headers });
  }

  updateUser(user: any, id: Number) {
    let headers = this.getAuthHeader();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:8080/smartcity_war/users/' + id, user, { headers });
  }

  getRoles(id) {
    let headers = this.getAuthHeader();
    return this.http.get('http://localhost:8080/smartcity_war/users/' + id + '/get-roles', { headers });
  }

  setRoles(roles, id) {
    let headers = this.getAuthHeader();
    return this.http.put('http://localhost:8080/smartcity_war/users/' + id + '/set-roles', roles, { headers });
  }

  private getAuthHeader() {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token')) {
      return headers = headers.append('authorization', 'Bearer ' + localStorage.getItem('token'));
    }
  }
}
