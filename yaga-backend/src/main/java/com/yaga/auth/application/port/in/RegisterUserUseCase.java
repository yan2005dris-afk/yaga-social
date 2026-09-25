package com.yaga.auth.application.port.in;

import com.yaga.auth.application.dto.AuthResponse;
import com.yaga.auth.application.dto.RegisterRequest;

public interface RegisterUserUseCase {
  AuthResponse register(RegisterRequest request);
}
