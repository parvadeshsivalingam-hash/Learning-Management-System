package com.lms.service;

import com.lms.dto.SectionDto;

import java.util.List;

public interface SectionService {
    List<SectionDto> getSectionsByCourseId(Long courseId);
    SectionDto createSection(Long courseId, SectionDto sectionDto);
    SectionDto updateSection(Long sectionId, SectionDto sectionDto);
    void deleteSection(Long sectionId);
}
