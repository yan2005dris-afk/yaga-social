package com.yaga.auth.application.port.in;

import com.yaga.auth.application.dto.AuthResponse;
import com.yaga.auth.application.dto.LoginRequest;

public interface AuthenticateUserUseCase {
  AuthResponse authenticate(LoginRequest request);
}
