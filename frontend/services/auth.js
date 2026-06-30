import api from "./api";

export async function login(email, password) {

  const response = await api.post("/auth/login", {
    email,
    password
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  localStorage.setItem(
    "token",
    response.data.access_token
  );

  return response.data;
}

export async function register(name, email, password) {

  const response = await api.post("/auth/register", {
    name,
    email,
    password
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
