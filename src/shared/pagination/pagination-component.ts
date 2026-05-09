import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  standalone: true,
  templateUrl: './pagination-component.html',
  styleUrl: './pagination-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() page = 0;
  @Input() totalPages = 0;
  @Input() visiblePages: number[] = [];

  @Output() pageChange = new EventEmitter<number>();

  previousPage(): void {
    if (this.page > 0) {
      this.pageChange.emit(this.page - 1);
    }
  }

  goToPage(page: number): void {
    if (page !== this.page) {
      this.pageChange.emit(page);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.pageChange.emit(this.page + 1);
    }
  }
}
