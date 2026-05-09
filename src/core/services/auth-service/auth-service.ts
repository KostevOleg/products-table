import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { tap } from "rxjs";
import { LoginResponse } from "../../../models/login-model";
import { UserInterface } from "../../../models/user-model"; 

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);
    isAuth = computed(()=>!! this.accessToken());
    user = signal<UserInterface | null>(null)
    accessToken = signal<string | null>(null);
    refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));


    login(login: string, password: string){
       return this.http.post<LoginResponse>('/auth/login', {"username":login, "password": password}).pipe(
            tap((res)=>{
                this.accessToken.set(res.accessToken),
                this.refreshToken.set(res.refreshToken),
                localStorage.setItem('refreshToken', res.refreshToken)
            })
        )
    }
    getNewAccesToken(){
        return this.http.post<LoginResponse>('/auth/refresh', {refreshToken : localStorage.getItem('refreshToken')})
    }
    getMe(){
        const token = this.accessToken();

        return this.http.get<UserInterface>('/auth/me', {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
        }).pipe(
            tap((user)=>{
                this.user.set(user)
            })
        )
    } 
    logout(){
        return this.http.get('/auth/logout').pipe(
            tap((res)=>{
                this.accessToken.set(null),
                this.user.set(null),
                this.refreshToken.set(null),
                localStorage.removeItem('refreshToken')
            })
        )
    }  
}
