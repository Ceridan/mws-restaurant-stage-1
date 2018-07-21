/**
 * ScriptLoader class allows to load js files (usually needed for conditional or defered loading)
 */
export class ScriptLoader {
  /**
   * Loads single js file
   * @param {string} url script url
   * @returns {Promise<void>} with the result of loading operation
   */
  static loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.onload = () => {
        resolve();
      };

      script.onerror = function() {
        reject();
      };

      script.src = url;
      document.body.appendChild(script);
    });
  }
}
