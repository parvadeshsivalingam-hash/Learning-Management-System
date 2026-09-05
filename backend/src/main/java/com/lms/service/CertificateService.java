package com.lms.service;

import com.lms.dto.CertificateDto;

import java.util.List;

public interface CertificateService {
    CertificateDto generateCertificate(Long courseId, String studentEmail);
    List<CertificateDto> getStudentCertificates(String studentEmail);
    CertificateDto getCertificateByNumber(String certificateNumber);
}
