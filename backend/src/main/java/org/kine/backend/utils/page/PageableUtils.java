package org.kine.backend.utils.page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageableUtils {

    public static Pageable createPageable(int page, int size, String sort, String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromOptionalString(direction)
                .orElse(Sort.Direction.DESC);
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(sortDirection, sort));
        return pageable;
    }

}