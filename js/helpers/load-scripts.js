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
    return ScriptLoader.loadScripts([url]);
  }

  /**
   * Loads a bunch of js files
   * @param {Array<string>} urls array of script urls
   * @returns {Promise<void>} loads the result of operation. Succeed only if all files were loaded correctly
   */
  static loadScripts(urls) {
    if (urls.length == 0) {
      return Promise.resolve();
    }

    const scriptPromises = [];

    urls.forEach((url) => {
      const script = document.createElement('script');

      script.onload = () => {
        scriptPromises.push(Promise.resolve());
      };

      script.onerror = function() {
        scriptPromises.push(Promise.reject());
      };

      script.src = url;
      document.body.appendChild(script);
    });

    return Promise.all(scriptPromises);
  }
}
