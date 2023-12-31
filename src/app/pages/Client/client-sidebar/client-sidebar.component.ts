import { Component, EventEmitter, Output } from '@angular/core';
import { BookService } from 'src/app/SERVICE/BookService';


@Component({
  selector: 'app-client-sidebar',
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.scss']
})
export class ClientSidebarComponent {
  
  @Output() filterApplied: EventEmitter<{ category: string,author: string, priceRange: number ,rating:number }> = new EventEmitter<{ category: string,author:string, priceRange: number ,rating: number }>();
  @Output() filtersReset: EventEmitter<void> = new EventEmitter<void>();
  categories:string[];
  authors:string[];
  
  category:any ;//this is the one i select   
  author:any;
  selectedPriceRange: any
  selectedStar: any;

  constructor(private bookService: BookService){}
  ngOnInit() {
    this.loadCategories();
    this.loadAuthors();
    
  }
  
  getPercentageValue(value: number): number {
    const rangeMin = 0;
    const rangeMax = 500;
    return ((value - rangeMin) / (rangeMax - rangeMin)) * 100;
  }

  applyFilter() {
    const filterData = { category: this.category,author: this.author, priceRange: this.selectedPriceRange, rating: this.selectedStar  };
    this.filterApplied.emit(filterData);
    //console.log(filterData);
  }
  loadCategories() {
    this.bookService.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error retrieving categories:', error);
      }
    );
  }
  loadAuthors() {
    this.bookService.getAuthors().subscribe(
      (response) => {
        this.authors = response;
      },
      (error) => {
        console.error('Error retrieving authors:', error);
      }
    );
  }

  resetFilters() {
    this.category = undefined; 
    this.author = undefined;
    this.selectedPriceRange = undefined; 
    this.selectedStar=undefined;
    this.filtersReset.emit();
  }
  
  

}
