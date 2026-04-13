package ae.vdrive.user.service.impl;

import ae.vdrive.user.dto.request.CreateCompanyRequest;
import ae.vdrive.user.dto.response.CompanyResponse;
import ae.vdrive.user.entity.Company;
import ae.vdrive.user.enums.ResourceStatus;
import ae.vdrive.user.exception.ResourceNotFoundException;
import ae.vdrive.user.mapper.CompanyMapper;
import ae.vdrive.user.repository.CompanyRepository;
import ae.vdrive.user.service.CompanyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @Override
    public CompanyResponse createCompany(CreateCompanyRequest request, UUID creatorUserId) {
        log.info("Creating new company: {}", request.getName());

        Company company = Company.builder()
                .name(request.getName())
                .tenantId(request.getTenantId())
                .status(ResourceStatus.ACTIVE)
                .contactEmail(request.getContactEmail())
                .createdBy(creatorUserId)
                .build();

        Company savedCompany = companyRepository.save(company);
        log.info("Company created successfully with id: {}", savedCompany.getId());

        return companyMapper.toCompanyResponse(savedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompany(UUID companyId) {
        log.info("Fetching company with id: {}", companyId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        return companyMapper.toCompanyResponse(company);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {
        log.info("Fetching all companies");

        return companyRepository.findAll().stream()
                .map(companyMapper::toCompanyResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getCompaniesByTenant(UUID tenantId) {
        log.info("Fetching companies for tenant: {}", tenantId);

        return companyRepository.findAllByTenantId(tenantId).stream()
                .map(companyMapper::toCompanyResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CompanyResponse updateCompany(UUID companyId, CreateCompanyRequest request) {
        log.info("Updating company with id: {}", companyId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        company.setName(request.getName());
        company.setContactEmail(request.getContactEmail());

        Company updatedCompany = companyRepository.save(company);
        log.info("Company updated successfully: {}", companyId);

        return companyMapper.toCompanyResponse(updatedCompany);
    }

    @Override
    public void deleteCompany(UUID companyId) {
        log.info("Deleting company with id: {}", companyId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        companyRepository.delete(company);
        log.info("Company deleted successfully: {}", companyId);
    }
}
