package com.example.bookbe.service;

import com.example.bookbe.dto.BookDto;
import com.example.bookbe.entity.Author;
import com.example.bookbe.entity.Book;
import com.example.bookbe.entity.Category;
import com.example.bookbe.repository.AuthorRepository;
import com.example.bookbe.repository.BookRepository;
import com.example.bookbe.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public BookDto createBook(BookDto bookDto) {
        Book book = new Book();
        book.setTitle(bookDto.getTitle());
        book.setDescription(bookDto.getDescription());
        book.setPrice(bookDto.getPrice());
        book.setStock(bookDto.getStock());
        book.setIsbn(bookDto.getIsbn());
        book.setPublicationDate(bookDto.getPublicationDate());
        book.setImageUrl(bookDto.getImageUrl());

        Author author = authorRepository.findById(bookDto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));
        book.setAuthor(author);

        if (bookDto.getCategoryIds() != null && !bookDto.getCategoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(bookDto.getCategoryIds());
            book.setCategories(categories);
        }

        Book savedBook = bookRepository.save(book);
        return convertToDto(savedBook);
    }

    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return convertToDto(book);
    }

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BookDto> searchBooksByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BookDto> getBooksByAuthor(Long authorId) {
        return bookRepository.findByAuthorId(authorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BookDto> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BookDto> getAvailableBooks() {
        return bookRepository.findByStockGreaterThan(0).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookDto updateBook(Long id, BookDto bookDto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (bookDto.getTitle() != null) book.setTitle(bookDto.getTitle());
        if (bookDto.getDescription() != null) book.setDescription(bookDto.getDescription());
        if (bookDto.getPrice() != null) book.setPrice(bookDto.getPrice());
        if (bookDto.getStock() != null) book.setStock(bookDto.getStock());
        if (bookDto.getIsbn() != null) book.setIsbn(bookDto.getIsbn());
        if (bookDto.getPublicationDate() != null) book.setPublicationDate(bookDto.getPublicationDate());
        if (bookDto.getImageUrl() != null) book.setImageUrl(bookDto.getImageUrl());

        if (bookDto.getAuthorId() != null) {
            Author author = authorRepository.findById(bookDto.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found"));
            book.setAuthor(author);
        }

        if (bookDto.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(bookDto.getCategoryIds());
            book.setCategories(categories);
        }

        Book updatedBook = bookRepository.save(book);
        return convertToDto(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        // Delete associated image file if exists
        if (book.getImageUrl() != null && !book.getImageUrl().isEmpty()) {
            // Note: File deletion should be handled in the controller or via a service
            // This keeps the service layer clean
        }
        
        bookRepository.deleteById(id);
    }

    private BookDto convertToDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setDescription(book.getDescription());
        dto.setPrice(book.getPrice());
        dto.setStock(book.getStock());
        dto.setIsbn(book.getIsbn());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setImageUrl(book.getImageUrl());
        dto.setAuthorId(book.getAuthor().getId());
        dto.setAuthorName(book.getAuthor().getName());
        dto.setCategoryIds(book.getCategories().stream().map(Category::getId).collect(Collectors.toList()));
        dto.setCategoryNames(book.getCategories().stream().map(Category::getName).collect(Collectors.toList()));
        dto.setCreatedAt(book.getCreatedAt());
        dto.setUpdatedAt(book.getUpdatedAt());
        return dto;
    }
}

