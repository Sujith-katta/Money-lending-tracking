package com.Money.Lending.service;


import com.Money.Lending.model.Repayment;
import com.Money.Lending.repository.RepaymentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RepaymentService {
    private final RepaymentRepository repo;
    public RepaymentService(RepaymentRepository repo) { this.repo = repo; }
    public List<Repayment> listAll() { return repo.findAll(); }
    public Optional<Repayment> get(Long id) { return repo.findById(id); }
    public Repayment save(Repayment r) { return repo.save(r); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Repayment> findByBorrowingId(Long borrowingId) { return repo.findByBorrowingId(borrowingId); }
}
