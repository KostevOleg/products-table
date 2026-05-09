import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PaginationComponent } from './pagination-component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.page = 2;
    component.totalPages = 5;
    component.visiblePages = [1, 2, 3];
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('emits the previous page when available', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.previousPage();

    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('does not emit a previous page before the first page', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');
    component.page = 0;

    component.previousPage();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('emits a selected page when it differs from the current one', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.goToPage(3);

    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('does not emit the current page again', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.goToPage(2);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('emits the next page while there are pages left', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.nextPage();

    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('does not emit past the last page', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');
    component.page = 4;

    component.nextPage();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
