/**
 * Guid class represents the methods to work with GUIDs
 */
export class ScriptLoader {
  static loadScript(url) {
    return ScriptLoader.loadScripts([url]);
  }

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
