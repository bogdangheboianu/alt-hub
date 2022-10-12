import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER, MAX_ITEMS_PER_PAGE } from '@shared/constants/pagination/pagination.constants';
import { IPageObject } from '@shared/interfaces/pagination/page-object.interface';

export const pageObject = (pageNumber?: number, itemsPerPage?: number): IPageObject => {
    pageNumber = pageNumber ?? DEFAULT_PAGE_NUMBER;
    itemsPerPage = Math.min( itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE );
    const skip = pageNumber * itemsPerPage;
    const take = itemsPerPage;

    return { skip, take };
};
