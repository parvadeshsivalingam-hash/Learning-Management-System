package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.CertificateDto;
import com.lms.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/api/student/certificates/generate/{courseId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CertificateDto>> generateCertificate(@PathVariable Long courseId, Authentication authentication) {
        CertificateDto cert = certificateService.generateCertificate(courseId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Certificate generated successfully", cert));
    }

    @GetMapping("/api/student/certificates")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CertificateDto>>> getStudentCertificates(Authentication authentication) {
        List<CertificateDto> certs = certificateService.getStudentCertificates(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Student certificates retrieved", certs));
    }

    @GetMapping("/api/certificates/verify/{certificateNumber}")
    public ResponseEntity<ApiResponse<CertificateDto>> verifyCertificate(@PathVariable String certificateNumber) {
        CertificateDto cert = certificateService.getCertificateByNumber(certificateNumber);
        return ResponseEntity.ok(ApiResponse.success("Certificate verified", cert));
    }
}
