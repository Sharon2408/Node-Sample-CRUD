import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import questions from 'src/assets/data/questions.json';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionnaireComponent implements OnInit {
onSubOptionChange(_t11: number,_t35: any) {
throw new Error('Method not implemented.');
}
  form!: FormGroup;
  questions: any[] = questions;
  visibleQuestions: any[] = []; // To handle dynamic rendering of follow-up questions.

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadQuestions();
  }

  // Initialize the form
  initializeForm(): void {
    this.form = this.fb.group({
      responses: this.fb.array([]),
    });
  }

  // Getter for FormArray
  get responses(): FormArray {
    return this.form.get('responses') as FormArray;
  }

  // Load initial questions (those without a follow-up dependency)
  loadQuestions(): void {
    this.visibleQuestions = this.questions.filter((q) => !q.follow_up); // Questions without follow-ups
    this.visibleQuestions.forEach((question) => this.addQuestionToForm(question));
  }

  // Add a question to the form
  addQuestionToForm(question: any): void {
    console.log(question);
    
    const group = this.fb.group({
      questionId: [question.id],
      answer: [''], // Main answer
      subAnswers: this.fb.array([]), // For multi-selection or sub-options
    });

    this.responses.push(group);
  }

  // Handle answer changes and dynamically load follow-up questions
  onAnswerChange(question: any, value: any): void {
    const followUpKey = question.follow_up ? value : null;

    // Clear existing follow-ups for the current question
    this.removeFollowUps(question.id);

    // Add follow-up if exists
    if (followUpKey && question.follow_up[followUpKey]) {
      const followUp = question.follow_up[followUpKey];
      this.visibleQuestions.push(followUp);
      this.addQuestionToForm(followUp);
    }
  }

  // Remove follow-ups for a specific question
  removeFollowUps(questionId: string): void {
    const followUpIds = this.visibleQuestions
      .filter((q) => q.rootId === questionId)
      .map((q) => q.id);

    this.visibleQuestions = this.visibleQuestions.filter((q) => !followUpIds.includes(q.id));
    this.responses.controls = this.responses.controls.filter(
      (control) => !followUpIds.includes(control.value.questionId)
    );
  }

  // Submit the form
  submitForm(): void {
    console.log('Form Value:', this.form.value);
  }
}
