// Импортируем необходимые модули и компоненты
import { CommonModule } from '@angular/common'; // Модуль, предоставляющий общие директивы, такие как *ngIf и *ngFor
import { Component } from '@angular/core'; // Импортируем Component для создания компонента, inject для инъекции зависимостей, и OnInit для обработки логики при инициализации компонента
import { RouterOutlet } from '@angular/router'; // Импортируем RouterOutlet для работы с маршрутизацией в приложении
import { ProfileCardComponent } from './common-ui/profile-card/profile-card.component'; // Импортируем компонент для отображения профиля

// Декоратор @Component указывает, что это класс компонента
@Component({
  selector: 'app-root', // Селектор, используемый для внедрения этого компонента в HTML
  standalone: true, // Указывает, что этот компонент не принадлежит какому-либо модулю
  imports: [RouterOutlet, ProfileCardComponent, CommonModule], // Импортируем используемые в шаблоне компоненты и модули
  templateUrl: './app.component.html', // Шаблон компонента
  styleUrls: ['./app.component.scss'], // Стили компонента
})
export class AppComponent {}
