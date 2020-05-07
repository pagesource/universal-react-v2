import { css } from 'styled-components';

export default css`
  padding: 0 1.25rem;
  ul {
    padding: 0;
    list-style: none;
    margin: 0;
    display: flex;
    li {
      padding: 0;
      a {
        padding: 0 0.75rem;
        color: #fff555555555;
        text-decoration: none;
        display: block;
      }
    }
  }
  .navbar-toggler-icon {
    background-image: url('../images/x-white.svg');
  }

  &.collapsed {
    .navbar-toggler-icon {
      background-image: url('../images/burger-white.svg');
    }
  }
`;