package com.lms.dto;

import com.lms.model.Role;

public class SignupRequest {

    private String username;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String bio;

    public SignupRequest() {}

    public String getUsername() {
        if (username != null && !username.isBlank()) {
            return username;
        }
        if (email != null && !email.isBlank()) {
            return email;
        }
        return name;
    }

    public void setUsername(String username) { this.username = username; }

    public String getName() {
        return name != null && !name.isBlank() ? name : getUsername();
    }
    public void setName(String name) { this.name = name; }

    public String getEmail() {
        if (email != null && !email.isBlank()) {
            return email;
        }
        return getUsername() != null && getUsername().contains("@") ? getUsername() : getUsername() + "@lms.com";
    }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
