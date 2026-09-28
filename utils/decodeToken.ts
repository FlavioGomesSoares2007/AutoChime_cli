export interface TokenPayload {
  sub: string;      
  email: string;
}

export function getUserIdFromToken(token: string): string | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded: TokenPayload = JSON.parse(jsonPayload);

    return  decoded.sub || null;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}