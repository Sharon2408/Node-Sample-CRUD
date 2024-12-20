// src/app/questionnaire/questionnaire.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireComponent } from './questions/questions.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
@NgModule({
  declarations: [QuestionnaireComponent], 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuestionnaireRoutingModule
  ],
  exports: []
})
export class QuestionnaireModule { }
