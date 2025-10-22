package com.Money.Lending.service;


import com.Money.Lending.model.Borrower;
import com.Money.Lending.repository.BorrowerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowerService {
    private final BorrowerRepository repo;
    public BorrowerService(BorrowerRepository repo) { this.repo = repo; }
    public List<Borrower> listAll() { return repo.findAll(); }
    public Optional<Borrower> get(Long id) { return repo.findById(id); }
    public Borrower save(Borrower b) { return repo.save(b); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Borrower> searchByName(String q) { return repo.findByNameContainingIgnoreCase(q); }
}
