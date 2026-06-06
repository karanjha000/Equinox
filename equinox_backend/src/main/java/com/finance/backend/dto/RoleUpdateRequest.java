package com.finance.backend.dto;

import com.finance.backend.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequest {

    @NotNull(message = "Role is required")
    private Role role;
}
