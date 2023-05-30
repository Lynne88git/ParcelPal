import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PackingFormComponent } from './packing-form/packing-form.component';
import { FooterComponent } from './footer/footer.component';
import { FetchParcelDataComponent } from './fetch-parcel-data/fetch-parcel-data.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PackingFormComponent,
    FetchParcelDataComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'fetch-parcel-data', component: FetchParcelDataComponent, pathMatch: 'full' },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
