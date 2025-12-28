package com.example.bookbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String isbn;
    private LocalDateTime publicationDate;
    private String imageUrl;
    private Long authorId;
    private String authorName;
    private List<Long> categoryIds;
    private List<String> categoryNames;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

