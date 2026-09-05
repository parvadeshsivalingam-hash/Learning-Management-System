package com.lms.dto;

public class ApprovalActionDto {
    private String action; // APPROVE or REJECT
    private String reason;

    public ApprovalActionDto() {}

    public ApprovalActionDto(String action, String reason) {
        this.action = action;
        this.reason = reason;
    }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
