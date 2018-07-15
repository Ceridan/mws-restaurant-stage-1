/**
 * Guid class represents the methods to work with GUIDs
 */
export class Guid {
  /**
   * Generates new GUID
   * Referals: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   * @returns {string} guid string
   */
  static NewGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * Represents GUID with all zero values
   * @returns {string} guid string
   */
  static EmptyGuid() {
    return '00000000-0000-0000-0000-000000000000';
  }

  /**
   * Check if the guid passed as a parameter is empty
   * @param {string} guid string representation of the guid
   * @returns {boolean}
   */
  static IsEmpty(guid) {
    return guid === EmptyGuid();
  }
}
