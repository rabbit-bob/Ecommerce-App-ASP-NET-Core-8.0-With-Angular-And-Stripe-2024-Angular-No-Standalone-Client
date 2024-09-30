import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HomeModule,
    NgxSpinnerModule
  ],
  providers: [
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor, jwtInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
