package com.yaga.auth.application.port.in;

import com.yaga.auth.application.dto.AuthResponse;
import com.yaga.auth.application.dto.RefreshTokenRequest;

public interface RefreshTokenUseCase {
  AuthResponse refresh(RefreshTokenRequest request);
}
