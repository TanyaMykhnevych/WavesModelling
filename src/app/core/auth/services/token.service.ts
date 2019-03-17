import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {

    constructor() { }

    public get token(): string {
        return localStorage.getItem('token');
    }

    public set token(value: string) {
        localStorage.setItem('token', value);
    }

    public clearToken(): void {
        localStorage.removeItem('token');
    }

}
