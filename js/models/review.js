/**
 * Review class describes a single review entity
 */
export class Review {
  constructor(obj) {
    this.id = obj.id;
    this.restaurantId = obj.restaurantId || obj.restaurant_id;
    this.name = obj.name;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.rating = obj.rating;
    this.comments = obj.comments;
  }

  get date() {
    const date = new Date(this.createdAt);
    const month = date.toLocaleString('en-us', { month: 'long' });
    return `${month} ${date.getDay()}, ${date.getFullYear()}`;
  }
}
