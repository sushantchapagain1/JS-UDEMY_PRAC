import icons from 'url:../../img/icons.svg'; //in parcel 2 url:
export default class View {
  _data;
  /*documentation comment  syntax multine commenent and one extra *and tab  */

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const HTML = this._generateMarkUp();
    if (!render) return HTML;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', HTML);
  }

  _clearHTML() {
    this._parentElement.innerHTML = ''; // making markup empty
  }

  update(data) {
    this._data = data;
    const newHTML = this._generateMarkUp();
    const newDom = document.createRange().createContextualFragment(newHTML);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newel, i) => {
      const curEl = curElements[i];
      // for update text content
      // check if nodelist values are equal
      if (
        !newel.isEqualNode(curEl) &&
        newel.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newel.textContent;
      }
      // for other attribute
      if (!newel.isEqualNode(curEl))
        Array.from(newel.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const spinnerMarkUp = `
       <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>  
`;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkUp);
  }
  renderError(message = this._errorMessage) {
    const errorsHTML = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', errorsHTML);
  }

  renderMessage(message = this._successMessage) {
    const messageHTML = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', messageHTML);
  }
}
