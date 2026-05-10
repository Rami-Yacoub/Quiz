import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { ThemePalette } from '@angular/material/core';
import { CategoryService } from '../../../services/category.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../../../services/question.service';
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { MatNativeDatetimeModule } from '@mat-datetimepicker/core';


@Component({
  selector: 'app-update-quiz',
  standalone: true,
  imports: [MatCardModule,MatListModule,MatIconModule,MatButtonModule,RouterLink
  ,CommonModule,MatFormFieldModule,FormsModule,MatInputModule,MatSlideToggleModule
,MatSelectModule,MatDatetimepickerModule,MatNativeDatetimeModule,HttpClientModule],
  templateUrl: './update-quiz.component.html',
  styleUrl: './update-quiz.component.css'
})
export class UpdateQuizComponent implements OnInit{

  constructor(private route:ActivatedRoute,private quizService:QuizService
    ,private categoryService:CategoryService,private router:Router,
    private http: HttpClient, private snack: MatSnackBar, private questionService: QuestionService){}

  qid=0;
  quiz: any;
  categories:any;
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  scheduledTime: Date | undefined;

  ngOnInit(): void {
    this.qid=this.route.snapshot.params['qid'];
    this.quizService.getQuiz(this.qid).subscribe(
      (data:any)=>{
        this.quiz=data;
        if (!this.quiz.questions) {
          this.quiz.questions = [];
        }
        
        // Fetch existing questions
        this.questionService.getQuestionsOfQuiz(this.qid).subscribe(
          (questions: any) => {
            this.quiz.questions = questions;
          },
          (err) => {
            console.log("Error loading questions", err);
          }
        );

        this.scheduledTime = new Date(this.quiz.scheduledDate);
        this.scheduledTime.setHours(this.quiz.scheduledHour);
        this.scheduledTime.setMinutes(this.quiz.scheduledMinute);
      },
      (error)=>{
        console.log(error);
      }
    );

    this.categoryService.categories().subscribe((data:any)=>{
      this.categories=data;
    },
    (error)=>{
      alert("Error occured while loading categories");
    }
    )
  }


  loadQuiz(): void {
    this.quizService.getQuiz(this.qid).subscribe(
      (data: any) => {
        this.quiz = data;
        if (!this.quiz.questions) {
          this.quiz.questions = [];
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  aiPrompt: string = '';
  isGenerating: boolean = false;
  showAiChat: boolean = false;

  toggleAiChat() {
    this.showAiChat = !this.showAiChat;
  }

  generateWithAI() {
    if (!this.aiPrompt.trim()) {
      this.snack.open("Please enter a topic or prompt for the AI!", '', { duration: 3000 });
      return;
    }

    this.isGenerating = true;

    this.http.post<any[]>('http://localhost:8080/chatbot/generate', { prompt: this.aiPrompt })
      .subscribe({
        next: (response) => {
          let parsedResponse = response;
          if (typeof response === 'string') {
            try { parsedResponse = JSON.parse(response); } catch (e) {}
          }

          if (parsedResponse && Array.isArray(parsedResponse) && parsedResponse.length > 0) {
            parsedResponse.forEach(q => this.quiz.questions.push(q));
            this.snack.open(`AI successfully generated ${parsedResponse.length} question(s)!`, '', { duration: 3000, panelClass: ['success-snackbar'] });
          } else {
            this.snack.open("AI returned an empty response. Try a different prompt.", '', { duration: 3000 });
          }
          this.isGenerating = false;
          this.aiPrompt = '';
        },
        error: (err) => {
          console.error(err);
          this.snack.open("Error connecting to AI. Please try again.", '', { duration: 3000 });
          this.isGenerating = false;
        }
      });
  }

  addQuestion() {
    this.quiz.questions.push({
      content: '', option1: '', option2: '', option3: '', option4: '', answer: ''
    });
  }

  removeQuestion(index: number) {
    this.quiz.questions.splice(index, 1);
  }

  public updateQuiz()
  {
    this.quizService.updateQuiz(this.qid,this.quiz).subscribe(
      (data:any)=>{
        Swal.fire("Updated","Quiz updated","success").then((e)=>{
          this.router.navigate(["/adminDashboard/quiz"]);
        });
      },
      (error)=>{
        Swal.fire("Error","Error Occured!!","error");
        console.log(error);
      }
    )
    if (this.scheduledTime) {
      const now = new Date();
      const scheduledDate = this.scheduledTime;
      const timeDifference = scheduledDate.getTime() - now.getTime();

      if (timeDifference > 0) {
        setTimeout(() => {
          console.log("Quiz scheduled time reached. Updating quiz...");
        }, timeDifference);
      } else {
        console.warn("Scheduled time has already passed!");
      }
    }
  }
}


  

