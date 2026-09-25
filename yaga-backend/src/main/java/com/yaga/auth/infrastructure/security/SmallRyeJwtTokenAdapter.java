package com.yaga.auth.infrastructure.security;

import com.yaga.auth.application.port.TokenProviderPort;
import com.yaga.auth.domain.exception.InvalidTokenException;
import com.yaga.auth.domain.model.AuthTokens;
import com.yaga.auth.domain.model.User;
import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.jwt.auth.principal.ParseException;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.Duration;
import java.util.Set;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;

@ApplicationScoped
public class SmallRyeJwtTokenAdapter implements TokenProviderPort {

  private static final Duration ACCESS_TOKEN_EXPIRATION = Duration.ofMinutes(15);
  private static final Duration REFRESH_TOKEN_EXPIRATION = Duration.ofDays(7);

  private final String issuer;
  private final JWTParser jwtParser;

  @Inject
  public SmallRyeJwtTokenAdapter(
      @ConfigProperty(
              name = "mp.jwt.verify.issuer",
              defaultValue = "https://yaga-social.com/issuer")
          String issuer,
      JWTParser jwtParser) {
    this.issuer = issuer;
    this.jwtParser = jwtParser;
  }

  @Override
  public AuthTokens generateTokens(User user) {
    String accessToken =
        Jwt.issuer(issuer)
            .upn(user.username())
            .subject(user.id())
            .groups(Set.of("User"))
            .claim("email", user.email())
            .claim("fullName", user.fullName())
            .claim("type", "access")
            .expiresIn(ACCESS_TOKEN_EXPIRATION)
            .sign();

    String refreshToken =
        Jwt.issuer(issuer)
            .upn(user.username())
            .subject(user.id())
            .claim("type", "refresh")
            .expiresIn(REFRESH_TOKEN_EXPIRATION)
            .sign();

    return new AuthTokens(accessToken, refreshToken, ACCESS_TOKEN_EXPIRATION.toSeconds());
  }

  @Override
  public String extractUserIdFromRefreshToken(String refreshToken) {
    if (refreshToken == null || refreshToken.isBlank()) {
      throw new InvalidTokenException("Refresh token cannot be null or empty");
    }
    try {
      JsonWebToken jwt = jwtParser.parse(refreshToken);
      String tokenType = jwt.getClaim("type");
      if (!"refresh".equals(tokenType)) {
        throw new InvalidTokenException("Invalid token type: expected refresh token");
      }
      String subject = jwt.getSubject();
      if (subject == null || subject.isBlank()) {
        throw new InvalidTokenException("Invalid token: missing subject claim");
      }
      return subject;
    } catch (ParseException e) {
      throw new InvalidTokenException("Failed to verify refresh token: " + e.getMessage());
    }
  }
}
