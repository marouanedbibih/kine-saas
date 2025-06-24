package org.kine.backend.utils.page;


import java.util.function.Function;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Utility class for converting Spring Data Page objects to custom PageResponse objects.
 * 
 * This mapper provides functionality to transform paginated data from Spring Data JPA
 * repositories into a standardized response format that includes pagination metadata
 * and content transformation capabilities.
 * 
 * The main purpose is to:
 * - Convert entity objects to DTOs/Response objects using a provided mapper function
 * - Extract pagination information (current page, total pages, total elements, etc.)
 * - Include sorting information from the original request
 * - Provide a consistent API response structure for paginated data
 * 
 * Example usage:
 * Page<User> userPage = userRepository.findAll(pageable);
 * PageResponse<UserResponse> response = PageMapper.toMyPageRES(
 *     userPage, 
 *     pageable, 
 *     user -> new UserResponse(user.getId(), user.getName())
 * );
 * 
 * @author Marouane Dbibih
 * @since 1.0
 * @see PageResponse
 * @see org.springframework.data.domain.Page
 * @see org.springframework.data.domain.Pageable
 */
public class PageMapper {

    public static <E, D> PageResponse<D> toMyPageRES(Page<E> page, Pageable pageable, Function<E, D> mapper) {
        return PageResponse.<D>builder()
                .content(page.getContent().stream().map(mapper).toList())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber() + 1)
                .sort(pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty() : null)
                .direction(pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getDirection().name() : null)
                .size(page.getSize())
                .build();
    }
    
}