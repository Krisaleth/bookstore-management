package com.example.bookbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Long id;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private Long bookId;
    private String bookTitle;
}

