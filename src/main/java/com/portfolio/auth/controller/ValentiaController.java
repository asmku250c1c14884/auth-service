package com.portfolio.auth.controller;

import com.portfolio.auth.model.Contact;
import com.portfolio.auth.model.Membership;
import com.portfolio.auth.repository.ContactRepository;
import com.portfolio.auth.repository.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/valentia")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ValentiaController {

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private ContactRepository contactRepository;

    @PostMapping("/membership")
    public ResponseEntity<?> applyMembership(@RequestBody Membership membership) {
        membershipRepository.save(membership);
        return ResponseEntity.ok("Membership application received successfully!");
    }

    @PostMapping("/contact")
    public ResponseEntity<?> sendContact(@RequestBody Contact contact) {
        contactRepository.save(contact);
        return ResponseEntity.ok("Contact message received successfully!");
    }
}
