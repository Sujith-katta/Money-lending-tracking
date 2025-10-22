-- src/main/resources/data.sql (initial sample data)
INSERT INTO borrower (id, name, relation, notes) VALUES (1, 'Isabella Martinez', 'Family', 'Long term');
INSERT INTO borrower (id, name, relation, notes) VALUES (2, 'Robert Miller', 'Other', '');
INSERT INTO borrower (id, name, relation, notes) VALUES (3, 'James Smith', 'Colleague', '');

INSERT INTO borrowing (id, borrower_id, title, amount, interest_rate, interest_cycle, date_borrowed, repayment_date, status)
VALUES (1, 1, '1st Borrowing', 7500.00, 5.0, 'ANNUALLY', '2024-07-12', '2025-07-12', 'PENDING');
INSERT INTO borrowing (id, borrower_id, title, amount, interest_rate, interest_cycle, date_borrowed, repayment_date, status)
VALUES (2, 2, '1st Borrowing', 750.00, 0.0, 'NONE', '2023-09-18', '2023-09-18', 'REPAID');

INSERT INTO repayment (id, borrowing_id, amount_repaid, date_repaid, notes)
VALUES (1, 2, 750.00, '2023-09-18', 'Paid in full');
