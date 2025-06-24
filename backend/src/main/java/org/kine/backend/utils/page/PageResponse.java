package org.kine.backend.utils.page;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;
    private int size;
    private int currentPage;
    private String sort;
    private String direction;
}