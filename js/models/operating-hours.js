/**
 * OperatingHours class describes an operating hours during the week
 */
export class OperatingHours {
  constructor({Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}) {
    this.Monday = Monday;
    this.Tuesday = Tuesday;
    this.Wednesday = Wednesday;
    this.Thursday = Thursday;
    this.Friday = Friday;
    this.Saturday = Saturday;
    this.Sunday = Sunday;
  }
}
