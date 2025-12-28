package com.example.bookbe.util;

import com.example.bookbe.entity.Author;
import com.example.bookbe.entity.Book;
import com.example.bookbe.entity.Category;
import com.example.bookbe.entity.User;
import com.example.bookbe.repository.AuthorRepository;
import com.example.bookbe.repository.BookRepository;
import com.example.bookbe.repository.CategoryRepository;
import com.example.bookbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (authorRepository.count() == 0 && categoryRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create Authors
        Author author1 = createAuthor("J.K. Rowling", 
            "J.K. Rowling is a British author, best known for the Harry Potter fantasy series.");
        Author author2 = createAuthor("George R.R. Martin", 
            "George R.R. Martin is an American novelist and short story writer, best known for A Song of Ice and Fire.");
        Author author3 = createAuthor("J.R.R. Tolkien", 
            "J.R.R. Tolkien was an English writer, poet, philologist, and academic, best known for The Hobbit and The Lord of the Rings.");
        Author author4 = createAuthor("Stephen King", 
            "Stephen King is an American author of horror, supernatural fiction, suspense, and fantasy novels.");
        Author author5 = createAuthor("Agatha Christie", 
            "Agatha Christie was an English writer known for her detective novels and short story collections.");
        Author author6 = createAuthor("Jane Austen", 
            "Jane Austen was an English novelist known primarily for her six major novels.");
        
        List<Author> authors = Arrays.asList(author1, author2, author3, author4, author5, author6);
        authors = authorRepository.saveAll(authors);

        // Create Categories
        Category category1 = createCategory("Fantasy", 
            "Fantasy books featuring magical elements, mythical creatures, and imaginary worlds.");
        Category category2 = createCategory("Mystery", 
            "Mystery and detective novels with puzzles and crime-solving.");
        Category category3 = createCategory("Horror", 
            "Horror fiction designed to frighten, scare, or startle readers.");
        Category category4 = createCategory("Romance", 
            "Romance novels focusing on relationship and romantic love.");
        Category category5 = createCategory("Science Fiction", 
            "Science fiction exploring futuristic concepts and technologies.");
        Category category6 = createCategory("Classic Literature", 
            "Classic works of literature that have stood the test of time.");
        
        List<Category> categories = Arrays.asList(category1, category2, category3, category4, category5, category6);
        categories = categoryRepository.saveAll(categories);

        // Create Books
        createBook("Harry Potter and the Philosopher's Stone", 
            "The first book in the Harry Potter series. Follow Harry as he discovers he's a wizard and attends Hogwarts School of Witchcraft and Wizardry.",
            new BigDecimal("12.99"), 50, "978-0747532699", 
            LocalDateTime.of(1997, 6, 26, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(0), Arrays.asList(categories.get(0)));

        createBook("Harry Potter and the Chamber of Secrets", 
            "The second book in the Harry Potter series. Harry returns to Hogwarts for his second year and discovers a mysterious chamber.",
            new BigDecimal("13.99"), 45, "978-0747538493", 
            LocalDateTime.of(1998, 7, 2, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(0), Arrays.asList(categories.get(0)));

        createBook("A Game of Thrones", 
            "The first book in A Song of Ice and Fire series. Set in the fictional Seven Kingdoms of Westeros.",
            new BigDecimal("16.99"), 60, "978-0553103540", 
            LocalDateTime.of(1996, 8, 1, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(1), Arrays.asList(categories.get(0), categories.get(4)));

        createBook("A Clash of Kings", 
            "The second book in A Song of Ice and Fire series. The War of the Five Kings continues.",
            new BigDecimal("17.99"), 55, "978-0553108033", 
            LocalDateTime.of(1998, 11, 16, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(1), Arrays.asList(categories.get(0), categories.get(4)));

        createBook("The Hobbit", 
            "A fantasy novel about Bilbo Baggins, a hobbit who goes on an unexpected journey.",
            new BigDecimal("14.99"), 70, "978-0547928227", 
            LocalDateTime.of(1937, 9, 21, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(2), Arrays.asList(categories.get(0)));

        createBook("The Lord of the Rings", 
            "An epic high fantasy novel about the quest to destroy the One Ring.",
            new BigDecimal("19.99"), 65, "978-0544003415", 
            LocalDateTime.of(1954, 7, 29, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(2), Arrays.asList(categories.get(0)));

        createBook("The Shining", 
            "A horror novel about a writer who becomes the caretaker of an isolated hotel.",
            new BigDecimal("15.99"), 40, "978-0307743657", 
            LocalDateTime.of(1977, 1, 28, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(3), Arrays.asList(categories.get(2)));

        createBook("It", 
            "A horror novel about seven children who are terrorized by an evil entity.",
            new BigDecimal("16.99"), 50, "978-1501142970", 
            LocalDateTime.of(1986, 9, 15, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(3), Arrays.asList(categories.get(2)));

        createBook("Murder on the Orient Express", 
            "A detective novel featuring Hercule Poirot investigating a murder on a train.",
            new BigDecimal("13.99"), 55, "978-0062693662", 
            LocalDateTime.of(1934, 1, 1, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(4), Arrays.asList(categories.get(1)));

        createBook("And Then There Were None", 
            "A mystery novel about ten strangers who are invited to an isolated island.",
            new BigDecimal("14.99"), 60, "978-0062073488", 
            LocalDateTime.of(1939, 11, 6, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(4), Arrays.asList(categories.get(1)));

        createBook("Pride and Prejudice", 
            "A romantic novel about Elizabeth Bennet and Mr. Darcy.",
            new BigDecimal("11.99"), 75, "978-0141439518", 
            LocalDateTime.of(1813, 1, 28, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(5), Arrays.asList(categories.get(3), categories.get(5)));

        createBook("Sense and Sensibility", 
            "A novel about the Dashwood sisters and their romantic adventures.",
            new BigDecimal("12.99"), 70, "978-0141439662", 
            LocalDateTime.of(1811, 10, 30, 0, 0),
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            authors.get(5), Arrays.asList(categories.get(3), categories.get(5)));

        // Create Admin User
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@bookstore.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
        }

        // Create Test User
        if (!userRepository.existsByUsername("testuser")) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setEmail("test@bookstore.com");
            testUser.setPassword(passwordEncoder.encode("test123"));
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setRole(User.Role.USER);
            testUser.setEnabled(true);
            userRepository.save(testUser);
        }

        System.out.println("Data initialization completed!");
    }

    private Author createAuthor(String name, String biography) {
        Author author = new Author();
        author.setName(name);
        author.setBiography(biography);
        return author;
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return category;
    }

    private void createBook(String title, String description, BigDecimal price, Integer stock, 
                           String isbn, LocalDateTime publicationDate, String imageUrl, 
                           Author author, List<Category> categories) {
        Book book = new Book();
        book.setTitle(title);
        book.setDescription(description);
        book.setPrice(price);
        book.setStock(stock);
        book.setIsbn(isbn);
        book.setPublicationDate(publicationDate);
        book.setImageUrl(imageUrl);
        book.setAuthor(author);
        book.setCategories(categories);
        bookRepository.save(book);
    }
}

