import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MatSliderModule} from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AyahService } from './ayah.service';
import { AyahComponent } from './ayah/ayah.component';
import { Ng5SliderModule } from 'ng5-slider';



@NgModule({
  declarations: [
    AppComponent,
    AyahComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    // MatSliderModule,
    BrowserAnimationsModule,
    Ng5SliderModule,


  ],
  providers: [AyahService],
  bootstrap: [AppComponent]
})
export class AppModule { }
