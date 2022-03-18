class SearchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
    this._parentEl.querySelector('.search__field').blur();
  }
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
