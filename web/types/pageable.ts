/**
 * Generic pageable response from backend
 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  currentPage: number;
  sort: string;
  direction: SortDirection;
  empty?: boolean;
  first?: boolean;
  last?: boolean;
}

/**
 * Sort direction options
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Page request parameters for API calls
 */
export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
  direction?: SortDirection;
  keyword?: string;
}

/**
 * Default page request values
 */
export const DEFAULT_PAGE_REQUEST: PageRequest = {
  page: 0,
  size: 10,
  sort: 'lastName',
  direction: 'ASC'
};

/**
 * Creates pagination query params for API requests
 * @param pageRequest The page request options
 * @returns URLSearchParams object with pagination parameters
 */
export function createPaginationParams(pageRequest: PageRequest): URLSearchParams {
  const params = new URLSearchParams();
  
  params.append('page', pageRequest.page.toString());
  params.append('size', pageRequest.size.toString());
  
  if (pageRequest.sort) {
    params.append('sort', `${pageRequest.sort},${pageRequest.direction || 'ASC'}`);
  }
  
  if (pageRequest.keyword) {
    params.append('keyword', pageRequest.keyword);
  }
  
  return params;
}

/**
 * Creates a next page request based on current page
 * @param currentPage The current page response
 * @returns PageRequest for the next page or null if on last page
 */
export function nextPage<T>(currentPage: PageResponse<T>): PageRequest | null {
  if (currentPage.currentPage >= currentPage.totalPages - 1) {
    return null; // Already on last page
  }
  
  return {
    page: currentPage.currentPage + 1,
    size: currentPage.size,
    sort: currentPage.sort,
    direction: currentPage.direction
  };
}

/**
 * Creates a previous page request based on current page
 * @param currentPage The current page response
 * @returns PageRequest for the previous page or null if on first page
 */
export function prevPage<T>(currentPage: PageResponse<T>): PageRequest | null {
  if (currentPage.currentPage <= 0) {
    return null; // Already on first page
  }
  
  return {
    page: currentPage.currentPage - 1,
    size: currentPage.size,
    sort: currentPage.sort,
    direction: currentPage.direction
  };
}

/**
 * Checks if the current page has a next page
 * @param pageResponse The current page response
 * @returns true if there is a next page available
 */
export function hasNextPage<T>(pageResponse: PageResponse<T>): boolean {
  return pageResponse.currentPage < pageResponse.totalPages - 1;
}

/**
 * Checks if the current page has a previous page
 * @param pageResponse The current page response
 * @returns true if there is a previous page available
 */
export function hasPrevPage<T>(pageResponse: PageResponse<T>): boolean {
  return pageResponse.currentPage > 0;
}