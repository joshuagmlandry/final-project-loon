import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

// Auth0 log in button

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <StyledButton onClick={() => loginWithRedirect()}>Log in</StyledButton>
  );
};

export default LoginButton;

const StyledButton = styled.button`
  background-color: var(--color-dark-green);
  border: none;
  border-radius: 20px;
  color: var(--color-light-beige);
  font-family: var(--font-body);
  font-size: 1.75rem;
  margin: 0 20px;
  padding: 12px;
  text-decoration: none;
  transition: 200ms;
  &:hover {
    background-color: var(--color-green);
    cursor: pointer;
  }
  @media only screen and (min-width: 768px) {
    font-size: 1.25rem;
    margin: 8px;
    padding: 12px;
  }
`;
