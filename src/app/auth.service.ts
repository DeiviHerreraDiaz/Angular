import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly localStorageKey = 'userData';
  private readonly resetPasswordRequestsKey = 'resetPasswordRequests';
  constructor(private router: Router) {};
  private validatedEmail: string = '';

  register(userDetails: any): void {
    const existingData = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');

    const isUserExists = existingData.some((user: any) => user.username === userDetails.username);

    if (!isUserExists) {
      existingData.push(userDetails);

      localStorage.setItem(this.localStorageKey, JSON.stringify(existingData));
      alert('Registro exitoso');
    } else {
      alert('El usuario ya está registrado');
    }
  }

  login(usuario: string, contrasena: string): boolean {
    const existingData = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');

    const user = existingData.find((user: any) => user.usuario === usuario && user.contrasena === contrasena);

    return !!user;
  }

  logout(): void {
    alert('Sesión cerrada');
  }

  validateEmail(email: string): boolean {
    const existingData = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const isValid = existingData.some((user: any) => user.email === email);
  
    // Si el correo es válido, almacénalo en la propiedad validatedEmail
    if (isValid) {
      this.validatedEmail = email;
    }
  
    return isValid;
  }

  requestPasswordReset(email: string): void {
    // Verifica si el correo electrónico es válido
    if (this.validateEmail(email)) {
      // Obtén las solicitudes de restablecimiento existentes del localStorage
      const resetRequests = JSON.parse(localStorage.getItem(this.resetPasswordRequestsKey) || '[]');
  
      // Agrega la nueva solicitud con el correo electrónico y la marca de tiempo
      resetRequests.push({ email, timestamp: new Date().toISOString() });
  
      // Actualiza las solicitudes en el localStorage
      localStorage.setItem(this.resetPasswordRequestsKey, JSON.stringify(resetRequests));
  
      // Muestra un mensaje de éxito
      alert('Correo electrónico válido');
  
      // Redirige a la página de recuperación de contraseña
      this.router.navigate(['recover']);
    } else {
      // Muestra un mensaje de error si el correo electrónico no es válido
      alert('Correo electrónico no válido');
    }
  }
  

resetPassword(newPassword: string): boolean {
  // Obtén el usuario correspondiente al correo electrónico validado
  const existingData = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  const user = existingData.find((userData: any) => userData.email === this.validatedEmail);

  // Verifica si el usuario fue encontrado
  if (user) {
    // Cambia la contraseña del usuario
    user.contrasena = newPassword;

    // Actualiza los datos en el localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(existingData));

    // Elimina la solicitud de restablecimiento después de cambiar la contraseña
    const resetRequests = JSON.parse(localStorage.getItem(this.resetPasswordRequestsKey) || '[]');
    const updatedRequests = resetRequests.filter((req: any) => req.email !== this.validatedEmail);
    localStorage.setItem(this.resetPasswordRequestsKey, JSON.stringify(updatedRequests));

    // Muestra un mensaje de éxito
    alert('Contraseña restablecida exitosamente');
    return true;
  } else {
    // Muestra un mensaje de error si el usuario no fue encontrado
    alert('Error al restablecer la contraseña. Verifica tu solicitud.');
    return false;
  }
}


}