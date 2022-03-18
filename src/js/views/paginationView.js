import View from './View.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkUp() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // first page with next btns
    if (currentPage === 1 && numPages > 1)
      return `
          <button class="btn--inline pagination__btn--next" data-goto = ${
            currentPage + 1
          }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            <span>Page ${currentPage + 1}</span>
          </button>
  `;

    // others page with prev and next btns
    if (currentPage < numPages)
      return `
          <button class="btn--inline pagination__btn--next" data-goto = ${
            currentPage + 1
          }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            <span>Page ${currentPage + 1}</span>
          </button>

          <button class="btn--inline pagination__btn--prev"  data-goto = ${
            currentPage - 1
          }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
    `;

    // last page with prev btn
    if (currentPage === numPages && numPages > 1)
      return `
        <button class="btn--inline pagination__btn--prev"  data-goto = ${
          currentPage - 1
        }>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
  `;

    // only if less than 10 results
    return '';
  }

  addHandleClickPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotTopage = +btn.dataset.goto;
      handler(gotTopage);
    });
  }
}
export default new PaginationView();
