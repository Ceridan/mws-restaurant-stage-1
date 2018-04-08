/**
 * Review class describes a single review entity
 */
export class Review {
  constructor({name, date, rating, comments}) {
    this.name = name;
    this.date = date;
    this.rating = rating;
    this.comments = comments;
  }
}
