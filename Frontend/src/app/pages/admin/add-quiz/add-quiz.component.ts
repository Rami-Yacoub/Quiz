import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { CategoryService } from '../../../services/category.service';
import { QuizService } from '../../../services/quiz.service';


@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,MatListModule,MatIconModule,RouterLink,
  CommonModule,MatFormFieldModule,FormsModule,MatInputModule,MatSlideToggleModule,
   MatSelectModule, HttpClientModule],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.css'
})
export class AddQuizComponent implements OnInit{

  constructor(private categoryService:CategoryService,private snack:MatSnackBar,
    private quizService:QuizService, private http: HttpClient){}
  ngOnInit(): void {
    this.categoryService.categories().subscribe((data:any)=>{
        this.categories=data;
    },
    (error)=>{
      console.log(error);
      Swal.fire("Error!!","error occured","error");
    }
    
    )
  }

  categories=[
    {
      cid:'',
      title:''
    }
  ]

  quizData: any = {
    title: '',
    description: '',
    maxMarks: '',
    numberOfQuestions: '',
    active: true,
    category: {
      cid: '',
    },
    questions: []
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

    // Call the real Spring Boot backend connected to Gemini API
    this.http.post<any[]>('http://localhost:8080/chatbot/generate', { prompt: this.aiPrompt })
      .subscribe({
        next: (response) => {
          // If response is a string, parse it. (Sometimes backend string returns aren't parsed automatically)
          let parsedResponse = response;
          if (typeof response === 'string') {
            try {
              parsedResponse = JSON.parse(response);
            } catch (e) {
              console.error("Failed to parse JSON:", e);
            }
          }

          if (parsedResponse && Array.isArray(parsedResponse) && parsedResponse.length > 0) {
            // Push the generated questions into the array
            parsedResponse.forEach(q => this.quizData.questions.push(q));
            this.snack.open(`AI successfully generated ${parsedResponse.length} question(s)!`, '', { duration: 3000, panelClass: ['success-snackbar'] });
          } else {
            this.snack.open("AI returned an empty response. Try a different prompt.", '', { duration: 3000 });
          }
          this.isGenerating = false;
          this.aiPrompt = ''; // clear prompt
        },
        error: (err) => {
          console.error(err);
          this.snack.open("Error connecting to AI. Please try again.", '', { duration: 3000 });
          this.isGenerating = false;
        }
      });
  }

  addQuestion() {
    this.quizData.questions.push({
      content: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: ''
    });
  }

  removeQuestion(index: number) {
    this.quizData.questions.splice(index, 1);
  }

  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;

  public addQuiz(){
    if(this.quizData.title.trim()==null || this.quizData.title==''){
      this.snack.open("Title should not empty!!","",{
        duration:3000
      });
      return;
    }

    this.quizService.addQuiz(this.quizData).subscribe((data)=>{
        Swal.fire("Success","Quiz Added","success");
        this.quizData = {
          title: '',
          description: '',
          maxMarks: '',
          numberOfQuestions: '',
          active: true,
          category: {
            cid: '',
          },
          questions: []
        }
    },
    (error)=>{
      Swal.fire("Error","Error occured!!","error");
      console.log(error);
    })
  }
}


