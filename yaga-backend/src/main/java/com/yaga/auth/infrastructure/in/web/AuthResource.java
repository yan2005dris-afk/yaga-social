package com.yaga.auth.infrastructure.in.web;

import com.yaga.auth.application.dto.AuthResponse;
import com.yaga.auth.application.dto.LoginRequest;
import com.yaga.auth.application.dto.RefreshTokenRequest;
import com.yaga.auth.application.dto.RegisterRequest;
import com.yaga.auth.application.dto.UserDto;
import com.yaga.auth.application.port.in.AuthenticateUserUseCase;
import com.yaga.auth.application.port.in.RefreshTokenUseCase;
import com.yaga.auth.application.port.in.RegisterUserUseCase;
import com.yaga.auth.application.port.out.UserRepositoryPort;
import com.yaga.auth.domain.exception.UserNotFoundException;
import io.quarkus.security.Authenticated;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Objects;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class AuthResource {

  private final RegisterUserUseCase registerUserUseCase;
  private final AuthenticateUserUseCase authenticateUserUseCase;
  private final RefreshTokenUseCase refreshTokenUseCase;
  private final UserRepositoryPort userRepository;
  private final JsonWebToken jwt;

  @Inject
  public AuthResource(
      RegisterUserUseCase registerUserUseCase,
      AuthenticateUserUseCase authenticateUserUseCase,
      RefreshTokenUseCase refreshTokenUseCase,
      UserRepositoryPort userRepository,
      JsonWebToken jwt) {
    this.registerUserUseCase =
        Objects.requireNonNull(registerUserUseCase, "registerUserUseCase must not be null");
    this.authenticateUserUseCase =
        Objects.requireNonNull(authenticateUserUseCase, "authenticateUserUseCase must not be null");
    this.refreshTokenUseCase =
        Objects.requireNonNull(refreshTokenUseCase, "refreshTokenUseCase must not be null");
    this.userRepository = Objects.requireNonNull(userRepository, "userRepository must not be null");
    this.jwt = Objects.requireNonNull(jwt, "jwt must not be null");
  }

  @POST
  @Path("/register")
  public Response register(@Valid RegisterRequest request) {
    AuthResponse response = registerUserUseCase.register(request);
    return Response.status(Response.Status.CREATED).entity(response).build();
  }

  @POST
  @Path("/login")
  public Response login(@Valid LoginRequest request) {
    AuthResponse response = authenticateUserUseCase.authenticate(request);
    return Response.ok(response).build();
  }

  @POST
  @Path("/refresh")
  public Response refresh(@Valid RefreshTokenRequest request) {
    AuthResponse response = refreshTokenUseCase.refresh(request);
    return Response.ok(response).build();
  }

  @GET
  @Path("/me")
  @Authenticated
  public Response getCurrentUser() {
    String userId = jwt.getSubject();
    if (userId == null || userId.isBlank()) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    UserDto userDto =
        userRepository
            .findById(userId)
            .map(UserDto::fromDomain)
            .orElseThrow(() -> new UserNotFoundException("Current user not found"));

    return Response.ok(userDto).build();
  }
}
