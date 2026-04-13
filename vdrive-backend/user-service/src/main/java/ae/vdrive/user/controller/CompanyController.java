package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.CreateCompanyRequest;
import ae.vdrive.user.dto.response.CompanyResponse;
import ae.vdrive.user.dto.response.MessageResponse;
import ae.vdrive.user.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @Valid @RequestBody CreateCompanyRequest request,
            @RequestHeader("X-User-Id") UUID creatorUserId) {
        log.info("Creating company: {}", request.getName());
        CompanyResponse response = companyService.createCompany(request, creatorUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<CompanyResponse> getCompany(@PathVariable UUID companyId) {
        log.info("Fetching company: {}", companyId);
        CompanyResponse response = companyService.getCompany(companyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        log.info("Fetching all companies");
        List<CompanyResponse> response = companyService.getAllCompanies();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<CompanyResponse>> getCompaniesByTenant(@PathVariable UUID tenantId) {
        log.info("Fetching companies for tenant: {}", tenantId);
        List<CompanyResponse> response = companyService.getCompaniesByTenant(tenantId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable UUID companyId,
            @Valid @RequestBody CreateCompanyRequest request) {
        log.info("Updating company: {}", companyId);
        CompanyResponse response = companyService.updateCompany(companyId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<MessageResponse> deleteCompany(@PathVariable UUID companyId) {
        log.info("Deleting company: {}", companyId);
        companyService.deleteCompany(companyId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Company deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
