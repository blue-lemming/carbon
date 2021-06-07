import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TreasureComponent } from './treasure/treasure.component';

@NgModule({
    declarations: [
        AppComponent,
        TreasureComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }