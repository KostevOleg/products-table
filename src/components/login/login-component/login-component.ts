import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  returnUrl : string| null = this.route.snapshot.queryParamMap.get('returnUrl')
  destroyRef= inject(DestroyRef)
  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })
  onLogin(){
       if (this.loginForm.invalid) {
      return;
    }
    const formValue = this.loginForm.getRawValue()
    this.auth.login(formValue.userName!, formValue.password!).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(()=>{
      this.router.navigateByUrl(this.returnUrl ?? 'nome');
    })
  }
}
