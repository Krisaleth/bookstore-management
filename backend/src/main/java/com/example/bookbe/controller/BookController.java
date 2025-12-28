package com.example.bookbe.controller;

import com.example.bookbe.dto.BookDto;
import com.example.bookbe.service.BookService;
import com.example.bookbe.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<BookDto>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        try {
            BookDto book = bookService.getBookById(id);
            return ResponseEntity.ok(book);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookDto>> searchBooks(@RequestParam String title) {
        return ResponseEntity.ok(bookService.searchBooksByTitle(title));
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<BookDto>> getBooksByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(bookService.getBooksByAuthor(authorId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BookDto>> getBooksByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(bookService.getBooksByCategory(categoryId));
    }

    @GetMapping("/available")
    public ResponseEntity<List<BookDto>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<BookDto> createBook(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") String price,
            @RequestParam("stock") String stock,
            @RequestParam(value = "isbn", required = false) String isbn,
            @RequestParam("authorId") String authorId,
            @RequestParam(value = "categoryIds", required = false) String[] categoryIdsArray,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            BookDto bookDto = new BookDto();
            bookDto.setTitle(title);
            bookDto.setDescription(description);
            bookDto.setPrice(new java.math.BigDecimal(price));
            bookDto.setStock(Integer.parseInt(stock));
            bookDto.setIsbn(isbn);
            bookDto.setAuthorId(Long.parseLong(authorId));
            
            // Convert categoryIds array to List
            List<Long> categoryIds = null;
            if (categoryIdsArray != null && categoryIdsArray.length > 0) {
                categoryIds = new java.util.ArrayList<>();
                for (String id : categoryIdsArray) {
                    if (id != null && !id.isEmpty()) {
                        categoryIds.add(Long.parseLong(id));
                    }
                }
            }
            bookDto.setCategoryIds(categoryIds);
            
            if (imageFile != null && !imageFile.isEmpty()) {
                String filename = fileStorageService.storeFile(imageFile);
                bookDto.setImageUrl(filename);
            }
            
            BookDto createdBook = bookService.createBook(bookDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
        } catch (Exception e) {
            e.printStackTrace();
            // Let GlobalExceptionHandler handle the error response
            throw new RuntimeException("Failed to create book: " + e.getMessage(), e);
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<BookDto> updateBook(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) String price,
            @RequestParam(value = "stock", required = false) String stock,
            @RequestParam(value = "isbn", required = false) String isbn,
            @RequestParam(value = "authorId", required = false) String authorId,
            @RequestParam(value = "categoryIds", required = false) String[] categoryIdsArray,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Get existing book
            BookDto existingBook = bookService.getBookById(id);
            BookDto bookDto = new BookDto();
            
            bookDto.setTitle(title != null ? title : existingBook.getTitle());
            bookDto.setDescription(description != null ? description : existingBook.getDescription());
            bookDto.setPrice(price != null ? new java.math.BigDecimal(price) : existingBook.getPrice());
            bookDto.setStock(stock != null ? Integer.parseInt(stock) : existingBook.getStock());
            bookDto.setIsbn(isbn != null ? isbn : existingBook.getIsbn());
            bookDto.setAuthorId(authorId != null ? Long.parseLong(authorId) : existingBook.getAuthorId());
            
            // Convert categoryIds array to List
            List<Long> categoryIds = null;
            if (categoryIdsArray != null && categoryIdsArray.length > 0) {
                categoryIds = new java.util.ArrayList<>();
                for (String categoryIdStr : categoryIdsArray) {
                    if (categoryIdStr != null && !categoryIdStr.isEmpty()) {
                        categoryIds.add(Long.parseLong(categoryIdStr));
                    }
                }
            }
            bookDto.setCategoryIds(categoryIds != null ? categoryIds : existingBook.getCategoryIds());
            
            if (imageFile != null && !imageFile.isEmpty()) {
                // Delete old image if exists
                if (existingBook.getImageUrl() != null && !existingBook.getImageUrl().isEmpty()) {
                    try {
                        fileStorageService.deleteFile(existingBook.getImageUrl());
                    } catch (IOException e) {
                        // Log error but continue
                    }
                }
                // Store new image
                String filename = fileStorageService.storeFile(imageFile);
                bookDto.setImageUrl(filename);
            } else {
                // Keep existing image if no new file provided
                bookDto.setImageUrl(existingBook.getImageUrl());
            }
            
            BookDto updatedBook = bookService.updateBook(id, bookDto);
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Keep JSON endpoints for backward compatibility
    @PostMapping(consumes = {"application/json"}, headers = "Content-Type=application/json")
    public ResponseEntity<BookDto> createBookJson(@RequestBody BookDto bookDto) {
        try {
            BookDto createdBook = bookService.createBook(bookDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = {"application/json"}, headers = "Content-Type=application/json")
    public ResponseEntity<BookDto> updateBookJson(@PathVariable Long id, @RequestBody BookDto bookDto) {
        try {
            BookDto updatedBook = bookService.updateBook(id, bookDto);
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        try {
            // Get book to delete associated image
            BookDto book = bookService.getBookById(id);
            if (book.getImageUrl() != null && !book.getImageUrl().isEmpty()) {
                try {
                    fileStorageService.deleteFile(book.getImageUrl());
                } catch (IOException e) {
                    // Log error but continue with book deletion
                }
            }
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

